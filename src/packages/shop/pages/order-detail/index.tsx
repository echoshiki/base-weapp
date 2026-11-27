import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import {
	Page,
	Card,
	Icon,
	Badge,
	Divider,
	DescriptionList,
	Description,
	Price,
	Button,
	Skeleton,
	Empty,
} from '@/components/ui';
import { mapsTo } from '@/utils/common';
import { useCancelOrder, useConfirmReceive, useOrderDetail, usePayOrder } from '../../hooks';
import { SHOP_ROUTES } from '../../routes';
import { ORDER_STATUS_META } from '../../types';

export default function OrderDetailPage() {
	const { params } = useRouter();
	const id = params.id ? decodeURIComponent(params.id) : '';

	const { data: detail, isLoading } = useOrderDetail(id);
	const { mutate: payOrder, isLoading: isPaying } = usePayOrder();
	const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder();
	const { mutate: confirmReceive, isLoading: isConfirming } = useConfirmReceive();

	const copyText = (text: string, label: string) => {
		Taro.setClipboardData({
			data: text,
			success: () => Taro.showToast({ title: `${label}已复制`, icon: 'none' }),
		});
	};

	const handleCancel = () => {
		if (!detail) return;
		Taro.showModal({
			title: '取消订单',
			content: '确定要取消这笔订单吗？',
			confirmColor: '#f43f5e',
			success: (res) => res.confirm && cancelOrder(detail.id),
		});
	};

	const handleConfirmReceive = () => {
		if (!detail) return;
		Taro.showModal({
			title: '确认收货',
			content: '请确认您已收到商品且核验无误。',
			success: (res) => res.confirm && confirmReceive(detail.id),
		});
	};

	const meta = detail ? ORDER_STATUS_META[detail.status] || ORDER_STATUS_META.pending_pay : null;
	const fullAddress = detail?.address
		? `${detail.address.province}${detail.address.city}${detail.address.district} ${detail.address.detail}`.trim()
		: '';
	const showBottomActions = detail && (detail.status === 'pending_pay' || detail.status === 'pending_receive');

	return (
		<Page title="订单详情">
			<View className="py-3 flex flex-col gap-3 flex-1 pb-28">
				{isLoading ? (
					<>
						<Card className="gap-2.5">
							<Skeleton className="h-6 w-28" />
							<Skeleton className="h-4 w-2/3" />
						</Card>
						<Card className="gap-3">
							<Skeleton className="h-16 w-full" />
							<Skeleton className="h-16 w-full" />
						</Card>
					</>
				) : !detail || !meta ? (
					<Empty title="订单不存在或已删除" subTitle="请返回订单列表查看其他订单" />
				) : (
					<>
						{/* 顶部状态卡片 */}
						<Card layout="horizontal" className="items-center gap-3 py-4">
							<Icon icon={meta.icon} shape="circle" size="md" theme={meta.theme} />
							<View className="flex-1 min-w-0 flex flex-col gap-1">
								<View className="flex items-center gap-2">
									<Text className="text-base font-bold">{meta.label}</Text>
									<Badge variant={meta.theme}>{meta.label}</Badge>
								</View>
								<Text className="text-xs text-zinc-500">{meta.desc}</Text>
							</View>
						</Card>

						{/* 物流信息（已发货时展示） */}
						{detail.expressNo && (
							<Card layout="horizontal" className="items-center gap-3 py-3.5">
								<Icon icon="icon-[ph--truck]" shape="square" size="sm" theme="blue" />
								<View className="flex-1 min-w-0 flex flex-col gap-0.5">
									<Text className="text-sm font-semibold">{detail.expressCompany || '快递配送'}</Text>
									<Text className="text-xs text-zinc-500 truncate">运单号：{detail.expressNo}</Text>
								</View>
								<Button
									size="xs"
									variant="zinc"
									appearance="outline"
									onClick={() => copyText(detail.expressNo!, '运单号')}
								>
									复制
								</Button>
							</Card>
						)}

						{/* 收货地址 */}
						<Card layout="horizontal" className="items-start gap-3 py-3.5">
							<Icon icon="icon-[ph--map-pin]" shape="square" size="sm" theme="zinc" />
							<View className="flex-1 min-w-0 flex flex-col gap-1">
								<View className="flex items-center gap-2">
									<Text className="text-sm font-bold">{detail.address.name}</Text>
									<Text className="text-xs text-zinc-500">{detail.address.phone}</Text>
								</View>
								<Text className="text-xs text-zinc-600 leading-relaxed">{fullAddress}</Text>
							</View>
						</Card>

						{/* 商品清单 */}
						<Card className="gap-3">
							{detail.items.map((goods, idx) => (
								<View key={`${goods.goodsId}_${goods.skuId}`}>
									{idx > 0 && <Divider className="mb-3" />}
									<View
										className="flex items-start gap-3 cursor-pointer active:opacity-75"
										onClick={() => mapsTo(`${SHOP_ROUTES.goodsDetail}?id=${encodeURIComponent(goods.goodsId)}`)}
									>
										<Image
											src={goods.image}
											mode="aspectFill"
											className="size-18 rounded-lg bg-zinc-100 shrink-0"
										/>
										<View className="flex-1 min-w-0 flex flex-col gap-1">
											<Text className="text-sm font-semibold leading-snug line-clamp-2">{goods.title}</Text>
											{goods.specText && <Text className="text-xs text-zinc-400 truncate">{goods.specText}</Text>}
											<View className="flex items-baseline justify-between pt-1">
												<Price value={goods.price} inCent size="sm" variant="zinc" />
												<Text className="text-xs text-zinc-400">×{goods.quantity}</Text>
											</View>
										</View>
									</View>
								</View>
							))}
						</Card>

						{/* 金额与订单信息 */}
						<Card className="gap-2">
							<DescriptionList divider>
								<Description
									label="订单编号"
									variant="between"
									value={
										<View className="flex items-center gap-2">
											<Text className="text-xs text-zinc-700">{detail.orderNo}</Text>
											<Text
												className="text-xs text-primary font-medium cursor-pointer active:opacity-70"
												onClick={() => copyText(detail.orderNo, '订单编号')}
											>
												复制
											</Text>
										</View>
									}
								/>
								<Description label="下单时间" variant="between" value={detail.createTime} />
								{detail.payTime && <Description label="支付时间" variant="between" value={detail.payTime} />}
								{detail.remark && <Description label="买家备注" variant="between" value={detail.remark} />}
								<Description
									label="商品金额"
									variant="between"
									value={<Price value={detail.goodsAmount} inCent size="sm" variant="zinc" />}
								/>
								<Description
									label="运费"
									variant="between"
									value={
										detail.freightAmount > 0 ? (
											<Price value={detail.freightAmount} inCent size="sm" variant="zinc" />
										) : (
											<Text className="text-xs text-emerald-600 font-medium">免运费</Text>
										)
									}
								/>
								<Description
									label="实付金额"
									variant="between"
									value={<Price value={detail.payAmount} inCent size="md" />}
								/>
							</DescriptionList>
						</Card>
					</>
				)}
			</View>

			{/* 吸底操作栏 */}
			{showBottomActions && (
				<View className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-100 px-4 py-2.5 pb-safe z-20 flex items-center justify-end gap-3">
					{detail.status === 'pending_pay' && (
						<>
							<Button
								size="md"
								variant="zinc"
								appearance="outline"
								loading={isCancelling}
								disabled={isPaying || isCancelling}
								onClick={handleCancel}
							>
								取消订单
							</Button>
							<Button
								size="md"
								variant="primary"
								loading={isPaying}
								disabled={isPaying || isCancelling}
								onClick={() => payOrder(detail.id)}
							>
								立即支付
							</Button>
						</>
					)}

					{detail.status === 'pending_receive' && (
						<Button
							size="md"
							variant="primary"
							loading={isConfirming}
							onClick={handleConfirmReceive}
						>
							确认收货
						</Button>
					)}
				</View>
			)}
		</Page>
	);
}
