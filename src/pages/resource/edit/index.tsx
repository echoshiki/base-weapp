import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Input, Textarea, Picker } from '@tarojs/components';
import { Card, Button, ImageUploader, Skeleton, Empty, FormItem } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { useAuth } from '@/hooks/useAuth';
import { useUpload } from '@/hooks/useUpload';
import {
	parseResourcePhotoList,
	useChainResourceCategoryList,
	useChainResourceDetail,
	useUpdateChainResource,
} from '@/hooks/useResource';

export default function ResourceEditPage() {
	const instance = Taro.getCurrentInstance();
	const zyId = instance.router?.params?.zyId;

	const { isAdmin } = useAuth();
	const { data: detail, isLoading } = useChainResourceDetail(zyId);
	const { data: categoryList = [] } = useChainResourceCategoryList();
	const updateMutation = useUpdateChainResource();
	const { triggerUpload, isUploading } = useUpload();

	const [zyName, setZyName] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [zyMoney, setZyMoney] = useState('');
	const [zyAddress, setZyAddress] = useState('');
	const [zyContact, setZyContact] = useState('');
	const [zyPhone, setZyPhone] = useState('');
	const [zyFacility, setZyFacility] = useState('');
	const [zyDesc, setZyDesc] = useState('');
	const [photos, setPhotos] = useState<string[]>([]);

	// 权限校验：仅管理员可编辑
	useEffect(() => {
		if (!isAdmin) {
			Taro.showToast({ title: '仅管理员可编辑链资源', icon: 'none' });
			setTimeout(() => {
				Taro.navigateBack({ delta: 1 });
			}, 600);
		}
	}, [isAdmin]);

	// 回显详情数据
	useEffect(() => {
		if (!detail) return;
		setZyName(detail.zyName || '');
		setCategoryId(detail.categoryId || detail.zyflId || '');
		setZyMoney(detail.zyMoney || '');
		setZyAddress(detail.zyAddress || '');
		setZyContact(detail.zyContact || '');
		setZyPhone(detail.zyPhone || '');
		setZyFacility(detail.zyFacility || '');
		setZyDesc(detail.zyDesc || '');
		setPhotos(parseResourcePhotoList(detail.zyPhoto));
	}, [detail]);

	const handleSubmit = () => {
		if (!zyId) return;
		if (!zyName.trim()) {
			return Taro.showToast({ title: '请输入资源名称', icon: 'none' });
		}

		updateMutation.mutate(
			{
				zyId,
				zyName: zyName.trim(),
				categoryId: categoryId || undefined,
				zyMoney: zyMoney.trim(),
				zyAddress: zyAddress.trim(),
				zyContact: zyContact.trim(),
				zyPhone: zyPhone.trim(),
				zyFacility: zyFacility.trim(),
				zyDesc: zyDesc.trim(),
				zyPhoto: photos.join(','),
			},
			{
				onSuccess: () => {
					setTimeout(() => {
						Taro.navigateBack({ delta: 1 });
					}, 500);
				},
			},
		);
	};

	if (isLoading) {
		return (
			<BizPage paddingX={false} defaultShowHeader className="bg-slate-50 min-h-screen">
				<View className="p-4 flex flex-col gap-3">
					<Card className="p-4 rounded-2xl flex flex-col gap-3">
						<Skeleton className="h-5 w-1/3" />
						<Skeleton className="h-11 w-full rounded-xl" />
						<Skeleton className="h-11 w-full rounded-xl" />
						<Skeleton className="h-24 w-full rounded-xl" />
					</Card>
				</View>
			</BizPage>
		);
	}

	if (!detail) {
		return (
			<BizPage paddingX={false} defaultShowHeader className="bg-slate-50 min-h-screen">
				<View className="flex-1 flex items-center justify-center p-6">
					<Empty title="未找到链资源" subTitle="无法加载该资源的编辑信息" />
				</View>
			</BizPage>
		);
	}

	return (
		<BizPage paddingX={false} defaultShowHeader className="bg-slate-50 min-h-screen pb-24">
			<View className="p-4 flex flex-col gap-4">
				{/* 基本信息 */}
				<Card className="rounded gap-1">
					<Text className="font-bold text-slate-800">基本信息</Text>

					<FormItem layout="column" label="资源名称" required>
						<Input
							className="text-sm"
							value={zyName}
							placeholder="请输入资源名称"
							onInput={(e) => setZyName(e.detail.value)}
						/>
					</FormItem>

					{categoryList.length > 0 ? (
						<FormItem layout="column" label="资源分类" required border={false}>
							<Picker
								mode="selector"
								range={categoryList}
								rangeKey="zyflName"
								value={Math.max(
									0,
									categoryList.findIndex((c) => c.zyflId === categoryId),
								)}
								onChange={(e) => {
									const idx = Number(e.detail.value);
									const picked = categoryList[idx];
									if (picked) {
										setCategoryId(picked.zyflId);
									}
								}}
							>
								<View className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-11 flex items-center justify-between">
									<Text
										className={
											categoryList.find((c) => c.zyflId === categoryId)?.zyflName ||
											detail.zyflName
												? 'text-sm text-slate-800'
												: 'text-xs text-slate-400'
										}
									>
										{categoryList.find((c) => c.zyflId === categoryId)?.zyflName ||
											detail.zyflName ||
											'请选择资源分类'}
									</Text>
									<View className="icon-[ph--caret-down] size-4 text-slate-400" />
								</View>
							</Picker>
						</FormItem>
					) : detail.zyflName ? (
						<FormItem layout="column" label="资源分类" required>
							<Input className="text-sm text-slate-600" value={detail.zyflName} disabled />
						</FormItem>
					) : null}

					<FormItem layout="column" label="参考金额" required>
						<Input
							className="text-sm"
							value={zyMoney}
							placeholder="请输入金额或价格说明"
							onInput={(e) => setZyMoney(e.detail.value)}
						/>
					</FormItem>

					<FormItem layout="column" label="资源地点" required>
						<Input
							className="text-sm"
							value={zyAddress}
							onInput={(e) => setZyAddress(e.detail.value)}
							placeholder="请输入资源所在地址"
						/>
					</FormItem>
				</Card>

				{/* 联系信息 */}
				<Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-1">
					<Text className="font-bold text-slate-800 mb-1">联系方式</Text>

					<FormItem layout="column" label="联系人" required>
						<Input
							className="text-sm"
							value={zyContact}
							onInput={(e) => setZyContact(e.detail.value)}
							placeholder="请输入联系人姓名"
						/>
					</FormItem>

					<FormItem layout="column" label="联系电话" required>
						<Input
							className="text-sm"
							value={zyPhone}
							onInput={(e) => setZyPhone(e.detail.value)}
							placeholder="请输入联系电话"
						/>
					</FormItem>
				</Card>

				{/* 配套与描述 */}
				<Card className="rounded gap-1">
					<Text className="font-bold">详细描述</Text>

					<FormItem layout="column" label="配套设施" border={false}>
						<View className="border border-slate-400 rounded p-3">
							<Textarea
								value={zyFacility}
								onInput={(e) => setZyFacility(e.detail.value)}
								placeholder="请输入配套设施说明"
								maxlength={500}
								className="w-full h-30 text-sm"
							/>
						</View>
					</FormItem>

					<FormItem layout="column" label="资源描述" border={false}>
						<View className="border border-slate-400 rounded p-3">
							<Textarea
								value={zyDesc}
								onInput={(e) => setZyDesc(e.detail.value)}
								placeholder="请输入资源详细描述"
								maxlength={1000}
								className="w-full h-30 text-sm"
							/>
						</View>
					</FormItem>

					<FormItem layout="column" label="资源图片（最多 5 张）" border={false}>
						<ImageUploader
							value={photos}
							onChange={setPhotos}
							onUpload={triggerUpload}
							isUploading={isUploading}
							maxCount={5}
						/>
					</FormItem>
				</Card>
			</View>

			{/* 底部保存按钮 */}
			<View className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
				<Button block size="lg" variant="primary" loading={updateMutation.isLoading} onClick={handleSubmit}>
					保存修改
				</Button>
			</View>
		</BizPage>
	);
}
