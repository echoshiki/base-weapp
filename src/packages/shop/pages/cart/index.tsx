import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { useState } from 'react';
import { Page, Card, Skeleton, Empty, Button, Price, Heading } from '@/components/ui';
import { cn, mapsTo } from '@/utils/common';
import {
	useCartList,
	useRemoveCartItems,
	useToggleAllCart,
	useUpdateCartItem,
} from '../../hooks';
import { CartItemCard } from '../../components/CartItemCard';
import { SHOP_ROUTES } from '../../routes';
import { CartItem } from '../../types';

export default function CartPage() {
	const [editing, setEditing] = useState(false);
	const [editCheckedIds, setEditCheckedIds] = useState<string[]>([]);

	const {
		items,
		validItems,
		invalidItems,
		selectedItems,
		totalCount,
		selectedCount,
		totalPrice,
		isAllSelected,
		isLoading,
		refetch,
	} = useCartList();

	const { mutate: updateItem } = useUpdateCartItem();
	const { mutate: toggleAll } = useToggleAllCart();
	const { mutateAsync: removeItems, isLoading: isRemoving } = useRemoveCartItems();

	useDidShow(() => {
		refetch().catch(() => {});
	});

	usePullDownRefresh(async () => {
		await refetch();
		Taro.stopPullDownRefresh();
	});

	const isAllEditChecked = items.length > 0 && editCheckedIds.length === items.length;

	const handleToggleEditMode = () => {
		setEditing((prev) => !prev);
		setEditCheckedIds([]);
	};

	const handleToggleItem = (target: CartItem) => {
		if (editing) {
			setEditCheckedIds((prev) =>
				prev.includes(target.id) ? prev.filter((id) => id !== target.id) : [...prev, target.id],
			);
			return;
		}
		updateItem({ id: target.id, selected: !target.selected });
	};

	const handleToggleAll = () => {
		if (editing) {
			setEditCheckedIds(isAllEditChecked ? [] : items.map((item) => item.id));
			return;
		}
		if (validItems.length === 0) return;
		toggleAll(!isAllSelected);
	};

	const handleQuantityChange = (target: CartItem, quantity: number) => {
		updateItem({ id: target.id, quantity });
	};

	const handleRemoveSelected = () => {
		if (editCheckedIds.length === 0 || isRemoving) return;
		Taro.showModal({
			title: '移除商品',
			content: `确定从购物车移除已选的 ${editCheckedIds.length} 件商品吗？`,
			confirmColor: '#f43f5e',
			success: async (res) => {
				if (!res.confirm) return;
				await removeItems(editCheckedIds);
				setEditCheckedIds([]);
			},
		});
	};

	const handleClearInvalid = () => {
		if (invalidItems.length === 0 || isRemoving) return;
		Taro.showModal({
			title: '清空失效商品',
			content: `确定清空 ${invalidItems.length} 件已失效商品吗？`,
			confirmColor: '#f43f5e',
			success: async (res) => {
				if (!res.confirm) return;
				await removeItems(invalidItems.map((item) => item.id));
			},
		});
	};

	const handleCheckout = () => {
		if (selectedCount <= 0 || selectedItems.length === 0) {
			Taro.showToast({ title: '请先选择要结算的商品', icon: 'none' });
			return;
		}
		const cartIds = selectedItems.map((item) => item.id).join(',');
		mapsTo(`${SHOP_ROUTES.checkout}?mode=cart&cartIds=${encodeURIComponent(cartIds)}`);
	};

	const goGoodsDetail = (item: CartItem) => {
		mapsTo(`${SHOP_ROUTES.goodsDetail}?id=${encodeURIComponent(item.goodsId)}`);
	};

	return (
		<Page title="购物车">
			<View className="py-3 flex flex-col gap-3 flex-1 pb-28">
				{/* 顶部状态与管理切换栏 */}
				{items.length > 0 && (
					<View className="flex items-center justify-between px-1">
						<Text className="text-xs text-zinc-500">共 {totalCount} 件有效商品</Text>
						<Text
							className="text-xs font-medium text-primary cursor-pointer active:opacity-70"
							onClick={handleToggleEditMode}
						>
							{editing ? '完成' : '管理'}
						</Text>
					</View>
				)}

				{isLoading ? (
					Array.from({ length: 3 }).map((_, idx) => (
						<Card key={idx} layout="horizontal" className="py-3 items-center gap-3">
							<Skeleton className="size-5 rounded-full shrink-0" />
							<Skeleton className="size-20 rounded-lg shrink-0" />
							<View className="flex-1 flex flex-col gap-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-5 w-1/3 mt-1" />
							</View>
						</Card>
					))
				) : items.length === 0 ? (
					<Empty
						title="购物车还是空的"
						subTitle="去挑选几件喜欢的商品吧"
						buttonText="去逛逛"
						onButtonClick={() => mapsTo(SHOP_ROUTES.goodsList)}
					/>
				) : (
					<>
						{/* 有效商品列表 */}
						{validItems.map((item) => (
							<CartItemCard
								key={item.id}
								item={item}
								editing={editing}
								checked={editCheckedIds.includes(item.id)}
								onToggle={handleToggleItem}
								onQuantityChange={handleQuantityChange}
								onGoodsClick={goGoodsDetail}
							/>
						))}

						{/* 失效商品分组 */}
						{invalidItems.length > 0 && (
							<View className="flex flex-col gap-2.5 pt-2">
								<Heading
									title={`已失效商品 (${invalidItems.length})`}
									size="sm"
									extra={
										<Text
											className="text-xs text-zinc-500 active:text-rose-500 cursor-pointer"
											onClick={handleClearInvalid}
										>
											清空失效
										</Text>
									}
								/>
								{invalidItems.map((item) => (
									<CartItemCard
										key={item.id}
										item={item}
										editing={editing}
										checked={editCheckedIds.includes(item.id)}
										onToggle={handleToggleItem}
										onGoodsClick={goGoodsDetail}
									/>
								))}
							</View>
						)}
					</>
				)}
			</View>

			{/* 吸底结算 / 管理栏 */}
			{items.length > 0 && (
				<View className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-100 px-4 py-2.5 pb-safe z-20 flex items-center justify-between gap-3">
					<View
						className="flex items-center gap-2 cursor-pointer active:opacity-70 shrink-0"
						onClick={handleToggleAll}
					>
						<View
							className={cn(
								'size-5',
								(editing ? isAllEditChecked : isAllSelected)
									? 'icon-[ph--check-circle-fill] text-primary'
									: 'icon-[ph--circle] text-zinc-300',
							)}
						/>
						<Text className="text-sm text-zinc-700">全选</Text>
					</View>

					{editing ? (
						<Button
							size="md"
							variant="rose"
							appearance="outline"
							disabled={editCheckedIds.length === 0}
							loading={isRemoving}
							onClick={handleRemoveSelected}
						>
							删除所选 ({editCheckedIds.length})
						</Button>
					) : (
						<View className="flex items-center gap-3 min-w-0">
							<View className="flex items-baseline gap-1">
								<Text className="text-xs text-zinc-500">合计</Text>
								<Price value={totalPrice} inCent size="lg" />
							</View>
							<Button
								size="md"
								variant="primary"
								disabled={selectedCount <= 0}
								onClick={handleCheckout}
							>
								去结算 ({selectedCount})
							</Button>
						</View>
					)}
				</View>
			)}
		</Page>
	);
}
