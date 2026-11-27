import { View, Text, Image } from '@tarojs/components';
import { Badge, Button, Card, Divider, Price } from '@/components/ui';
import { ORDER_STATUS_META, OrderItem } from '../types';

export interface OrderCardProps {
	item: OrderItem;
	onClick?: (item: OrderItem) => void;
	onPay?: (item: OrderItem) => void;
	onCancel?: (item: OrderItem) => void;
	onConfirmReceive?: (item: OrderItem) => void;
}

/**
 * 订单列表卡片组件
 */
export function OrderCard({ item, onClick, onPay, onCancel, onConfirmReceive }: OrderCardProps) {
	const meta = ORDER_STATUS_META[item.status] || ORDER_STATUS_META.pending_pay;
	const totalQty = item.items.reduce((acc, g) => acc + g.quantity, 0);

	return (
		<Card className="gap-3" onClick={() => onClick?.(item)}>
			{/* 头部：订单号 + 状态 */}
			<View className="flex items-center justify-between gap-2">
				<Text className="text-xs text-zinc-500 truncate">订单号：{item.orderNo}</Text>
				<Badge variant={meta.theme} dot>
					{meta.label}
				</Badge>
			</View>

			<Divider />

			{/* 商品清单 */}
			<View className="flex flex-col gap-3">
				{item.items.map((goods) => (
					<View key={`${goods.goodsId}_${goods.skuId}`} className="flex items-start gap-3">
						<Image src={goods.image} mode="aspectFill" lazyLoad className="size-16 rounded-lg bg-zinc-100 shrink-0" />
						<View className="flex-1 min-w-0 flex flex-col gap-1">
							<Text className="text-sm font-medium leading-snug line-clamp-2">{goods.title}</Text>
							{goods.specText && <Text className="text-xs text-zinc-400 truncate">{goods.specText}</Text>}
						</View>
						<View className="flex flex-col items-end gap-1 shrink-0">
							<Price value={goods.price} inCent size="sm" variant="zinc" />
							<Text className="text-xs text-zinc-400">×{goods.quantity}</Text>
						</View>
					</View>
				))}
			</View>

			{/* 金额汇总 */}
			<View className="flex items-baseline justify-end gap-2 pt-1">
				<Text className="text-xs text-zinc-500">共 {totalQty} 件，实付</Text>
				<Price value={item.payAmount} inCent size="md" />
			</View>

			{/* 底部状态操作栏 */}
			{(item.status === 'pending_pay' || item.status === 'pending_receive') && (
				<>
					<Divider />
					<View
						className="flex items-center justify-end gap-2"
						onClick={(e) => e.stopPropagation()}
					>
						{item.status === 'pending_pay' && (
							<>
								<Button size="xs" variant="zinc" appearance="outline" onClick={() => onCancel?.(item)}>
									取消订单
								</Button>
								<Button size="xs" variant="primary" onClick={() => onPay?.(item)}>
									立即支付
								</Button>
							</>
						)}
						{item.status === 'pending_receive' && (
							<Button size="xs" variant="primary" onClick={() => onConfirmReceive?.(item)}>
								确认收货
							</Button>
						)}
					</View>
				</>
			)}
		</Card>
	);
}
