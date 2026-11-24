import { useMemo, useState } from 'react';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Card, SearchBar, Loading, Empty, Skeleton, Badge, Button, Divider } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { useAuth } from '@/hooks/useAuth';
import {
	getAppealTagColor,
	resolveAppealTypeTags,
	useAppealTypeList,
	useDeleteAppeal,
	useInfiniteAppealList,
} from '@/hooks/useDemand';
import { AppealItem } from '@/types/demand';
import { mapsTo, formatDateToDay, cn } from '@/utils/common';

export default function AppealListPage() {
	const { isEnterprise } = useAuth();
	const [inputVal, setInputVal] = useState('');
	const [activeKeyword, setActiveKeyword] = useState('');

	// 诉求类别映射表（用于 typeId 兜底解析类别名称）
	const { typeMap } = useAppealTypeList();

	// 诉求分页列表
	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteAppealList(
		activeKeyword,
		10,
	);

	const deleteMutation = useDeleteAppeal();

	const appealList = useMemo(() => {
		if (!data?.pages) return [];
		return data.pages.flatMap((page) => page.list || []);
	}, [data]);

	const totalCount = data?.pages?.[0]?.total ?? 0;

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

	const handleSearch = () => {
		setActiveKeyword(inputVal.trim());
	};

	const handleClearSearch = () => {
		setInputVal('');
		setActiveKeyword('');
	};

	// 企业端编辑诉求
	const handleEdit = (e: any, item: AppealItem) => {
		e.stopPropagation();
		mapsTo(`/pages/appeal/form/index?requId=${item.requId}`);
	};

	// 企业端删除诉求
	const handleDelete = (e: any, item: AppealItem) => {
		e.stopPropagation();
		Taro.showModal({
			title: '确认删除',
			content: `确定要删除诉求“${item.title}”吗？删除后无法恢复。`,
			confirmColor: '#ef4444',
			success: (res) => {
				if (res.confirm) {
					deleteMutation.mutate(item.requId);
				}
			},
		});
	};

	return (
		<BizPage paddingX={false} className={cn(isEnterprise ? 'pb-24' : 'pb-10')}>
			{/* 顶部吸顶搜索栏 */}
			<View className="sticky top-0 z-20 bg-white border-b border-slate-100">
				<View className="p-4">
					<SearchBar
						variant="filled"
						value={inputVal}
						placeholder="搜索诉求标题、描述或企业名称"
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

			{/* 统计结果提示条 */}
			{!isLoading && (
				<View className="px-4 pt-3 pb-1 flex items-center justify-between text-xs text-slate-400">
					<Text>
						{activeKeyword
							? `“${activeKeyword}” 共检索到 ${totalCount} 条诉求`
							: `共 ${totalCount} 条企业诉求`}
					</Text>
					{activeKeyword && (
						<Text onClick={handleClearSearch} className="text-primary cursor-pointer">
							重置搜索
						</Text>
					)}
				</View>
			)}

			{/* 诉求列表卡片区 */}
			<View className="px-4 pt-2 flex flex-col gap-3">
				{isLoading ? (
					<View className="flex flex-col gap-3 pt-1">
						{[1, 2, 3].map((idx) => (
							<Card key={idx} className="p-4 flex flex-col gap-3 rounded-2xl">
								<Skeleton className="h-5 w-3/4" />
								<View className="flex gap-2">
									<Skeleton className="h-4 w-16 rounded-full" />
									<Skeleton className="h-4 w-24 rounded-full" />
								</View>
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-1/2" />
							</Card>
						))}
					</View>
				) : appealList.length === 0 ? (
					<View className="py-16">
						<Empty
							title="暂无企业诉求"
							subTitle={activeKeyword ? '可尝试更换关键词或重置搜索条件' : '企业提报的诉求信息将在此展示'}
						/>
					</View>
				) : (
					appealList.map((item) => {
						const typeTags = resolveAppealTypeTags(item.typeName, item.typeId, typeMap);
						const displayTime = item.subTime || item.createTime;

						return (
							<Card
								key={item.requId}
								onClick={() => mapsTo(`/pages/appeal/detail/index?requId=${item.requId}`)}
								className="gap-3"
							>
								{/* 诉求标题 */}
								<Text className="font-bold text-slate-900 leading-snug line-clamp-2">{item.title}</Text>

								{/* 归属企业 & 诉求类别标签 */}
								<View className="flex flex-wrap items-center gap-1.5">
									{item.entName && (
										<Badge variant="blue" icon="icon-[ph--buildings] ">
											{item.entName}
										</Badge>
									)}
									{typeTags.map((tag, idx) => (
										<Badge key={tag} variant={getAppealTagColor(idx)}>
											{tag}
										</Badge>
									))}
								</View>

								{/* 诉求描述摘要 */}
								{item.detail && (
									<Text className="text-xs text-slate-600 leading-relaxed line-clamp-2">
										{item.detail}
									</Text>
								)}

								<Divider className="my-1" />

								{/* 底部时间与操作区 */}
								<View className="flex items-center justify-between text-xs text-slate-600">
									<View className="flex items-center gap-1">
										<View className="icon-[ph--clock] size-3.5" />
										<Text>{displayTime ? formatDateToDay(displayTime) : '-'}</Text>
									</View>

									{isEnterprise ? (
										<View className="flex items-center gap-2 shrink-0">
											<View
												onClick={(e) => handleEdit(e, item)}
												className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-primary active:bg-blue-100"
											>
												<View className="icon-[ph--pencil-simple] size-3.5" />
												<Text className="text-xs font-medium">编辑</Text>
											</View>
											<View
												onClick={(e) => handleDelete(e, item)}
												className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 active:bg-red-100"
											>
												<View className="icon-[ph--trash] size-3.5" />
												<Text className="text-xs font-medium">删除</Text>
											</View>
										</View>
									) : (
										<View className="flex items-center gap-0.5 text-primary">
											<Text>查看详情</Text>
											<View className="icon-[ph--caret-right-bold] size-3" />
										</View>
									)}
								</View>
							</Card>
						);
					})
				)}

				{/* 底部加载状态 */}
				{!isLoading && appealList.length > 0 && (
					<View className="py-4 flex items-center justify-center">
						{isFetchingNextPage ? (
							<Loading title="正在加载更多诉求..." />
						) : hasNextPage ? (
							<Text className="text-xs text-slate-400">上拉加载更多</Text>
						) : (
							<Text className="text-xs text-slate-400">已加载全部 {totalCount} 条诉求</Text>
						)}
					</View>
				)}
			</View>

			{/* 企业端限定：吸底发布诉求按钮 */}
			{isEnterprise && (
				<View className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
					<Button
						variant="primary"
						onClick={() => mapsTo('/pages/appeal/form/index')}
						className="w-full h-11 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm border-none shadow-md shadow-blue-500/20"
					>
						发布新诉求
					</Button>
				</View>
			)}
		</BizPage>
	);
}
