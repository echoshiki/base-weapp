import { View, Text } from '@tarojs/components';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { Page, Tabs, Card, Skeleton, Empty, Button } from '@/components/ui';
import { mapsTo } from '@/utils/common';
import { useFeedbackList } from '../../hooks';
import { FeedbackCard } from '../../components/FeedbackCard';
import { FEEDBACK_ROUTES } from '../../routes';
import { FeedbackItem, FeedbackStatus } from '../../types';

type FilterStatus = '' | FeedbackStatus;

const PAGE_SIZE = 10;

const STATUS_TABS: { label: string; value: FilterStatus }[] = [
	{ label: '全部', value: '' },
	{ label: '待处理', value: 'pending' },
	{ label: '处理中', value: 'processing' },
	{ label: '已回复', value: 'replied' },
];

export default function FeedbackListPage() {
	const [status, setStatus] = useState<FilterStatus>('');
	const [page, setPage] = useState(1);
	const [list, setList] = useState<FeedbackItem[]>([]);

	const { data, isLoading, isFetching, refetch } = useFeedbackList({
		page,
		pageSize: PAGE_SIZE,
		status: status || undefined,
	});

	useEffect(() => {
		if (!data) return;
		const rows = data.list || [];
		setList((prev) => (page === 1 ? rows : [...prev, ...rows]));
	}, [data, page]);

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

	return (
		<Page paddingX={false}>
			<Tabs tabs={STATUS_TABS} value={status} onChange={handleStatusChange} sticky />

			<View className="container-x py-3 flex flex-col gap-3 flex-1 pb-24">
				{isLoading && page === 1 ? (
					Array.from({ length: 3 }).map((_, idx) => (
						<Card key={idx} className="gap-2.5">
							<View className="flex justify-between">
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-5 w-14" />
							</View>
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
							<Skeleton className="h-3 w-1/3 mt-1" />
						</Card>
					))
				) : list.length === 0 ? (
					<Empty
						title="暂无反馈记录"
						subTitle="遇到任何问题或有好建议，欢迎随时提交"
						buttonText="去提交反馈"
						onButtonClick={() => mapsTo(FEEDBACK_ROUTES.form)}
					/>
				) : (
					<>
						{list.map((item) => (
							<FeedbackCard
								key={item.id}
								item={item}
								onClick={(target) => mapsTo(`${FEEDBACK_ROUTES.detail}?id=${encodeURIComponent(target.id)}`)}
							/>
						))}

						<View className="py-4 flex justify-center">
							<Text className="text-xs text-zinc-400">
								{isFetching ? '加载中...' : hasMore ? '上拉加载更多' : `共 ${list.length} 条记录`}
							</Text>
						</View>
					</>
				)}
			</View>

			{/* 吸底快捷提交栏 */}
			<View className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-100 px-4 py-3 pb-safe z-20">
				<Button size="lg" block variant="primary" icon="icon-[ph--pencil-simple-line-bold]" onClick={() => mapsTo(FEEDBACK_ROUTES.form)}>
					提交新反馈
				</Button>
			</View>
		</Page>
	);
}
