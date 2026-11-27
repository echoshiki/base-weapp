import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useRouter } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { Page, Tabs, Card, Skeleton, Empty } from '@/components/ui';
import { mapsTo } from '@/utils/common';
import { useCancelOrder, useConfirmReceive, useOrderList, usePayOrder } from '../../hooks';
import { OrderCard } from '../../components/OrderCard';
import { SHOP_ROUTES } from '../../routes';
import { OrderItem, OrderStatus } from '../../types';

type FilterStatus = '' | OrderStatus;

const PAGE_SIZE = 10;

const ORDER_TABS: { label: string; value: FilterStatus }[] = [
	{ label: '全部', value: '' },
	{ label: '待付款', value: 'pending_pay' },
	{ label: '待发货', value: 'pending_ship' },
	{ label: '待收货', value: 'pending_receive' },
	{ label: '已完成', value: 'completed' },
];

export default function OrderListPage() {
	const { params } = useRouter();
	const initialStatus = (params.status as FilterStatus) || '';

	const [status, setStatus] = useState<FilterStatus>(initialStatus);
	const [page, setPage] = useState(1);
	const [list, setList] = useState<OrderItem[]>([]);

	const { data, isLoading, isFetching, refetch } = useOrderList({
		page,
		pageSize: PAGE_SIZE,
		status: status || undefined,
	});
	const { mutate: payOrder } = usePayOrder();
	const { mutate: cancelOrder } = useCancelOrder();
	const { mutate: confirmReceive } = useConfirmReceive();

	useEffect(() => {
		if (!data) return;
		const rows = data.list || [];
		setList((prev) => (page === 1 ? rows : [...prev, ...rows]));
	}, [data, page]);

	useDidShow(() => {
		refetch().catch(() => {});
	});

	const total = data?.total ?? 0;
	const hasMore = data?.hasMore ?? list.length < total;

	const handleStatusChange = (val: FilterStatus) => {
		setStatus(val);
		setPage(1);
		setList([]);
	};

	usePullDownRefresh(async () => {
		setPage(1);
		await refetch();
		Taro.stopPullDownRefresh();
	});

	useReachBottom(() => {
		if (isFetching || !hasMore) return;
		setPage((prev) => prev + 1);
	});

	const handleCancel = (target: OrderItem) => {
		Taro.showModal({
			title: '取消订单',
			content: '确定要取消这笔订单吗？',
			confirmColor: '#f43f5e',
			success: (res) => res.confirm && cancelOrder(target.id),
		});
	};

	const handleConfirmReceive = (target: OrderItem) => {
		Taro.showModal({
			title: '确认收货',
			content: '请确认您已收到商品且核验无误。',
			success: (res) => res.confirm && confirmReceive(target.id),
		});
	};

	return (
		<Page paddingX={false} title="我的订单">
			<Tabs tabs={ORDER_TABS} value={status} onChange={handleStatusChange} scrollable sticky />

			<View className="container-x py-3 flex flex-col gap-3 flex-1">
				{isLoading && page === 1 ? (
					Array.from({ length: 3 }).map((_, idx) => (
						<Card key={idx} className="gap-3">
							<View className="flex justify-between">
								<Skeleton className="h-4 w-36" />
								<Skeleton className="h-5 w-14" />
							</View>
							<View className="flex gap-3">
								<Skeleton className="size-16 rounded-lg shrink-0" />
								<View className="flex-1 flex flex-col gap-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-3 w-1/2" />
								</View>
							</View>
						</Card>
					))
				) : list.length === 0 ? (
					<Empty
						title="暂无相关订单"
						subTitle="去商城逛逛，挑几件心仪好物吧"
						buttonText="去逛逛"
						onButtonClick={() => mapsTo(SHOP_ROUTES.goodsList)}
					/>
				) : (
					<>
						{list.map((item) => (
							<OrderCard
								key={item.id}
								item={item}
								onClick={(target) => mapsTo(`${SHOP_ROUTES.orderDetail}?id=${encodeURIComponent(target.id)}`)}
								onPay={(target) => payOrder(target.id)}
								onCancel={handleCancel}
								onConfirmReceive={handleConfirmReceive}
							/>
						))}

						<View className="py-4 flex justify-center">
							<Text className="text-xs text-zinc-400">
								{isFetching ? '加载中...' : hasMore ? '上拉加载更多' : `共 ${list.length} 笔订单`}
							</Text>
						</View>
					</>
				)}
			</View>
		</Page>
	);
}
