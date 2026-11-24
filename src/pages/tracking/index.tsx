import { useMemo, useState } from 'react';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Card, SearchBar, Loading, Empty, Skeleton, Badge, Divider } from '@/components/ui';
import { BizPage } from '@/components/biz';
import {
	TRACKING_STATUS_META,
	getAppealTagColor,
	resolveAppealTypeTags,
	useAppealTypeList,
	useInfiniteAppealTrackingList,
} from '@/hooks/useDemand';
import { TrackingStatus } from '@/types/demand';
import { mapsTo, formatDateToDay, cn } from '@/utils/common';

const STATUS_TABS: { label: string; value?: TrackingStatus }[] = [
	{ label: '全部', value: undefined },
	{ label: '待处理', value: 0 },
	{ label: '处理中', value: 1 },
	{ label: '已完成', value: 2 },
];

export default function TrackingListPage() {
	const [activeStatus, setActiveStatus] = useState<TrackingStatus | undefined>(undefined);
	const [inputVal, setInputVal] = useState('');
	const [activeKeyword, setActiveKeyword] = useState('');

	const { typeMap } = useAppealTypeList();

	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteAppealTrackingList(
		activeStatus,
		activeKeyword,
		5,
	);

	const trackingList = useMemo(() => {
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

	// 上拉触底加载更多
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
		<BizPage paddingX={false} className="pb-10">
			{/* 顶部吸顶搜索栏与状态 Tab */}
			<View className="sticky top-0 z-20 bg-white border-b border-slate-100">
				<View className="p-4">
					<SearchBar
						variant="filled"
						value={inputVal}
						placeholder="搜索企业名称、诉求标题或处理描述"
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

				{/* 状态筛选 Tab 栏 */}
				<View className="flex items-center px-4">
					{STATUS_TABS.map((tab) => {
						const isActive = activeStatus === tab.value;
						return (
							<View
								key={tab.label}
								onClick={() => setActiveStatus(tab.value)}
								className="flex-1 flex flex-col items-center py-2.5 cursor-pointer relative"
							>
								<Text
									className={cn(
										'text-xs transition-colors',
										isActive ? 'font-bold text-primary' : 'text-slate-500 font-medium',
									)}
								>
									{tab.label}
								</Text>
								{isActive && <View className="absolute bottom-0 w-6 h-0.5 rounded-full bg-primary" />}
							</View>
						);
					})}
				</View>
			</View>

			{/* 结果统计提示 */}
			{!isLoading && (
				<View className="px-4 pt-3 pb-1 flex items-center justify-between text-xs text-slate-400">
					<Text>
						{activeKeyword
							? `“${activeKeyword}” 共检索到 ${totalCount} 条记录`
							: `共 ${totalCount} 条诉求跟踪记录`}
					</Text>
					{activeKeyword && (
						<Text onClick={handleClearSearch} className="text-primary cursor-pointer">
							重置搜索
						</Text>
					)}
				</View>
			)}

			{/* 跟踪列表卡片 */}
			<View className="px-4 pt-2 flex flex-col gap-3">
				{isLoading ? (
					<View className="flex flex-col gap-3 pt-1">
						{[1, 2, 3].map((idx) => (
							<Card key={idx} className="p-4 flex flex-col gap-3 rounded-2xl">
								<View className="flex justify-between items-center">
									<Skeleton className="h-5 w-2/3" />
									<Skeleton className="h-5 w-14 rounded-full" />
								</View>
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-4 w-full" />
							</Card>
						))}
					</View>
				) : trackingList.length === 0 ? (
					<View className="py-16">
						<Empty
							title="暂无诉求跟踪记录"
							subTitle={
								activeKeyword || activeStatus !== undefined
									? '当前筛选条件下暂无数据，可切换状态或重置搜索'
									: '企业诉求进入办理流程后将在此展示'
							}
						/>
					</View>
				) : (
					trackingList.map((item) => {
						const statusMeta = TRACKING_STATUS_META[item.status] || TRACKING_STATUS_META[0];
						const typeTags = resolveAppealTypeTags(item.typeName, item.typeId, typeMap);
						const summaryText = item.description || item.detail;

						return (
							<Card
								key={item.statusId}
								onClick={() =>
									mapsTo(
										`/pages/tracking/detail/index?statusId=${item.statusId}${
											item.requId ? `&requId=${item.requId}` : ''
										}`,
									)
								}
								className="gap-3"
							>
								{/* 标题 + 处理状态徽章 */}
								<View className="flex items-start justify-between gap-2">
									<Text className="font-bold text-slate-900 leading-snug flex-1 line-clamp-2">
										{item.title}
									</Text>
									<Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
								</View>

								{/* 企业名称 & 诉求类别 */}
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

								{/* 处理描述或诉求描述摘要 */}
								{summaryText && (
									<Text className="text-xs text-slate-500 leading-relaxed line-clamp-2">
										{summaryText}
									</Text>
								)}

								<Divider className="my-1" />

								{/* 底部负责人、时间与详情进度引导 */}
								<View className="flex items-center justify-between text-xs text-slate-400">
									<View className="flex items-center gap-3 min-w-0 flex-1">
										{item.userName && (
											<View className="flex items-center gap-1 shrink-0 text-slate-500">
												<View className="icon-[ph--user-circle] size-3.5 text-slate-400" />
												<Text>{item.userName}</Text>
											</View>
										)}
										{item.createTime && (
											<View className="flex items-center gap-1 truncate">
												<View className="icon-[ph--clock] size-3.5 shrink-0" />
												<Text className="font-mono truncate">
													{formatDateToDay(item.createTime)}
												</Text>
											</View>
										)}
									</View>

									<View className="flex items-center gap-0.5 text-primary font-medium shrink-0">
										<Text>详情与进度</Text>
										<View className="icon-[ph--caret-right-bold] size-3" />
									</View>
								</View>
							</Card>
						);
					})
				)}

				{/* 底部加载状态 */}
				{!isLoading && trackingList.length > 0 && (
					<View className="py-4 flex items-center justify-center">
						{isFetchingNextPage ? (
							<Loading title="正在加载更多记录..." />
						) : hasNextPage ? (
							<Text className="text-xs text-slate-400">上拉加载更多</Text>
						) : (
							<Text className="text-xs text-slate-400">已加载全部 {totalCount} 条记录</Text>
						)}
					</View>
				)}
			</View>
		</BizPage>
	);
}
