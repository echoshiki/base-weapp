import { View, Text, Image } from '@tarojs/components';
import { Badge, Card, Price, Stepper } from '@/components/ui';
import { cn } from '@/utils/common';
import { CartItem } from '../types';

export interface CartItemCardProps {
	item: CartItem;
	/** 是否处于管理/编辑删除模式 */
	editing?: boolean;
	/** 编辑模式下的选中态（由页面单独维护） */
	checked?: boolean;
	onToggle?: (item: CartItem) => void;
	onQuantityChange?: (item: CartItem, quantity: number) => void;
	onGoodsClick?: (item: CartItem) => void;
}

/**
 * 购物车商品行卡片组件
 */
export function CartItemCard({
	item,
	editing = false,
	checked,
	onToggle,
	onQuantityChange,
	onGoodsClick,
}: CartItemCardProps) {
	const isInvalid = Boolean(item.invalid || item.stock <= 0);
	const isChecked = editing ? Boolean(checked) : item.selected;

	return (
		<Card layout="horizontal" className={cn('py-3 items-center gap-3', isInvalid && !editing && 'opacity-65')}>
			{/* 左侧勾选框或失效标识 */}
			{isInvalid && !editing ? (
				<Badge variant="zinc" className="shrink-0">
					失效
				</Badge>
			) : (
				<View
					className="p-1 -ml-1 cursor-pointer shrink-0 active:opacity-70"
					onClick={() => onToggle?.(item)}
				>
					<View
						className={cn(
							'size-5',
							isChecked ? 'icon-[ph--check-circle-fill] text-primary' : 'icon-[ph--circle] text-zinc-300',
						)}
					/>
				</View>
			)}

			{/* 商品缩略图 */}
			<Image
				src={item.image}
				mode="aspectFill"
				lazyLoad
				className="size-20 rounded-lg bg-zinc-100 shrink-0 cursor-pointer"
				onClick={() => onGoodsClick?.(item)}
			/>

			{/* 右侧商品信息与数量控制 */}
			<View className="flex-1 min-w-0 flex flex-col justify-between gap-2 self-stretch">
				<View className="flex flex-col gap-1">
					<Text
						className="text-sm font-semibold leading-snug line-clamp-2 cursor-pointer"
						onClick={() => onGoodsClick?.(item)}
					>
						{item.title}
					</Text>
					{item.specText && (
						<View className="inline-flex w-fit max-w-full px-2 py-0.5 rounded bg-zinc-100">
							<Text className="text-xs text-zinc-500 truncate">{item.specText}</Text>
						</View>
					)}
				</View>

				<View className="flex items-center justify-between gap-2">
					<Price value={item.price} originalPrice={item.originalPrice} inCent size="md" />
					{isInvalid ? (
						<Text className="text-xs text-zinc-400">商品已下架或无货</Text>
					) : (
						<Stepper
							size="sm"
							value={item.quantity}
							min={1}
							max={Math.max(1, item.stock)}
							onChange={(val) => onQuantityChange?.(item, val)}
						/>
					)}
				</View>
			</View>
		</Card>
	);
}
