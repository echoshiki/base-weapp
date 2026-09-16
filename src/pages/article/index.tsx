import { useMemo } from 'react';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Page, Card, Loading, Empty, Skeleton } from '@/components/ui';
import { useInfiniteArticleList } from '@/hooks/useArticle';
import { mapsTo, formatDateToDay } from '@/utils/common';

export default function ArticleListPage() {
	// 无限滚动拉取文章列表
	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteArticleList(10);

	// 拍平分页数据
	const articleList = useMemo(() => {
		if (!data?.pages) return [];
		return data.pages.flatMap((page) => page.list || []);
	}, [data]);

	// 下拉刷新
	usePullDownRefresh(async () => {
		try {
			await refetch();
		} finally {
			Taro.stopPullDownRefresh();
		}
	});

	// 上拉触底加载下一页
	useReachBottom(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	});

	return (
		<Page paddingX={false} className="bg-gray-100 min-h-screen pb-10">
			<View className="container-x pt-4 flex flex-col gap-3.5">
				{isLoading ? (
					// 初始骨架屏
					<View className="flex flex-col gap-3">
						<Card className="p-4 flex flex-col gap-3">
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-28 w-full rounded-xl" />
							<Skeleton className="h-4 w-3/4" />
						</Card>
						<Card className="p-4 flex flex-col gap-3">
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-28 w-full rounded-xl" />
							<Skeleton className="h-4 w-3/4" />
						</Card>
					</View>
				) : articleList.length === 0 ? (
					// 空状态
					<View className="py-16">
						<Empty title="暂无相关文章" subTitle="平台常见问题、典当指南与服务指引将在此更新" />
					</View>
				) : (
					// 文章列表卡片
					articleList.map((item) => (
						<Card
							key={item.articleId}
							className="flex flex-col gap-3 active:opacity-90 transition-opacity cursor-pointer overflow-hidden"
							onClick={() => mapsTo(`/pages/article/detail/index?id=${item.articleId}`)}
						>
							{/* 封面图片 (若存在) */}
							{item.imgPath && (
								<View className="w-full h-36 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/50 relative">
									<Image src={item.imgPath} mode="aspectFill" className="w-full h-full" />
								</View>
							)}

							{/* 标题与摘要 */}
							<View className="flex flex-col gap-1.5">
								<Text className="text-base font-bold text-text-title line-clamp-2 leading-snug">
									{item.title}
								</Text>
								{item.summary && (
									<Text className="text-xs text-text-muted/80 line-clamp-2 leading-relaxed">
										{item.summary}
									</Text>
								)}
							</View>

							{/* 底部元信息栏 */}
							<View className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-text-muted/70">
								<View className="flex items-center gap-3">
									{item.createTime && (
										<View className="flex items-center gap-1">
											<View className="icon-[ph--calendar-blank] size-3.5" />
											<Text className="font-mono">{formatDateToDay(item.createTime)}</Text>
										</View>
									)}
									{item.author && (
										<View className="flex items-center gap-1">
											<View className="icon-[ph--user-circle] size-3.5" />
											<Text>{item.author}</Text>
										</View>
									)}
								</View>

								<View className="flex items-center gap-0.5 text-primary font-medium">
									<Text className="text-xs">阅读详情</Text>
									<View className="icon-[ph--caret-right] size-3" />
								</View>
							</View>
						</Card>
					))
				)}

				{/* 触底加载更多状态 */}
				{isFetchingNextPage && (
					<View className="py-3 flex justify-center items-center">
						<Loading title="正在加载更多内容..." />
					</View>
				)}

				{!hasNextPage && articleList.length > 0 && (
					<View className="py-6 text-center text-xs text-text-muted/60">已加载全部内容</View>
				)}
			</View>
		</Page>
	);
}
