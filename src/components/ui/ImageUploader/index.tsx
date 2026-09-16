import { View, Image, Text, ViewProps } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ReactNode } from 'react';
import { Loading } from '../Loading';
import { cn } from '@/utils/common';

export interface ImageUploaderProps extends Omit<ViewProps, 'onChange'> {
	/** 图片地址数组 */
	value?: string[];
	/** 图片列表变动回调 */
	onChange?: (value: string[]) => void;
	/** 上传处理逻辑函数，返回已上传的真正 URL 数组 */
	onUpload?: (tempFilePaths: string[]) => Promise<string[]>;
	/** 最大上传图片数，默认 1 */
	maxCount?: number;
	/** 是否处于上传接口请求状态 */
	isUploading?: boolean;
	/** 点击已有图片是否自动调起大图预览，默认 true */
	preview?: boolean;
	/** 是否处于禁用 / 只读预览态 (只读模式隐藏上传/删除) */
	disabled?: boolean;
	readonly?: boolean;
	/** 说明图标 (Iconify 类名 string 或 ReactNode) */
	icon?: ReactNode;
	/** 说明文字 */
	label?: string;
	className?: string;
}

/**
 * ImageUploader 图片上传组件
 */
export function ImageUploader({
	value = [],
	onChange,
	maxCount = 1,
	onUpload,
	isUploading = false,
	preview = true,
	disabled = false,
	readonly = false,
	icon = 'icon-[ph--image-duotone]',
	label = '上传图片',
	className,
	...props
}: ImageUploaderProps) {
	const isReadonly = readonly || disabled;
	const canUpload = !isReadonly && value.length < maxCount;
	const isSingle = maxCount === 1;
	const hasImage = value.length > 0;

	// 点击图片：大图预览
	const handlePreviewImage = (index: number) => {
		if (!preview || !value.length) return;
		Taro.previewImage({
			urls: value,
			current: value[index] || value[0],
		});
	};

	// 触发选择图片并进行上传
	const handleChooseMedia = async () => {
		if (isUploading || isReadonly || !onUpload) return;
		try {
			const { tempFiles } = await Taro.chooseMedia({
				count: maxCount - value.length,
				mediaType: ['image'],
				sourceType: ['album', 'camera'],
				sizeType: ['compressed'],
			});

			if (!tempFiles.length) return;
			const newUrls = await onUpload(tempFiles.map((f) => f.tempFilePath));
			if (newUrls && newUrls.length) {
				onChange?.([...value, ...newUrls]);
			}
		} catch (e) {
			// 用户取消选择或选择失败
		}
	};

	// 删除图片
	const handleDelete = (index: number, e: any) => {
		e.stopPropagation();
		if (isReadonly) return;
		onChange?.(value.filter((_, i) => i !== index));
	};

	// 删除角标按钮
	const DeleteBadge = ({ index }: { index: number }) => {
		if (isReadonly) return null;
		return (
			<View
				className="absolute top-1 right-1 w-5 h-5 bg-black/60 active:bg-black/80 rounded-full flex items-center justify-center z-10 transition-colors"
				onClick={(e) => handleDelete(index, e)}
			>
				<View className="icon-[ph--x-bold] text-white w-3 h-3" />
			</View>
		);
	};

	// 渲染图标
	const renderIcon = (iconClass: string) => {
		if (icon) {
			if (typeof icon === 'string') {
				return <View className={cn(iconClass, icon)} />;
			}
			return icon;
		}
		return <View className={cn(iconClass, 'icon-[ph--image-duotone]')} />;
	};

	// 1. 单图模式 (isSingle = true)
	if (isSingle) {
		return (
			<View
				className={cn(
					'relative flex-1 aspect-video rounded-card overflow-hidden border-2 transition-colors',
					hasImage ? 'border-transparent' : 'border-dashed border-gray-200 bg-gray-50/80',
					!hasImage && !isReadonly && 'active:border-primary/50 cursor-pointer',
					isReadonly && !hasImage && 'opacity-60 bg-gray-100',
					className,
				)}
				onClick={hasImage ? () => handlePreviewImage(0) : handleChooseMedia}
				{...props}
			>
				{isUploading ? (
					<View className="absolute inset-0 flex items-center justify-center bg-gray-50/90">
						<Loading showTitle={false} />
					</View>
				) : hasImage ? (
					<View className="relative w-full h-full group">
						<Image src={value[0]} className="w-full h-full" mode="aspectFill" />
						<DeleteBadge index={0} />
						{/* 单图替换提示浮层 */}
						{!isReadonly && (
							<View
								className="absolute bottom-0 inset-x-0 bg-black/40 py-2 flex items-center justify-center"
								onClick={(e) => {
									e.stopPropagation();
									handleChooseMedia();
								}}
							>
								<Text className="text-xs text-white/90">点击更换</Text>
							</View>
						)}
					</View>
				) : (
					<View className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3">
						{renderIcon('size-7 text-gray-300')}
						<Text className="text-xs text-gray-400 text-center">{isReadonly ? '暂无图片' : label}</Text>
					</View>
				)}
			</View>
		);
	}

	// 2. 多图模式 (isSingle = false)
	return (
		<View className={cn('flex flex-wrap gap-2.5', className)} {...props}>
			{value.map((url, index) => (
				<View
					key={`${url}-${index}`}
					className="relative size-24 rounded-card overflow-hidden border border-gray-100/80 bg-gray-50 shadow-xs cursor-pointer"
					onClick={() => handlePreviewImage(index)}
				>
					<Image src={url} className="size-full" mode="aspectFill" />
					<DeleteBadge index={index} />
				</View>
			))}

			{canUpload && (
				<View
					className="size-24 border-2 border-dashed border-gray-200 bg-gray-50/80 rounded-card flex flex-col items-center justify-center gap-1 active:border-primary/50 transition-colors cursor-pointer"
					onClick={handleChooseMedia}
				>
					{isUploading ? (
						<Loading showTitle={false} />
					) : (
						<>
							{renderIcon('size-6 text-gray-300')}
							<Text className="text-xs text-gray-400">{label}</Text>
						</>
					)}
				</View>
			)}
		</View>
	);
}
