import Taro from '@tarojs/taro';
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import { Card, Button, DescriptionList, Description, Empty, Skeleton, Heading, Badge } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { useAuth } from '@/hooks/useAuth';
import {
	parseResourcePhotoList,
	resolveResourcePhotoUrl,
	useChainResourceDetail,
	useDeleteChainResource,
} from '@/hooks/useResource';
import { mapsTo } from '@/utils/common';

export default function ResourceDetailPage() {
	const instance = Taro.getCurrentInstance();
	const zyId = instance.router?.params?.zyId;

	const { isAdmin } = useAuth();
	const { data: detail, isLoading } = useChainResourceDetail(zyId);
	const deleteMutation = useDeleteChainResource();

	const photoUrls = parseResourcePhotoList(detail?.zyPhoto).map(resolveResourcePhotoUrl).filter(Boolean);

	const handlePreviewPhoto = (currentUrl: string) => {
		if (photoUrls.length === 0) return;
		Taro.previewImage({
			current: currentUrl,
			urls: photoUrls,
		});
	};

	const handleCallPhone = () => {
		if (!detail?.zyPhone) return;
		Taro.makePhoneCall({ phoneNumber: detail.zyPhone });
	};

	const handleEdit = () => {
		if (!detail?.zyId) return;
		mapsTo(`/pages/resource/edit/index?zyId=${detail.zyId}`);
	};

	const handleDelete = () => {
		if (!detail?.zyId) return;
		Taro.showModal({
			title: '确认删除',
			content: `确定要删除链资源“${detail.zyName}”吗？删除后无法恢复。`,
			confirmColor: '#ef4444',
			success: (res) => {
				if (res.confirm) {
					deleteMutation.mutate(detail.zyId, {
						onSuccess: () => {
							setTimeout(() => {
								Taro.navigateBack({ delta: 1 });
							}, 400);
						},
					});
				}
			},
		});
	};

	if (isLoading) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen p-4 flex flex-col gap-3">
				<Skeleton className="h-48 w-full rounded-2xl" />
				<Card className="p-4 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-1/2" />
				</Card>
				<Card className="p-4 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-5 w-1/3" />
					<Skeleton className="h-20 w-full" />
				</Card>
			</BizPage>
		);
	}

	if (!detail) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
				<Empty title="未找到链资源" subTitle="该资源可能已下架或被删除" />
			</BizPage>
		);
	}

	return (
		<BizPage paddingX={false} className="bg-slate-50 min-h-screen pb-24">
			<View className="p-4 flex flex-col gap-3.5">
				{photoUrls.length > 0 && (
					<View className="w-full h-52 rounded-2xl overflow-hidden bg-slate-200 border border-slate-200/70 shadow-xs">
						<Swiper
							className="w-full h-full"
							indicatorDots={photoUrls.length > 1}
							indicatorColor="rgba(255,255,255,0.5)"
							indicatorActiveColor="#ffffff"
							circular
						>
							{photoUrls.map((url, idx) => (
								<SwiperItem key={`${url}-${idx}`}>
									<Image
										src={url}
										mode="aspectFill"
										onClick={() => handlePreviewPhoto(url)}
										className="w-full h-full cursor-pointer"
									/>
								</SwiperItem>
							))}
						</Swiper>
					</View>
				)}

				<Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-2.5">
					<View className="flex items-center justify-between">
						<Text className="text-lg font-bold text-slate-900 leading-snug flex-1">{detail.zyName}</Text>
						{detail.zyflName && <Badge variant="amber">{detail.zyflName}</Badge>}
					</View>

					{detail.zyMoney && (
						<View className="flex items-baseline gap-1.5">
							<Text className="text-xs text-slate-400">参考金额：</Text>
							<Text>{detail.zyMoney || '-'}</Text>
						</View>
					)}

					{detail.zyAddress && (
						<View className="flex items-center gap-1 text-xs text-slate-600">
							<View className="icon-[ph--map-pin-duotone] size-4 text-slate-400 shrink-0" />
							<Text className="leading-snug">{detail.zyAddress}</Text>
						</View>
					)}
				</Card>

				<Heading size="sm" title="详情信息" className="border-l-10 border-primary pl-3" />
				<Card>
					<DescriptionList divider>
						<Description label="资源描述" value={detail.zyDesc || '暂无资源描述'} />
						<Description label="配套设施" value={detail.zyFacility || '暂无配套设施信息'} />
						<Description label="联系人" value={detail.zyContact || '-'} />
						<Description
							label="联系方式"
							value={
								detail.zyPhone ? (
									<View
										onClick={handleCallPhone}
										className="inline-flex items-center gap-1.5 text-primary cursor-pointer"
									>
										<Text className="font-mono font-medium">{detail.zyPhone}</Text>
										<View className="icon-[ph--phone-outgoing] size-3.5" />
									</View>
								) : (
									'-'
								)
							}
						/>
					</DescriptionList>
				</Card>
			</View>

			{isAdmin && (
				<View className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3">
					<Button
						variant="rose"
						appearance="soft"
						loading={deleteMutation.isLoading}
						onClick={handleDelete}
						className="flex-1 h-11 rounded-xl font-semibold text-sm"
					>
						删除资源
					</Button>
					<Button
						variant="primary"
						onClick={handleEdit}
						className="flex-2 h-11 rounded-xl bg-linear-to-r from-blue-600! to-indigo-600! text-white font-semibold text-sm border-none shadow-md shadow-blue-500/20"
					>
						编辑资源
					</Button>
				</View>
			)}
		</BizPage>
	);
}
