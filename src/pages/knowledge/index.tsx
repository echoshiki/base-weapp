import { useMemo, useState } from 'react';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Card, SearchBar, Loading, Empty, Skeleton, Badge } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { useInfiniteKnowledgeList } from '@/hooks/useResource';
import { mapsTo } from '@/utils/common';

/** 去除 HTML 标签提取纯文本摘要 */
const stripHtml = (raw?: string) => {
	if (!raw) return '';
	return raw
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.trim();
};

export default function KnowledgeListPage() {
	const [inputVal, setInputVal] = useState('');
	const [activeKeyword, setActiveKeyword] = useState('');

	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteKnowledgeList(
		activeKeyword,
		10,
	);

	const knowledgeList = useMemo(() => {
		if (!data?.pages) return [];
		return data.pages.flatMap((page) => page.list || []);
	}, [data]);

	const totalCount = data?.pages?.[0]?.total ?? 0;

	usePullDownRefresh(async () => {
		try {
			await refetch();
		} finally {
			Taro.stopPullDownRefresh();
		}
	});

	useReachBottom(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	});

	const handleSearch = () => {
		setActiveKeyword(inputVal.trim());
	};

	const handleClearSearch = () => {
		setInputVal('');
		setActiveKeyword('');
	};

	return (
		<BizPage paddingX={false} className="bg-slate-50 min-h-screen pb-10">
			{/* 吸顶搜索栏 */}
			<View className="sticky top-0 z-20 bg-white border-b border-slate-100">
				<View className="p-4">
					<SearchBar
						variant="filled"
						value={inputVal}
						placeholder="搜索知识科普标题"
						onInput={setInputVal}
						onConfirm={handleSearch}
						onClear={handleClearSearch}
						action={
							<Text
								onClick={handleSearch}
								className="text-sm font-semibold text-primary px-1.5 py-1 cursor-pointer active:opacity-70"
							>
								搜索
							</Text>
						}
					/>
				</View>
			</View>

			{/* 结果统计 */}
			{!isLoading && (
				<View className="px-4 pt-3 pb-1 flex items-center justify-between text-xs text-slate-400">
					<Text>
						{activeKeyword
							? `“${activeKeyword}” 共检索到 ${totalCount} 篇科普`
							: `共 ${totalCount} 篇知识科普`}
					</Text>
					{activeKeyword && (
						<Text onClick={handleClearSearch} className="text-primary cursor-pointer">
							重置搜索
						</Text>
					)}
				</View>
			)}

			{/* 列表卡片 */}
			<View className="px-4 pt-2 flex flex-col gap-3">
				{isLoading ? (
					<View className="flex flex-col gap-3 pt-1">
						{[1, 2, 3].map((idx) => (
							<Card key={idx} className="p-4 flex flex-col gap-3 rounded-2xl">
								<Skeleton className="h-5 w-3/4" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-1/2" />
							</Card>
						))}
					</View>
				) : knowledgeList.length === 0 ? (
					<View className="py-16">
						<Empty
							title="暂无知识科普"
							subTitle={
								activeKeyword ? '可尝试更换关键词或重置搜索条件' : '行业规范与安全科普指南将在此展示'
							}
						/>
					</View>
				) : (
					knowledgeList.map((item) => {
						const summary = stripHtml(item.content);

						return (
							<Card
								key={item.articleId}
								onClick={() => mapsTo(`/pages/knowledge/detail/index?articleId=${item.articleId}`)}
								className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-2.5 active:scale-[0.99] transition-transform cursor-pointer"
							>
								{/* 标题 + 版本号 */}
								<View className="flex items-start justify-between gap-2">
									<Text className="text-base font-bold text-slate-900 leading-snug flex-1 line-clamp-2">
										{item.title}
									</Text>
								</View>

								{/* 正文摘要 */}
								{summary && (
									<Text className="text-xs text-slate-500 leading-relaxed line-clamp-2">
										{summary}
									</Text>
								)}

								{/* 底部阅读引导 */}
								<View className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
									{item.verNum && <Badge variant="blue">{item.verNum}</Badge>}
									<View className="flex items-center gap-0.5 text-primary">
										<Text>查看详情</Text>
										<View className="icon-[ph--caret-right-bold] size-3" />
									</View>
								</View>
							</Card>
						);
					})
				)}

				{/* 底部加载状态 */}
				{!isLoading && knowledgeList.length > 0 && (
					<View className="py-4 flex items-center justify-center">
						{isFetchingNextPage ? (
							<Loading title="正在加载更多科普..." />
						) : hasNextPage ? (
							<Text className="text-xs text-slate-400">上拉加载更多</Text>
						) : (
							<Text className="text-xs text-slate-400">已加载全部 {totalCount} 篇科普</Text>
						)}
					</View>
				)}
			</View>
		</BizPage>
	);
}
