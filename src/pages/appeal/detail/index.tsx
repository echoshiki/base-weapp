import Taro from '@tarojs/taro';
import { View, Text, Image, Video } from '@tarojs/components';
import { Card, DescriptionList, Description, Empty, Skeleton, Badge, Heading, Button, Divider } from '@/components/ui';
import { resolveResourcePhotoUrl } from '@/hooks/useResource';
import { formatFileSize, getFileMeta, previewFileOrImage } from '@/utils/file';
import { BizPage } from '@/components/biz';
import { useAuth } from '@/hooks/useAuth';
import {
	getAppealTagColor,
	resolveAppealTypeTags,
	useAppealDetail,
	useAppealTypeList,
	useDeleteAppeal,
} from '@/hooks/useDemand';
import { mapsTo, cn } from '@/utils/common';

export default function AppealDetailPage() {
	const instance = Taro.getCurrentInstance();
	const requId = instance.router?.params?.requId;

	const { isEnterprise } = useAuth();
	const { typeMap } = useAppealTypeList();
	const { data: detail, isLoading } = useAppealDetail(requId);
	const deleteMutation = useDeleteAppeal();

	const handleEdit = () => {
		if (!detail?.requId) return;
		mapsTo(`/pages/appeal/form/index?requId=${detail.requId}`);
	};

	const handleDelete = () => {
		if (!detail?.requId) return;
		Taro.showModal({
			title: '确认删除',
			content: `确定要删除诉求“${detail.title}”吗？删除后无法恢复。`,
			confirmColor: '#ef4444',
			success: (res) => {
				if (res.confirm) {
					deleteMutation.mutate(detail.requId, {
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
				<Card className="p-4 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-6 w-3/4" />
					<View className="flex gap-2">
						<Skeleton className="h-5 w-20 rounded-full" />
						<Skeleton className="h-5 w-24 rounded-full" />
					</View>
				</Card>
				<Card className="p-4 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-5 w-1/3" />
					<Skeleton className="h-24 w-full" />
				</Card>
			</BizPage>
		);
	}

	if (!detail) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
				<Empty title="未找到诉求详情" subTitle="该企业诉求可能已删除或不存在" />
			</BizPage>
		);
	}

	const typeTags = resolveAppealTypeTags(detail.typeName, detail.typeId, typeMap);

	return (
		<BizPage paddingX={false} className={cn(isEnterprise ? 'pb-24' : 'pb-10')}>
			<View className="p-4 flex flex-col gap-3.5">
				<Card>
					<Text className="text-lg font-bold text-slate-800 leading-snug">{detail.title}</Text>
					<View className="flex flex-wrap items-center gap-1.5 mt-3">
						{detail.entName && (
							<Badge variant="blue" icon="icon-[ph--buildings] ">
								{detail.entName}
							</Badge>
						)}
						{typeTags.map((tag, idx) => (
							<Badge key={tag} variant={getAppealTagColor(idx)}>
								{tag}
							</Badge>
						))}
					</View>
				</Card>

				<Heading size="md" title="诉求描述" className="border-l-10 border-primary pl-3 mt-3" />

				<Card>
					<Text className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
						{detail.detail || '暂无详细描述'}
					</Text>
				</Card>

				<Heading size="md" title="基础信息" className="border-l-10 border-primary pl-3 mt-3" />

				<Card>
					<DescriptionList divider>
						<Description label="归属企业" value={detail.entName || '-'} labelWidth="w-20" />
						<Description
							label="诉求类别"
							value={typeTags.length > 0 ? typeTags.join('、') : '-'}
							labelWidth="w-20"
						/>
						<Description label="提交时间" value={detail.subTime || '-'} labelWidth="w-20" />
						<Description label="创建时间" value={detail.createTime || '-'} labelWidth="w-20" />
					</DescriptionList>
				</Card>

				{/* 图片附件展示 */}
				{detail.imageFiles && detail.imageFiles.length > 0 && (
					<>
						<Heading size="md" title="图片材料" className="border-l-10 border-primary pl-3 mt-3" />
						<Card>
							<View className="grid grid-cols-3 gap-2.5">
								{detail.imageFiles.map((img, idx) => {
									const url = resolveResourcePhotoUrl(img.filePath);
									const allUrls = detail.imageFiles!.map((i) => resolveResourcePhotoUrl(i.filePath));
									return (
										<View
											key={`${img.filePath}-${idx}`}
											onClick={() => Taro.previewImage({ current: url, urls: allUrls })}
											className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 cursor-pointer"
										>
											<Image src={url} mode="aspectFill" className="w-full h-full" />
										</View>
									);
								})}
							</View>
						</Card>
					</>
				)}

				{/* 视频附件展示 */}
				{detail.videoFiles && detail.videoFiles.length > 0 && (
					<>
						<Heading size="md" title="视频材料" className="border-l-10 border-primary pl-3 mt-3" />
						<Card className="gap-3">
							{detail.videoFiles.map((video, idx) => (
								<View
									key={`${video.filePath}-${idx}`}
									className="rounded-xl overflow-hidden bg-black border border-slate-200/70"
								>
									<Video
										src={resolveResourcePhotoUrl(video.filePath)}
										controls
										showFullscreenBtn
										className="w-full h-44 block"
									/>
								</View>
							))}
						</Card>
					</>
				)}

				{/* 文档附件展示 */}
				{detail.files && detail.files.length > 0 && (
					<>
						<Heading size="md" title="附件文档" className="border-l-10 border-primary pl-3 mt-3" />
						<Card className="gap-2.5">
							{detail.files.map((file, idx) => {
								const meta = getFileMeta(file.fileName, file.fileType);
								const url = resolveResourcePhotoUrl(file.filePath);
								return (
									<View
										key={`${file.filePath}-${idx}`}
										onClick={() => previewFileOrImage(url, file.fileName, file.fileType)}
										className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 active:bg-slate-100 cursor-pointer"
									>
										<View className="flex items-center gap-2.5 min-w-0 flex-1">
											<View className={cn(meta.iconClass, 'size-6 shrink-0')} />
											<View className="flex flex-col min-w-0 flex-1">
												<Text className="text-xs font-medium text-slate-800 truncate">
													{file.fileName}
												</Text>
												<Text className="text-xs text-slate-400">
													{meta.tag} · {formatFileSize(file.fileSize)}
												</Text>
											</View>
										</View>
										<View className="icon-[ph--caret-right-bold] size-3.5 text-slate-400 shrink-0" />
									</View>
								);
							})}
						</Card>
					</>
				)}
			</View>

			{/* 企业端限定：底部编辑/删除操作栏 */}
			{isEnterprise && (
				<View className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3">
					<Button
						variant="rose"
						appearance="soft"
						loading={deleteMutation.isLoading}
						onClick={handleDelete}
						className="flex-1 h-11 rounded-xl font-semibold text-sm"
					>
						删除诉求
					</Button>
					<Button
						variant="primary"
						onClick={handleEdit}
						className="flex-2 h-11 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm border-none shadow-md shadow-blue-500/20"
					>
						编辑诉求
					</Button>
				</View>
			)}
		</BizPage>
	);
}
