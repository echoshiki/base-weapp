import { useMemo, useState } from 'react';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Card, SearchBar, Loading, Empty, Skeleton, Badge } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { parsePolicyCategories, useInfinitePolicyList } from '@/hooks/useResource';
import { mapsTo, formatDateToDay } from '@/utils/common';

export default function PolicyListPage() {
	const [inputVal, setInputVal] = useState('');
	const [activeKeyword, setActiveKeyword] = useState('');

	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfinitePolicyList(
		activeKeyword,
		10,
	);

	const policyList = useMemo(() => {
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
						placeholder="搜索政策文件标题"
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
							? `“${activeKeyword}” 共检索到 ${totalCount} 份政策文件`
							: `共 ${totalCount} 份政策文件`}
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
								<Skeleton className="h-5 w-4/5" />
								<View className="flex gap-2">
									<Skeleton className="h-4 w-16 rounded-full" />
									<Skeleton className="h-4 w-28" />
								</View>
							</Card>
						))}
					</View>
				) : policyList.length === 0 ? (
					<View className="py-16">
						<Empty
							title="暂无政策文件"
							subTitle={activeKeyword ? '可尝试更换关键词或重置搜索条件' : '惠企政策与通知公告将在此展示'}
						/>
					</View>
				) : (
					policyList.map((item) => (
						<Card
							key={item.id}
							onClick={() => mapsTo(`/pages/policy/detail/index?id=${item.id}`)}
							className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-2.5 active:scale-[0.99] transition-transform cursor-pointer"
						>
							{/* 标题 */}
							<Text className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
								{item.bbTitle}
							</Text>

							{/* 分类与发文字号 */}
							{(item.category || item.issueCode) && (
								<View className="flex flex-wrap items-center gap-1">
									{parsePolicyCategories(item.category).map((cat) => (
										<Badge key={cat} variant="blue">
											{cat}
										</Badge>
									))}
								</View>
							)}

							{/* 底部发布日期与阅读引导 */}
							<View className="flex items-center justify-between pt-2.5 mt-0.5 border-t border-slate-100 text-xs text-slate-600">
								<View className="flex items-center gap-1">
									<View className="icon-[ph--calendar-blank] size-3.5" />
									<Text>{item.publicdata ? formatDateToDay(item.publicdata) : '-'}</Text>
								</View>

								<View className="flex items-center gap-0.5 text-primary font-medium">
									<Text>阅读全文</Text>
									<View className="icon-[ph--caret-right-bold] size-3" />
								</View>
							</View>
						</Card>
					))
				)}

				{/* 底部加载状态 */}
				{!isLoading && policyList.length > 0 && (
					<View className="py-4 flex items-center justify-center">
						{isFetchingNextPage ? (
							<Loading title="正在加载更多文件..." />
						) : hasNextPage ? (
							<Text className="text-xs text-slate-400">上拉加载更多</Text>
						) : (
							<Text className="text-xs text-slate-400">已加载全部 {totalCount} 份文件</Text>
						)}
					</View>
				)}
			</View>
		</BizPage>
	);
}
