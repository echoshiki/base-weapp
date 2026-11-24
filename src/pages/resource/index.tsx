import { useMemo, useState } from 'react';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { Card, SearchBar, Loading, Empty, Skeleton, Badge, Divider, Button } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { useAuth } from '@/hooks/useAuth';
import {
	parseResourcePhotoList,
	resolveResourcePhotoUrl,
	useChainResourceCategoryList,
	useDeleteChainResource,
	useInfiniteChainResourceList,
} from '@/hooks/useResource';
import { ChainResourceItem } from '@/types/resource';
import { mapsTo, cn } from '@/utils/common';

export default function ResourceListPage() {
	const { isAdmin } = useAuth();
	const [inputVal, setInputVal] = useState('');
	const [activeKeyword, setActiveKeyword] = useState('');
	const [activeCategoryId, setActiveCategoryId] = useState<string>('');

	const {
		data: categoryList = [],
		isLoading: isLoadingCategories,
		refetch: refetchCategories,
	} = useChainResourceCategoryList();

	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteChainResourceList(
		activeKeyword,
		activeCategoryId || undefined,
		10,
	);

	const deleteMutation = useDeleteChainResource();

	const resourceList = useMemo(() => {
		if (!data?.pages) return [];
		return data.pages.flatMap((page) => page.list || []);
	}, [data]);

	const totalCount = data?.pages?.[0]?.total ?? 0;

	// 下拉刷新
	usePullDownRefresh(async () => {
		try {
			await Promise.all([refetchCategories(), refetch()]);
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

	// 管理员编辑
	const handleEdit = (e: any, item: ChainResourceItem) => {
		e.stopPropagation();
		mapsTo(`/pages/resource/edit/index?zyId=${item.zyId}`);
	};

	// 管理员删除
	const handleDelete = (e: any, item: ChainResourceItem) => {
		e.stopPropagation();
		Taro.showModal({
			title: '确认删除',
			content: `确定要删除链资源“${item.zyName}”吗？删除后无法恢复。`,
			confirmColor: '#ef4444',
			success: (res) => {
				if (res.confirm) {
					deleteMutation.mutate(item.zyId);
				}
			},
		});
	};

	return (
		<BizPage paddingX={false} className="bg-slate-50 min-h-screen pb-10">
			{/* 顶部吸顶搜索与分类筛选区 */}
			<View className="sticky top-0 z-20 bg-white border-b border-slate-100">
				<View className="p-4">
					<SearchBar
						variant="filled"
						value={inputVal}
						placeholder="搜索资源名称或资源地点"
						onInput={setInputVal}
						onConfirm={handleSearch}
						onClear={handleClearSearch}
						action={
							<Text
								onClick={handleSearch}
								className="text-sm font-semibold text-primary px-1.5 py-1 cursor-pointer"
							>
								搜索
							</Text>
						}
					/>
				</View>

				{/* 分类横向筛选条 */}
				<ScrollView scrollX enhanced showScrollbar={false} className="w-full whitespace-nowrap pb-3">
					<View className="inline-flex items-center gap-2 px-4">
						<View
							onClick={() => setActiveCategoryId('')}
							className={cn(
								'inline-flex items-center px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer shrink-0',
								!activeCategoryId
									? 'bg-primary border-primary text-white font-semibold shadow-xs shadow-blue-500/25'
									: 'bg-slate-50 border-slate-200 text-slate-600 active:bg-slate-100',
							)}
						>
							<Text>全部</Text>
						</View>

						{isLoadingCategories
							? [1, 2, 3].map((idx) => <Skeleton key={idx} className="h-7 w-18 rounded-full shrink-0" />)
							: categoryList.map((cat) => {
									const isSelected = activeCategoryId === cat.zyflId;
									return (
										<View
											key={cat.zyflId}
											onClick={() =>
												setActiveCategoryId((prev) => (prev === cat.zyflId ? '' : cat.zyflId))
											}
											className={cn(
												'inline-flex items-center px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer shrink-0',
												isSelected
													? 'bg-primary border-primary text-white font-semibold shadow-xs shadow-blue-500/25'
													: 'bg-slate-50 border-slate-200 text-slate-600 active:bg-slate-100',
											)}
										>
											<Text>{cat.zyflName}</Text>
										</View>
									);
								})}
					</View>
				</ScrollView>
			</View>

			{/* 结果统计条 */}
			{!isLoading && (
				<View className="px-4 pt-3 pb-1 flex items-center justify-between text-xs text-slate-400">
					<Text>
						{activeKeyword
							? `“${activeKeyword}” 共检索到 ${totalCount} 项链资源`
							: `共 ${totalCount} 项链资源`}
					</Text>
					{activeKeyword && (
						<Text onClick={handleClearSearch} className="text-primary cursor-pointer">
							重置搜索
						</Text>
					)}
				</View>
			)}

			{/* 链资源卡片列表 */}
			<View className="px-4 pt-2 flex flex-col gap-3">
				{isLoading ? (
					<View className="flex flex-col gap-3 pt-1">
						{[1, 2, 3].map((idx) => (
							<Card key={idx} className="p-4 flex flex-col gap-3 rounded-2xl">
								<Skeleton className="h-5 w-2/3" />
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-4 w-full" />
							</Card>
						))}
					</View>
				) : resourceList.length === 0 ? (
					<View className="py-16">
						<Empty
							title="暂无链资源"
							subTitle={activeKeyword ? '可尝试更换关键词或重置搜索条件' : '产业链供需资源将在此展示'}
						/>
					</View>
				) : (
					resourceList.map((item) => {
						const photos = parseResourcePhotoList(item.zyPhoto);
						const coverUrl = photos[0] ? resolveResourcePhotoUrl(photos[0]) : '';

						return (
							<Card
								key={item.zyId}
								onClick={() => mapsTo(`/pages/resource/detail/index?zyId=${item.zyId}`)}
								className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-3 active:scale-[0.99] transition-transform cursor-pointer"
							>
								<View className="flex items-start gap-3">
									{/* 封面缩略图 */}
									{coverUrl ? (
										<View className="size-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0">
											<Image src={coverUrl} mode="aspectFill" className="w-full h-full" />
										</View>
									) : (
										<View className="size-20 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
											<View className="icon-[ph--link-duotone] size-8 text-amber-500" />
										</View>
									)}

									{/* 右侧核心信息 */}
									<View className="flex-1 min-w-0 flex flex-col gap-2">
										<Text className="font-bold text-slate-800 leading-snug line-clamp-2 flex-1">
											{item.zyName}
										</Text>

										<View className="flex flex-wrap items-center gap-2">
											{item.zyflName && <Badge variant="amber">{item.zyflName}</Badge>}
										</View>

										{item.zyAddress && (
											<View className="flex items-center gap-1 text-xs text-slate-600">
												<View className="icon-[ph--map-pin] size-3.5 text-slate-400 shrink-0" />
												<Text className="truncate">{item.zyAddress}</Text>
											</View>
										)}
									</View>
								</View>

								{/* 资源描述摘要 */}
								{item.zyDesc && (
									<Text className="text-xs text-slate-600 leading-relaxed line-clamp-2">
										{item.zyDesc}
									</Text>
								)}

								<Divider className="my-1" />

								{/* 底部联系人与操作区 */}
								<View className="flex items-center justify-between text-xs">
									<View className="flex items-center gap-2 text-slate-500 min-w-0 flex-1">
										{item.zyContact && (
											<View className="flex items-center gap-1 shrink-0">
												<View className="icon-[ph--user] size-3.5 text-slate-400" />
												<Text>{item.zyContact}</Text>
											</View>
										)}
										{item.zyPhone && (
											<Text className="font-mono text-slate-400 truncate">{item.zyPhone}</Text>
										)}
									</View>

									{isAdmin ? (
										<View className="flex items-center gap-2 shrink-0">
											<Button
												onClick={(e) => handleEdit(e, item)}
												size="xs"
												icon="icon-[ph--pencil-simple]"
												appearance="soft"
												rounded={false}
											>
												编辑
											</Button>
											<Button
												onClick={(e) => handleDelete(e, item)}
												size="xs"
												icon="icon-[ph--trash]"
												variant="rose"
												appearance="soft"
												rounded={false}
											>
												删除
											</Button>
										</View>
									) : (
										<View className="flex items-center gap-0.5 text-primary shrink-0">
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
				{!isLoading && resourceList.length > 0 && (
					<View className="py-4 flex items-center justify-center">
						{isFetchingNextPage ? (
							<Loading title="正在加载更多链资源..." />
						) : hasNextPage ? (
							<Text className="text-xs text-slate-400">上拉加载更多</Text>
						) : (
							<Text className="text-xs text-slate-400">已加载全部 {totalCount} 项链资源</Text>
						)}
					</View>
				)}
			</View>
		</BizPage>
	);
}
