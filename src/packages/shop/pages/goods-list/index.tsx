import { View, Text } from '@tarojs/components';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { useEffect, useMemo, useState } from 'react';
import { Page, SearchBar, Tabs, Card, Skeleton, Empty, AspectRatio } from '@/components/ui';
import { cn, mapsTo } from '@/utils/common';
import { useCartList, useGoodsCategories, useGoodsList } from '../../hooks';
import { GoodsCard } from '../../components/GoodsCard';
import { SHOP_ROUTES } from '../../routes';
import { GoodsItem, GoodsSort } from '../../types';

const PAGE_SIZE = 10;

export default function GoodsListPage() {
	const [inputVal, setInputVal] = useState('');
	const [keyword, setKeyword] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [sort, setSort] = useState<GoodsSort>('default');
	const [page, setPage] = useState(1);
	const [list, setList] = useState<GoodsItem[]>([]);

	const { data: categories = [] } = useGoodsCategories();
	const { totalCount: cartCount } = useCartList();
	const { data, isLoading, isFetching, refetch } = useGoodsList({
		page,
		pageSize: PAGE_SIZE,
		keyword: keyword || undefined,
		categoryId: categoryId || undefined,
		sort,
	});

	const categoryTabs = useMemo(
		() => [{ label: '全部', value: '' }, ...categories.map((c) => ({ label: c.name, value: c.id }))],
		[categories],
	);

	useEffect(() => {
		if (!data) return;
		const rows = data.list || [];
		setList((prev) => (page === 1 ? rows : [...prev, ...rows]));
	}, [data, page]);

	const total = data?.total ?? 0;
	const hasMore = data?.hasMore ?? list.length < total;

	const resetAndQuery = (next: { keyword?: string; categoryId?: string; sort?: GoodsSort }) => {
		if (next.keyword !== undefined) setKeyword(next.keyword);
		if (next.categoryId !== undefined) setCategoryId(next.categoryId);
		if (next.sort !== undefined) setSort(next.sort);
		setPage(1);
		setList([]);
	};

	const handlePriceSort = () => {
		const nextSort: GoodsSort = sort === 'price_asc' ? 'price_desc' : 'price_asc';
		resetAndQuery({ sort: nextSort });
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
		<Page paddingX={false} title="精选商品">
			{/* 顶部搜索 + 分类 + 排序栏 */}
			<View className="bg-white border-b border-zinc-100">
				<View className="px-4 pt-3 pb-2">
					<SearchBar
						value={inputVal}
						placeholder="搜索商品名称、关键词"
						onInput={setInputVal}
						onConfirm={() => resetAndQuery({ keyword: inputVal.trim() })}
						onClear={() => {
							setInputVal('');
							resetAndQuery({ keyword: '' });
						}}
						action={
							<View
								className="relative size-10 rounded-full bg-zinc-100/80 flex items-center justify-center text-zinc-700 active:bg-zinc-200 cursor-pointer shrink-0"
								onClick={() => mapsTo(SHOP_ROUTES.cart)}
							>
								<View className="icon-[ph--shopping-cart-simple] size-5" />
								{cartCount > 0 && (
									<View className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-xs font-semibold flex items-center justify-center leading-none">
										<Text>{cartCount > 99 ? '99+' : cartCount}</Text>
									</View>
								)}
							</View>
						}
					/>
				</View>

				{categoryTabs.length > 1 && (
					<Tabs
						tabs={categoryTabs}
						value={categoryId}
						scrollable
						onChange={(val) => resetAndQuery({ categoryId: val })}
					/>
				)}

				<View className="flex items-center justify-around py-2.5 text-xs border-t border-zinc-100/80">
					<View
						className={cn(
							'px-3 py-1 cursor-pointer transition-colors',
							sort === 'default' ? 'text-primary font-semibold' : 'text-zinc-500',
						)}
						onClick={() => sort !== 'default' && resetAndQuery({ sort: 'default' })}
					>
						<Text>综合</Text>
					</View>

					<View
						className={cn(
							'px-3 py-1 cursor-pointer transition-colors',
							sort === 'sales' ? 'text-primary font-semibold' : 'text-zinc-500',
						)}
						onClick={() => sort !== 'sales' && resetAndQuery({ sort: 'sales' })}
					>
						<Text>销量</Text>
					</View>

					<View
						className={cn(
							'px-3 py-1 flex items-center gap-0.5 cursor-pointer transition-colors',
							sort === 'price_asc' || sort === 'price_desc' ? 'text-primary font-semibold' : 'text-zinc-500',
						)}
						onClick={handlePriceSort}
					>
						<Text>价格</Text>
						<View
							className={cn(
								'size-3.5',
								sort === 'price_asc'
									? 'icon-[ph--caret-up-bold]'
									: sort === 'price_desc'
										? 'icon-[ph--caret-down-bold]'
										: 'icon-[ph--caret-up-down]',
							)}
						/>
					</View>
				</View>
			</View>

			{/* 双列商品列表 */}
			<View className="container-x py-3 flex-1">
				{isLoading && page === 1 ? (
					<View className="grid grid-cols-2 gap-3">
						{Array.from({ length: 4 }).map((_, idx) => (
							<Card key={idx} noPadding className="overflow-hidden">
								<AspectRatio ratio={1}>
									<Skeleton className="size-full rounded-none" />
								</AspectRatio>
								<View className="p-2.5 flex flex-col gap-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-2/3" />
									<Skeleton className="h-5 w-1/2 mt-1" />
								</View>
							</Card>
						))}
					</View>
				) : list.length === 0 ? (
					<Empty
						title="暂无相关商品"
						subTitle={keyword ? `未找到与「${keyword}」匹配的商品` : '商家正在上架新品，敬请期待'}
						buttonText={keyword ? '清空搜索' : undefined}
						onButtonClick={
							keyword
								? () => {
										setInputVal('');
										resetAndQuery({ keyword: '' });
									}
								: undefined
						}
					/>
				) : (
					<>
						<View className="grid grid-cols-2 gap-3">
							{list.map((item) => (
								<GoodsCard
									key={item.id}
									item={item}
									onClick={(target) => mapsTo(`${SHOP_ROUTES.goodsDetail}?id=${encodeURIComponent(target.id)}`)}
								/>
							))}
						</View>

						<View className="py-5 flex justify-center">
							<Text className="text-xs text-zinc-400">
								{isFetching ? '加载中...' : hasMore ? '上拉加载更多' : `共 ${list.length} 件商品`}
							</Text>
						</View>
					</>
				)}
			</View>
		</Page>
	);
}
