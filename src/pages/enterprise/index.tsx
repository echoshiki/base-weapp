import { useMemo, useState } from 'react';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { Card, SearchBar, Loading, Empty, Skeleton, Badge, Divider } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { useEnterpriseHonorList, useInfiniteEnterpriseList } from '@/hooks/useEnterprise';
import { mapsTo, cn } from '@/utils/common';
import { EnterpriseHonorItem } from '@/types/enterprise';

/**
 * 拆解荣誉/标签字符串为数组（兼容逗号、顿号、分号分隔）
 */
const splitTags = (raw?: string) => {
	if (!raw) return [];
	return raw
		.split(/[,，、;；]/)
		.map((s) => s.trim())
		.filter(Boolean);
};

export default function EnterpriseListPage() {
	const [inputVal, setInputVal] = useState('');
	const [activeKeyword, setActiveKeyword] = useState('');

	// 企业称号统计列表
	const { data: honorList = [], isLoading: isLoadingHonors, refetch: refetchHonors } = useEnterpriseHonorList();

	// 企业分页列表
	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteEnterpriseList(
		activeKeyword,
		10,
	);

	const enterpriseList = useMemo(() => {
		if (!data?.pages) return [];
		return data.pages.flatMap((page) => page.list || []);
	}, [data]);

	const totalCount = data?.pages?.[0]?.total ?? 0;

	// 下拉刷新
	usePullDownRefresh(async () => {
		try {
			await Promise.all([refetchHonors(), refetch()]);
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

	// 触发关键词搜索
	const handleSearch = () => {
		setActiveKeyword(inputVal.trim());
	};

	// 清空搜索
	const handleClearSearch = () => {
		setInputVal('');
		setActiveKeyword('');
	};

	// 点击称号标签联动筛选
	const handleSelectHonor = (honor?: EnterpriseHonorItem) => {
		if (!honor) {
			setInputVal('');
			setActiveKeyword('');
			return;
		}
		if (activeKeyword === honor.honorName) {
			setInputVal('');
			setActiveKeyword('');
			return;
		}
		setInputVal(honor.honorName);
		setActiveKeyword(honor.honorName);
	};

	return (
		<BizPage paddingX={false}>
			{/* 顶部吸顶搜索与称号联动筛选区 */}
			<View className="sticky top-0 z-20 bg-white border-b border-slate-100">
				<View className="px-4 pt-6 pb-3">
					<SearchBar
						value={inputVal}
						placeholder="搜索企业名称、称号"
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

				{/* 认证称号数量横向筛选条 */}
				<ScrollView scrollX enhanced showScrollbar={false} className="w-full whitespace-nowrap pb-3">
					<View className="inline-flex items-center gap-2 px-4">
						{/* 全部选项 */}
						<View
							onClick={() => handleSelectHonor()}
							className={cn(
								'flex items-center gap-1 px-4 py-2 rounded-full text-xs transition-all cursor-pointer shrink-0',
								!activeKeyword
									? 'bg-primary border-primary text-white font-semibold shadow-xs shadow-blue-500/25'
									: 'bg-slate-50 border-slate-200 text-slate-600 active:bg-slate-100',
							)}
						>
							<Text>全部</Text>
						</View>

						{isLoadingHonors
							? [1, 2, 3].map((idx) => <Skeleton key={idx} className="h-7 w-20 rounded-full shrink-0" />)
							: honorList.map((honor) => {
									const isSelected = activeKeyword === honor.honorName;
									return (
										<View
											key={honor.honorName}
											onClick={() => handleSelectHonor(honor)}
											className={cn(
												'inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer shrink-0',
												isSelected
													? 'bg-primary border-primary text-white font-semibold shadow-xs shadow-blue-500/25'
													: 'bg-slate-50 border-slate-200 text-slate-600 active:bg-slate-100',
											)}
										>
											<Text>{honor.fixedName || honor.honorName}</Text>
											<View
												className={cn(
													isSelected ? ' text-white' : 'text-primary font-semibold',
												)}
											>
												<Text>{honor.count}</Text>
											</View>
										</View>
									);
								})}
					</View>
				</ScrollView>
			</View>

			{/* 统计结果提示条 */}
			{!isLoading && (
				<View className="px-4 pt-3 pb-1 flex items-center justify-between text-xs text-slate-400">
					<Text>
						{activeKeyword
							? `“${activeKeyword}” 共筛选出 ${totalCount} 家企业`
							: `共收录 ${totalCount} 家企业`}
					</Text>
					{activeKeyword && (
						<Text onClick={handleClearSearch} className="text-primary cursor-pointer">
							重置筛选
						</Text>
					)}
				</View>
			)}

			{/* 企业列表内容区 */}
			<View className="px-4 pt-2 flex flex-col gap-3">
				{isLoading ? (
					<View className="flex flex-col gap-3 pt-1">
						{[1, 2, 3].map((idx) => (
							<Card key={idx} className="p-4 flex flex-col gap-3 rounded-2xl">
								<Skeleton className="h-5 w-2/3" />
								<View className="flex gap-2">
									<Skeleton className="h-4 w-16 rounded-full" />
									<Skeleton className="h-4 w-20 rounded-full" />
								</View>
								<Skeleton className="h-4 w-1/2" />
							</Card>
						))}
					</View>
				) : enterpriseList.length === 0 ? (
					<View className="py-16">
						<Empty
							title="暂无匹配企业"
							icon="icon-[ph--building]"
							subTitle={
								activeKeyword ? '可尝试更换关键词或点击全部查看所有企业' : '辖区企业档案数据将在此展示'
							}
						/>
					</View>
				) : (
					enterpriseList.map((item) => {
						const honorTags = splitTags(item.honorName);
						const customTags = splitTags(item.qybqName);

						return (
							<Card
								key={item.entId}
								onClick={() => mapsTo(`/pages/enterprise/detail/index?entId=${item.entId}`)}
								className="gap-3"
							>
								{/* 企业名称与区域 */}
								<View className="flex items-center justify-between gap-2">
									<Text className="font-bold text-slate-900 leading-snug flex-1">{item.entName}</Text>
									{item.boundaryName && (
										<View className="flex items-center gap-1 shrink-0">
											<View className="icon-[ph--map-pin-line-duotone] size-3" />
											<Text className="text-xs text-slate-600">{item.boundaryName}</Text>
										</View>
									)}
								</View>

								<View className="flex flex-col gap-2">
									{/* 行业 / 规模 / 性质基础属性 */}
									{(item.industryName || item.scaleName || item.natureName) && (
										<View className="flex flex-wrap items-center gap-1.5">
											{item.industryName && <Badge variant="blue">{item.industryName}</Badge>}
											{item.scaleName && <Badge variant="emerald">{item.scaleName}</Badge>}
											{item.natureName && <Badge variant="indigo">{item.natureName}</Badge>}
										</View>
									)}

									{/* 荣誉认证 & 企业标签 */}
									{(honorTags.length > 0 || customTags.length > 0) && (
										<View className="flex flex-wrap items-center gap-1.5">
											{honorTags.map((tag) => (
												<Badge
													icon="icon-[ph--medal-duotone]"
													variant="amber"
													key={`honor-${tag}`}
												>
													{tag}
												</Badge>
											))}
											{customTags.map((tag) => (
												<Badge
													icon="icon-[ph--medal-duotone]"
													variant="amber"
													key={`qybq-${tag}`}
												>
													{tag}
												</Badge>
											))}
										</View>
									)}
								</View>

								<Divider className="my-1" />

								{/* 底部联系人与详情引导 */}
								<View className="flex items-center justify-between text-xs text-slate-600">
									<View className="flex items-center gap-3 min-w-0 flex-1">
										{item.contPerson && (
											<View className="flex items-center gap-1 shrink-0">
												<View className="icon-[ph--user] size-3" />
												<Text>{item.contPerson}</Text>
											</View>
										)}
										{item.contPhone && (
											<View className="flex items-center gap-1 truncate">
												<View className="icon-[ph--phone] size-3 shrink-0" />
												<Text className="font-mono truncate">{item.contPhone}</Text>
											</View>
										)}
										{!item.contPerson && !item.contPhone && item.regCap && (
											<View className="flex items-center gap-1 truncate">
												<View className="icon-[ph--coins] size-3 shrink-0" />
												<Text className="truncate">注册资本：{item.regCap}</Text>
											</View>
										)}
									</View>

									<View className="flex items-center gap-1 text-primary font-medium shrink-0">
										<Text>查看档案</Text>
										<View className="icon-[ph--caret-right-bold] size-3" />
									</View>
								</View>
							</Card>
						);
					})
				)}

				{/* 底部加载状态 */}
				{!isLoading && enterpriseList.length > 0 && (
					<View className="py-4 flex items-center justify-center">
						{isFetchingNextPage ? (
							<Loading title="正在加载更多企业..." />
						) : hasNextPage ? (
							<Text className="text-xs text-slate-400">上拉加载更多</Text>
						) : (
							<Text className="text-xs text-slate-400">已加载全部 {totalCount} 家企业</Text>
						)}
					</View>
				)}
			</View>
		</BizPage>
	);
}
