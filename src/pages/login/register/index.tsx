import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCallback, useEffect, useState } from 'react';
import { Page, Button, Drawer, Empty, Alert } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { getEnterpriseOptionsAPI } from '@/services/auth';
import { EnterpriseOptionItem } from '@/types/auth';
import { mapsTo, cn } from '@/utils/common';

const PHONE_REGEX = /^1\d{10}$/;
const PAGE_SIZE = 15;

/**
 * 企业用户注册页
 * - 支持从企业列表中搜索选择已有企业（传 entId）
 * - 支持未找到企业时手动输入企业名称提交（传 entName，后台审核）
 */
const EnterpriseRegisterPage = () => {
	const instance = Taro.getCurrentInstance();
	const initialPhone = instance.router?.params?.phone ? decodeURIComponent(instance.router.params.phone) : '';
	const { onEnterpriseRegister } = useAuth();

	// 归属企业模式：select-列表选择(传entId), manual-手动输入(传entName)
	const [enterpriseMode, setEnterpriseMode] = useState<'select' | 'manual'>('select');
	const [selectedEnterprise, setSelectedEnterprise] = useState<EnterpriseOptionItem | null>(null);
	const [customEntName, setCustomEntName] = useState('');

	// 员工基本信息
	const [phone, setPhone] = useState(initialPhone);
	const [name, setName] = useState('');
	const [position, setPosition] = useState('');
	const [submitting, setSubmitting] = useState(false);

	// 企业选择抽屉与分页搜索状态
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [enterpriseList, setEnterpriseList] = useState<EnterpriseOptionItem[]>([]);
	const [pageNum, setPageNum] = useState(1);
	const [total, setTotal] = useState(0);
	const [loadingList, setLoadingList] = useState(false);

	const hasMore = enterpriseList.length < total;

	const fetchEnterpriseList = useCallback(async (page: number, keyword: string, append = false) => {
		setLoadingList(true);
		try {
			const res = await getEnterpriseOptionsAPI({
				pageNum: page,
				pageSize: PAGE_SIZE,
				entName: keyword.trim() || undefined,
			});
			const rows = res.rows || [];
			setEnterpriseList((prev) => (append ? [...prev, ...rows] : rows));
			setTotal(res.total ?? rows.length);
			setPageNum(page);
		} catch (err) {
			console.error('获取企业列表失败:', err);
			Taro.showToast({ title: '获取企业列表失败', icon: 'none' });
		} finally {
			setLoadingList(false);
		}
	}, []);

	// 打开企业选择抽屉时加载第一页
	useEffect(() => {
		if (drawerOpen) {
			fetchEnterpriseList(1, searchKeyword, false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [drawerOpen]);

	const handleSearch = () => {
		fetchEnterpriseList(1, searchKeyword, false);
	};

	const handleLoadMore = () => {
		if (loadingList || !hasMore) return;
		fetchEnterpriseList(pageNum + 1, searchKeyword, true);
	};

	const handleSelectEnterprise = (item: EnterpriseOptionItem) => {
		setSelectedEnterprise(item);
		setEnterpriseMode('select');
		setDrawerOpen(false);
	};

	const handleSwitchToManual = () => {
		if (searchKeyword.trim() && !customEntName.trim()) {
			setCustomEntName(searchKeyword.trim());
		}
		setEnterpriseMode('manual');
		setDrawerOpen(false);
	};

	const handleBackToLogin = (registeredPhone?: string) => {
		const backUrl = instance.router?.params?.back_url;
		const params: string[] = [];
		const targetPhone = registeredPhone ?? phone.trim();
		if (targetPhone) params.push(`phone=${encodeURIComponent(targetPhone)}`);
		if (backUrl) params.push(`back_url=${encodeURIComponent(decodeURIComponent(backUrl))}`);
		const query = params.length > 0 ? `?${params.join('&')}` : '';
		mapsTo(`/pages/login/enterprise/index${query}`, 'redirectTo');
	};

	const handleSubmit = async () => {
		if (enterpriseMode === 'select' && !selectedEnterprise?.entId) {
			return Taro.showToast({ title: '请选择归属企业', icon: 'none' });
		}
		if (enterpriseMode === 'manual' && !customEntName.trim()) {
			return Taro.showToast({ title: '请输入企业名称', icon: 'none' });
		}

		const trimmedPhone = phone.trim();
		const trimmedName = name.trim();
		const trimmedPosition = position.trim();

		if (!PHONE_REGEX.test(trimmedPhone)) {
			return Taro.showToast({ title: '请输入正确的11位手机号', icon: 'none' });
		}
		if (!trimmedName) {
			return Taro.showToast({ title: '请输入员工姓名', icon: 'none' });
		}
		if (!trimmedPosition) {
			return Taro.showToast({ title: '请输入职位', icon: 'none' });
		}

		setSubmitting(true);
		try {
			const payload =
				enterpriseMode === 'select'
					? {
							entId: selectedEnterprise!.entId,
							phone: trimmedPhone,
							name: trimmedName,
							position: trimmedPosition,
						}
					: {
							entName: customEntName.trim(),
							phone: trimmedPhone,
							name: trimmedName,
							position: trimmedPosition,
						};

			const res = await onEnterpriseRegister(payload);
			if (res.success) {
				handleBackToLogin(trimmedPhone);
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Page paddingX={false} showQuickMenu={false}>
			<View className="flex-1 flex flex-col px-6 pt-8">
				{/* 顶部说明 */}
				{/* <View className="flex flex-col mb-6">
					<Text className="text-xl font-bold text-slate-900 tracking-tight">注册企业用户</Text>
					<Text className="text-xs text-slate-600 mt-1.5 leading-relaxed">
						请先关联您的归属企业并完善个人任职信息，提交后可使用手机号验证码登录
					</Text>
				</View> */}

				{/* 注册表单卡片 */}
				<View className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
					<Text className="font-bold text-slate-800 mb-1">企业注册</Text>
					<View className="flex flex-col gap-2">
						<View className="flex items-center justify-between">
							<View className="flex items-center gap-1 text-sm">
								<Text className="text-slate-700">归属企业</Text>
								<Text className="text-red-500">*</Text>
							</View>
							<Text
								onClick={() => setEnterpriseMode((prev) => (prev === 'select' ? 'manual' : 'select'))}
								className="text-xs text-primary cursor-pointer active:opacity-70"
							>
								{enterpriseMode === 'select' ? '找不到企业？手动输入' : '返回列表选择'}
							</Text>
						</View>

						{enterpriseMode === 'select' ? (
							<View
								onClick={() => setDrawerOpen(true)}
								className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12 cursor-pointer active:bg-slate-100 transition-colors"
							>
								<View className="flex items-center gap-3 min-w-0 flex-1">
									<View className="icon-[ph--buildings] size-5 text-slate-400 shrink-0" />
									<Text
										className={cn(
											'text-sm truncate',
											selectedEnterprise
												? 'text-slate-800 font-medium'
												: 'text-slate-600 text-sm',
										)}
									>
										{selectedEnterprise?.entName || '点击搜索并选择归属企业'}
									</Text>
								</View>
								<View className="icon-[ph--caret-down] size-4 text-slate-400 shrink-0" />
							</View>
						) : (
							<View className="flex flex-col gap-3">
								<View className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
									<View className="icon-[ph--buildings] size-5 text-slate-400 shrink-0" />
									<Input
										value={customEntName}
										maxlength={100}
										onInput={(e) => setCustomEntName(e.detail.value)}
										placeholder="请输入完整企业名称"
										className="flex-1 flex items-center text-sm text-slate-800"
									/>
								</View>
								<Alert variant="warning" hideIcon>
									手动填写的企业名称将在提交后进入后台审核。
								</Alert>
							</View>
						)}
					</View>

					<View className="flex flex-col gap-2">
						<View className="flex items-center gap-2 text-sm">
							<Text className="text-slate-700">登录手机号</Text>
							<Text className="text-red-500">*</Text>
						</View>
						<View className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
							<View className="icon-[ph--device-mobile] size-5 text-slate-400 shrink-0" />
							<Input
								type="number"
								value={phone}
								maxlength={11}
								onInput={(e) => setPhone(e.detail.value)}
								placeholder="请输入11位手机号"
								className="flex-1 flex items-center text-sm text-slate-800"
							/>
						</View>
					</View>

					<View className="flex flex-col gap-2">
						<View className="flex items-center gap-2 text-sm">
							<Text className="text-slate-700">员工姓名</Text>
							<Text className="text-red-500">*</Text>
						</View>
						<View className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
							<View className="icon-[ph--user] size-5 text-slate-400 shrink-0" />
							<Input
								value={name}
								maxlength={30}
								onInput={(e) => setName(e.detail.value)}
								placeholder="请输入您的真实姓名"
								className="flex-1 flex items-center text-sm text-slate-800"
							/>
						</View>
					</View>

					<View className="flex flex-col gap-2">
						<View className="flex items-center gap-2 text-sm">
							<Text className="text-slate-700">职位</Text>
							<Text className="text-red-500">*</Text>
						</View>
						<View className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
							<View className="icon-[ph--briefcase] size-5 text-slate-400 shrink-0" />
							<Input
								value={position}
								maxlength={30}
								onInput={(e) => setPosition(e.detail.value)}
								placeholder="请输入您的职位"
								className="flex-1 flex items-center text-sm text-slate-800"
							/>
						</View>
					</View>

					{/* 提交注册按钮 */}
					<Button
						size="xl"
						block
						variant="primary"
						className="mt-2"
						loading={submitting}
						onClick={handleSubmit}
					>
						提交注册
					</Button>

					{/* 底部返回登录 */}
					<View className="flex-1 flex justify-center">
						<Text
							onClick={() => handleBackToLogin()}
							className="text-sm text-slate-600 underline px-4 py-2 cursor-pointer"
						>
							已有账号？返回企业用户登录
						</Text>
					</View>
				</View>
			</View>

			{/* 企业列表动态搜索选择抽屉 */}
			<Drawer
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				position="bottom"
				sizeClass="h-[75vh]"
				title="选择归属企业"
				scrollable={false}
				footer={
					<View
						onClick={handleSwitchToManual}
						className="w-full py-2.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center gap-1.5 cursor-pointer active:bg-blue-100"
					>
						<View className="icon-[ph--pencil-simple-line] size-4 text-primary" />
						<Text className="text-sm text-primary">未找到我的企业？点击手动输入名称</Text>
					</View>
				}
			>
				{/* 搜索栏 */}
				<View className="px-4 py-3 border-b border-slate-100 shrink-0">
							<View className="flex items-center gap-2">
								<View className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-10">
									<View className="icon-[ph--magnifying-glass] size-4 text-slate-400 shrink-0" />
									<Input
										value={searchKeyword}
										confirmType="search"
										onConfirm={handleSearch}
										onInput={(e) => setSearchKeyword(e.detail.value)}
										placeholder="输入企业名称关键词搜索"
										placeholderClass="text-slate-400 text-xs"
										className="flex-1 text-sm flex items-center text-slate-800"
									/>
									{searchKeyword && (
										<View
											onClick={() => {
												setSearchKeyword('');
												fetchEnterpriseList(1, '', false);
											}}
											className="icon-[ph--x-circle-fill] size-4 text-slate-300 cursor-pointer"
										/>
									)}
								</View>
								<Button onClick={handleSearch} variant="primary">
									搜索
								</Button>
							</View>
						</View>

						{/* 企业列表滚动区 */}
						<ScrollView
							scrollY
							onScrollToLower={handleLoadMore}
							lowerThreshold={60}
							className="flex-1 min-h-0 px-4"
						>
							{enterpriseList.length === 0 && !loadingList ? (
								<View className="py-10">
									<Empty
										title="未找到匹配企业"
										subTitle="可尝试更换关键词，或点击下方手动输入企业名称"
									/>
								</View>
							) : (
								<View className="flex flex-col divide-y divide-slate-100 py-1">
									{enterpriseList.map((item) => {
										const isSelected = selectedEnterprise?.entId === item.entId;
										return (
											<View
												key={item.entId}
												onClick={() => handleSelectEnterprise(item)}
												className={cn(
													'py-3.5 px-2 flex items-center justify-between gap-3 cursor-pointer active:bg-slate-50 rounded-lg',
													isSelected && 'bg-blue-50/50',
												)}
											>
												<Text
													className={cn(
														'text-sm flex-1',
														isSelected ? 'text-primary font-semibold' : 'text-slate-700',
													)}
												>
													{item.entName}
												</Text>
												{isSelected && (
													<View className="icon-[ph--check-circle-fill] size-5 text-primary shrink-0" />
												)}
											</View>
										);
									})}
								</View>
							)}

							<View className="py-4 flex items-center justify-center">
								{loadingList ? (
									<Text className="text-sm text-slate-400">加载中...</Text>
								) : enterpriseList.length > 0 ? (
									<Text className="text-sm text-slate-400">
										{hasMore ? '上拉加载更多' : `已加载全部 ${total} 家企业`}
									</Text>
								) : null}
							</View>
						</ScrollView>
			</Drawer>
		</Page>
	);
};

export default EnterpriseRegisterPage;
