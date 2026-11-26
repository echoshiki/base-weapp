import { View, Text } from '@tarojs/components';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { useEffect, useMemo, useState } from 'react';
import { Page, SearchBar, Tabs, Skeleton, Empty, Card } from '@/components/ui';
import { mapsTo } from '@/utils/common';
import { useArticleCategories, useArticleList } from '../../hooks';
import { ArticleCard } from '../../components/ArticleCard';
import { ARTICLE_ROUTES } from '../../routes';
import { ArticleItem } from '../../types';

const PAGE_SIZE = 10;

export default function ArticleListPage() {
	const [categoryId, setCategoryId] = useState<string>('');
	const [inputValue, setInputValue] = useState('');
	const [keyword, setKeyword] = useState('');
	const [page, setPage] = useState(1);
	const [list, setList] = useState<ArticleItem[]>([]);

	const { data: categories = [] } = useArticleCategories();
	const { data, isLoading, isFetching, refetch } = useArticleList({
		page,
		pageSize: PAGE_SIZE,
		categoryId: categoryId || undefined,
		keyword: keyword || undefined,
	});

	const tabs = useMemo(
		() => [{ label: '全部', value: '' }, ...categories.map((c) => ({ label: c.name, value: c.id }))],
		[categories],
	);

	// 合并分页数据
	useEffect(() => {
		if (!data) return;
		const rows = data.list || [];
		setList((prev) => (page === 1 ? rows : [...prev, ...rows]));
	}, [data, page]);

	const total = data?.total ?? 0;
	const hasMore = data?.hasMore ?? list.length < total;

	const handleCategoryChange = (val: string) => {
		setCategoryId(val);
		setPage(1);
		setList([]);
	};

	const handleSearch = (val = inputValue) => {
		setKeyword(val.trim());
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
			{/* 顶部吸顶搜索与分类栏 */}
			<View className="sticky top-0 z-10 bg-white border-b border-zinc-100">
				<View className="px-4 pt-3 pb-1">
					<SearchBar
						variant="filled"
						value={inputValue}
						placeholder="搜索文章标题或关键词..."
						onInput={setInputValue}
						onConfirm={() => handleSearch()}
						onClear={() => handleSearch('')}
					/>
				</View>
				<Tabs
					tabs={tabs}
					value={categoryId}
					onChange={handleCategoryChange}
					scrollable={tabs.length > 4}
					hasBackground={false}
				/>
			</View>

			{/* 文章列表内容区 */}
			<View className="container-x py-3 flex flex-col gap-3 flex-1">
				{isLoading && page === 1 ? (
					Array.from({ length: 4 }).map((_, idx) => (
						<Card key={idx} layout="horizontal" className="py-3.5">
							<Skeleton className="w-26 h-20 rounded-lg" />
							<View className="flex-1 flex flex-col justify-between py-0.5">
								<View className="flex flex-col gap-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-2/3" />
								</View>
								<Skeleton className="h-3 w-1/2" />
							</View>
						</Card>
					))
				) : list.length === 0 ? (
					<Empty
						title="暂无相关文章"
						subTitle={keyword ? `未找到包含“${keyword}”的内容` : '当前分类下还没有发布文章'}
						buttonText={keyword ? '清空搜索' : undefined}
						onButtonClick={
							keyword
								? () => {
										setInputValue('');
										handleSearch('');
									}
								: undefined
						}
					/>
				) : (
					<>
						{list.map((item) => (
							<ArticleCard
								key={item.id}
								item={item}
								onClick={(target) =>
									mapsTo(`${ARTICLE_ROUTES.detail}?id=${encodeURIComponent(target.id)}`)
								}
							/>
						))}

						<View className="py-4 flex justify-center">
							<Text className="text-xs text-zinc-400">
								{isFetching
									? '加载中...'
									: hasMore
										? '上拉加载更多'
										: `已加载全部 ${list.length} 篇文章`}
							</Text>
						</View>
					</>
				)}
			</View>
		</Page>
	);
}
