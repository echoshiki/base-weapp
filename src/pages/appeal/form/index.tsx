import { useEffect, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Input, Textarea, Video } from '@tarojs/components';
import { Card, Button, Skeleton, FormItem, Badge, ImageUploader } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { useAuth } from '@/hooks/useAuth';
import { useUpload } from '@/hooks/useUpload';
import { resolveResourcePhotoUrl } from '@/hooks/useResource';
import {
	getAppealTagColor,
	useAddAppeal,
	useAppealDetail,
	useAppealTypeList,
	useUpdateAppeal,
} from '@/hooks/useDemand';
import { UploadFileItem } from '@/types/common';
import { formatFileSize, getFileMeta, previewFileOrImage } from '@/utils/file';
import { cn } from '@/utils/common';

const MAX_IMAGES = 5;
const MAX_VIDEOS = 3;
const MAX_FILES = 5;

/**
 * 企业诉求发布 / 编辑表单页（企业端用户限定）
 */
export default function AppealFormPage() {
	const instance = Taro.getCurrentInstance();
	const requId = instance.router?.params?.requId;
	const isEditMode = !!requId;

	const { isEnterprise } = useAuth();
	const { data: typeList = [], isLoading: isLoadingTypes } = useAppealTypeList();
	const { data: detail, isLoading: isLoadingDetail } = useAppealDetail(requId);
	const { triggerUploadFiles, isUploading } = useUpload();

	const addMutation = useAddAppeal();
	const updateMutation = useUpdateAppeal();

	const [title, setTitle] = useState('');
	const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]);
	const [detailText, setDetailText] = useState('');
	const [imageFiles, setImageFiles] = useState<UploadFileItem[]>([]);
	const [videoFiles, setVideoFiles] = useState<UploadFileItem[]>([]);
	const [files, setFiles] = useState<UploadFileItem[]>([]);
	const [previewVideoUrl, setPreviewVideoUrl] = useState<string>('');

	// 暂存本次刚上传的图片完整元数据，供 ImageUploader onChange 时映射还原 UploadFileItem
	const uploadedImageMapRef = useRef<Map<string, UploadFileItem>>(new Map());

	useEffect(() => {
		Taro.setNavigationBarTitle({
			title: isEditMode ? '编辑诉求' : '发布诉求',
		});
	}, [isEditMode]);

	useEffect(() => {
		if (!isEnterprise) {
			Taro.showToast({ title: '仅企业用户可提报或修改诉求', icon: 'none' });
			setTimeout(() => {
				Taro.navigateBack({ delta: 1 });
			}, 600);
		}
	}, [isEnterprise]);

	// 编辑模式下回显数据
	useEffect(() => {
		if (!isEditMode || !detail) return;
		setTitle(detail.title || '');
		setDetailText(detail.detail || '');
		if (detail.typeId) {
			setSelectedTypeIds(
				detail.typeId
					.split(/[,，]/)
					.map((s) => s.trim())
					.filter(Boolean),
			);
		}
		setImageFiles(detail.imageFiles || []);
		setVideoFiles(detail.videoFiles || []);
		setFiles(detail.files || []);
	}, [isEditMode, detail]);

	const toggleTypeId = (typeId: string) => {
		setSelectedTypeIds((prev) => (prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]));
	};

	// 图片上传（配合 ImageUploader 映射为 UploadFileItem[]）
	const handleImageUpload = async (tempPaths: string[]): Promise<string[]> => {
		const items = await triggerUploadFiles(tempPaths);
		items.forEach((item) => {
			uploadedImageMapRef.current.set(resolveResourcePhotoUrl(item.filePath), item);
		});
		return items.map((item) => resolveResourcePhotoUrl(item.filePath));
	};

	const handleImageChange = (nextUrls: string[]) => {
		const existingMap = new Map<string, UploadFileItem>();
		imageFiles.forEach((f) => existingMap.set(resolveResourcePhotoUrl(f.filePath), f));
		uploadedImageMapRef.current.forEach((v, k) => existingMap.set(k, v));

		const nextItems = nextUrls.map((url) => {
			const matched = existingMap.get(url);
			if (matched) return matched;
			const name = url.split('/').pop() || 'image.png';
			return {
				filePath: url,
				fileName: name,
				fileType: name.split('.').pop() || 'png',
				fileSize: 0,
			};
		});
		setImageFiles(nextItems);
	};

	// 视频上传
	const handleChooseVideo = async () => {
		if (isUploading || videoFiles.length >= MAX_VIDEOS) return;
		try {
			const res = await Taro.chooseVideo({
				sourceType: ['album', 'camera'],
				maxDuration: 60,
			});
			if (!res.tempFilePath) return;
			const name = res.tempFilePath.split('/').pop() || `video_${Date.now()}.mp4`;
			const items = await triggerUploadFiles(
				[res.tempFilePath],
				[
					{
						fileName: name,
						fileSize: res.size || 0,
						fileType: name.split('.').pop() || 'mp4',
					},
				],
			);
			if (items.length > 0) {
				setVideoFiles((prev) => [...prev, ...items].slice(0, MAX_VIDEOS));
			}
		} catch (e) {
			console.warn('选择或上传视频取消/失败:', e);
		}
	};

	const handleRemoveVideo = (idx: number) => {
		setVideoFiles((prev) => prev.filter((_, i) => i !== idx));
	};

	// 附件文件上传（兼容 H5 原生文件选择与微信小程序 chooseMessageFile）
	const handleChooseFiles = async () => {
		if (isUploading || files.length >= MAX_FILES) return;
		const remain = MAX_FILES - files.length;

		// H5 浏览器环境使用原生 <input type="file">
		if (process.env.TARO_ENV === 'h5' && typeof document !== 'undefined') {
			const input = document.createElement('input');
			input.type = 'file';
			input.multiple = remain > 1;
			input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip';
			input.style.display = 'none';
			document.body.appendChild(input);

			input.onchange = async () => {
				const selected = Array.from(input.files || []).slice(0, remain);
				input.remove();
				if (selected.length === 0) return;

				const objectUrls = selected.map((f) => URL.createObjectURL(f));
				const metas = selected.map((f) => ({
					fileName: f.name,
					fileSize: f.size,
					fileType: f.name.split('.').pop() || 'file',
				}));
				try {
					const items = await triggerUploadFiles(objectUrls, metas);
					if (items.length > 0) {
						setFiles((prev) => [...prev, ...items].slice(0, MAX_FILES));
					}
				} finally {
					objectUrls.forEach((url) => URL.revokeObjectURL(url));
				}
			};

			input.click();
			return;
		}

		// 小程序环境使用微信聊天文件选择
		try {
			const res = await Taro.chooseMessageFile({
				count: remain,
				type: 'file',
				extension: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip'],
			});
			if (!res.tempFiles?.length) return;
			const paths = res.tempFiles.map((f) => f.path);
			const metas = res.tempFiles.map((f) => ({
				fileName: f.name,
				fileSize: f.size,
				fileType: f.name.split('.').pop() || 'file',
			}));
			const items = await triggerUploadFiles(paths, metas);
			if (items.length > 0) {
				setFiles((prev) => [...prev, ...items].slice(0, MAX_FILES));
			}
		} catch (e: any) {
			if (e?.errMsg?.includes('cancel')) return;
			Taro.showToast({ title: '选择文件失败，请重试', icon: 'none' });
		}
	};

	const handleRemoveFile = (idx: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== idx));
	};

	const isSubmitting = addMutation.isLoading || updateMutation.isLoading;

	const handleSubmit = () => {
		const trimmedTitle = title.trim();
		const trimmedDetail = detailText.trim();

		if (!trimmedTitle) {
			return Taro.showToast({ title: '请输入诉求标题', icon: 'none' });
		}
		if (selectedTypeIds.length === 0) {
			return Taro.showToast({ title: '请至少选择一个诉求类别', icon: 'none' });
		}
		if (!trimmedDetail) {
			return Taro.showToast({ title: '请输入诉求描述', icon: 'none' });
		}

		const typeIdStr = selectedTypeIds.join(',');
		const commonPayload = {
			title: trimmedTitle,
			typeId: typeIdStr,
			detail: trimmedDetail,
			imageFiles,
			videoFiles,
			files,
		};

		if (isEditMode && requId) {
			updateMutation.mutate(
				{
					requId,
					...commonPayload,
				},
				{
					onSuccess: () => {
						setTimeout(() => {
							Taro.navigateBack({ delta: 1 });
						}, 500);
					},
				},
			);
			return;
		}

		addMutation.mutate(commonPayload, {
			onSuccess: () => {
				setTimeout(() => {
					Taro.navigateBack({ delta: 1 });
				}, 500);
			},
		});
	};

	if (isEditMode && isLoadingDetail) {
		return (
			<BizPage paddingX={false} defaultShowHeader>
				<View className="p-4 flex flex-col gap-3">
					<Card className="rounded flex flex-col gap-3">
						<Skeleton className="h-5 w-1/3" />
						<Skeleton className="h-11 w-full rounded-xl" />
						<Skeleton className="h-16 w-full rounded-xl" />
						<Skeleton className="h-28 w-full rounded-xl" />
					</Card>
				</View>
			</BizPage>
		);
	}

	return (
		<BizPage paddingX={false} defaultShowHeader className="pb-24">
			<View className="p-4 flex flex-col gap-4">
				{/* 基本诉求信息 */}
				<Card className="rounded gap-1">
					<FormItem layout="column" label="诉求标题" required>
						<Input
							className="text-sm"
							value={title}
							maxlength={100}
							placeholder="请简明扼要填写您的诉求标题"
							onInput={(e) => setTitle(e.detail.value)}
						/>
					</FormItem>

					<FormItem layout="column" label="诉求类别" helper="支持多选" required border={false}>
						{isLoadingTypes ? (
							<View className="flex flex-wrap gap-2">
								{[1, 2, 3, 4].map((idx) => (
									<Skeleton key={idx} className="h-7 w-20 rounded-full" />
								))}
							</View>
						) : typeList.length === 0 ? (
							<Text className="text-xs text-slate-400">暂无可选诉求类别</Text>
						) : (
							<View className="flex flex-wrap gap-2">
								{typeList.map((typeItem, idx) => {
									const isSelected = selectedTypeIds.includes(typeItem.typeId);
									return (
										<Badge
											key={typeItem.typeId}
											pill
											variant={isSelected ? 'primary' : getAppealTagColor(idx)}
											icon={isSelected ? 'icon-[ph--check-bold]' : undefined}
											className={cn(
												'cursor-pointer',
												isSelected && 'bg-primary! text-white! border-primary!',
											)}
											onClick={() => toggleTypeId(typeItem.typeId)}
										>
											{typeItem.typeName}
										</Badge>
									);
								})}
							</View>
						)}
					</FormItem>

					<FormItem layout="column" label="诉求描述" required border={false}>
						<View className="border border-slate-400 rounded p-3">
							<Textarea
								value={detailText}
								maxlength={1000}
								onInput={(e) => setDetailText(e.detail.value)}
								placeholder="请详细描述您遇到的困难、诉求背景及期望获得的协调支持"
								className="w-full h-36 text-sm"
							/>
						</View>
					</FormItem>
				</Card>

				{/* 图片 / 视频 / 附件材料 */}
				<Card className="rounded gap-1">
					<FormItem layout="column" label="图片材料" helper={`最多上传 ${MAX_IMAGES} 张`} border={false}>
						<ImageUploader
							value={imageFiles.map((f) => resolveResourcePhotoUrl(f.filePath))}
							onChange={handleImageChange}
							onUpload={handleImageUpload}
							isUploading={isUploading}
							maxCount={MAX_IMAGES}
						/>
					</FormItem>

					<FormItem layout="column" label="视频材料" helper={`最多上传 ${MAX_VIDEOS} 个`} border={false}>
						<View className="grid grid-cols-2 gap-2.5">
							{videoFiles.map((video, idx) => {
								const videoUrl = resolveResourcePhotoUrl(video.filePath);
								return (
									<View
										key={`${video.filePath}-${idx}`}
										onClick={() => setPreviewVideoUrl(videoUrl)}
										className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer"
									>
										<Video
											src={videoUrl}
											controls={false}
											showPlayBtn={false}
											showCenterPlayBtn={false}
											objectFit="cover"
											className="w-full h-full pointer-events-none"
										/>
										{/* 居中播放图标 */}
										<View className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
											<View className="size-10 rounded-full bg-black/55 backdrop-blur-xs flex items-center justify-center">
												<View className="icon-[ph--play-fill] size-4.5 text-white ml-0.5" />
											</View>
										</View>
										{/* 右上角删除按钮 */}
										<View
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveVideo(idx);
											}}
											className="absolute top-1.5 right-1.5 z-20 size-6 rounded-full bg-black/65 flex items-center justify-center cursor-pointer active:scale-90"
										>
											<View className="icon-[ph--x-bold] size-3.5 text-white" />
										</View>
									</View>
								);
							})}

							{videoFiles.length < MAX_VIDEOS && (
								<View
									onClick={handleChooseVideo}
									className="aspect-4/3 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-1.5 cursor-pointer active:bg-slate-100"
								>
									<View className="icon-[ph--video-camera-duotone] size-6 text-slate-400" />
									<Text className="text-xs text-slate-400">
										{isUploading ? '上传中...' : '选择或拍摄视频'}
									</Text>
								</View>
							)}
						</View>
					</FormItem>

					<FormItem layout="column" label="附件文档" helper={`最多上传 ${MAX_FILES} 份`} border={false}>
						<View className="flex flex-col gap-2">
							{files.map((file, idx) => {
								const meta = getFileMeta(file.fileName, file.fileType);
								return (
									<View
										key={`${file.filePath}-${idx}`}
										onClick={() =>
											previewFileOrImage(
												resolveResourcePhotoUrl(file.filePath),
												file.fileName,
												file.fileType,
											)
										}
										className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer"
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
										<View
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveFile(idx);
											}}
											className="size-7 rounded-lg flex items-center justify-center text-slate-400 active:bg-slate-200 shrink-0"
										>
											<View className="icon-[ph--trash] size-4" />
										</View>
									</View>
								);
							})}

							{files.length < MAX_FILES && (
								<View
									onClick={handleChooseFiles}
									className="h-12 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center gap-2 cursor-pointer active:bg-slate-100"
								>
									<View className="icon-[ph--paperclip] size-4 text-slate-500" />
									<Text className="text-xs text-slate-400">
										{isUploading
											? '上传中...'
											: process.env.TARO_ENV === 'h5'
												? '选择本地附件上传'
												: '从微信聊天选择附件'}
									</Text>
								</View>
							)}
						</View>
					</FormItem>
				</Card>
			</View>

			{/* 视频预览播放弹窗 */}
			{previewVideoUrl && (
				<View
					onClick={() => setPreviewVideoUrl('')}
					className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-4"
				>
					<View
						onClick={(e) => e.stopPropagation()}
						className="w-full rounded-2xl overflow-hidden bg-black relative"
					>
						<Video
							src={previewVideoUrl}
							controls
							autoplay
							showFullscreenBtn
							className="w-full h-64 block"
						/>
					</View>
					<View
						onClick={() => setPreviewVideoUrl('')}
						className="mt-5 size-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer active:bg-white/30"
					>
						<View className="icon-[ph--x-bold] size-5 text-white" />
					</View>
				</View>
			)}

			{/* 吸底提交按钮 */}
			<View className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
				<Button
					block
					size="lg"
					variant="primary"
					loading={isSubmitting}
					disabled={isSubmitting || isUploading}
					onClick={handleSubmit}
				>
					{isEditMode ? '保存修改' : '提交诉求'}
				</Button>
			</View>
		</BizPage>
	);
}
