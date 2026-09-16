import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useEffect, ReactNode } from 'react';
import { cn } from '@/utils/common';

export interface ImagePreviewProps {
	/** 控制显隐 */
	visible?: boolean;
	open?: boolean;
	/** 想要预览的图片绝对路径 (单图模式) */
	src?: string;
	/** 想要预览的图片数组 (多图模式) */
	urls?: string[];
	/** 当前选中的图片索引，默认 0 */
	current?: number;
	/** 关闭弹窗回调 */
	onClose: () => void;
	/** 底部自定义操作区域 */
	actions?: ReactNode;
	/** 是否开启长按弹出菜单，默认 true */
	showMenuByLongpress?: boolean;
	className?: string;
}

/**
 * ImagePreview 全屏高保真图片预览组件
 */
export function ImagePreview({
	visible,
	open,
	src,
	urls,
	current = 0,
	onClose,
	actions,
	showMenuByLongpress = true,
	className,
}: ImagePreviewProps) {
	const activeVisible = open !== undefined ? open : !!visible;

	// 标准化处理图片列表
	const imageList: string[] = urls && urls.length ? urls : src ? [src] : [];
	const [activeIndex, setActiveIndex] = useState(current);

	useEffect(() => {
		setActiveIndex(current);
	}, [current, activeVisible]);

	if (!activeVisible) return null;

	return (
		<View
			className={cn(
				'fixed inset-0 bg-black/95 z-50 flex flex-col justify-between items-center px-4 py-8 animate-fade-in',
				className
			)}
		>
			{/* 顶部指示器与关闭按钮 */}
			<View className="w-full flex items-center justify-between pt-safe px-2 z-10">
				<Text className="text-xs font-semibold text-white/70 tracking-widest bg-white/10 px-3 py-1 rounded-full">
					{imageList.length > 0 ? `${activeIndex + 1} / ${imageList.length}` : '0 / 0'}
				</Text>
				<View
					className="icon-[ph--x-circle-fill] size-8 text-white/60 active:text-white transition-colors p-1"
					onClick={onClose}
				/>
			</View>

			{/* 图片 Swiper 渲染区 */}
			<View className="w-full flex-1 flex items-center justify-center py-2 relative">
				{imageList.length > 0 ? (
					<Swiper
						className="w-full h-full"
						current={activeIndex}
						onChange={(e) => setActiveIndex(e.detail.current)}
					>
						{imageList.map((imgUrl, idx) => (
							<SwiperItem key={`${imgUrl}-${idx}`} className="flex items-center justify-center">
								<Image
									src={imgUrl}
									mode="aspectFit"
									className="w-full h-full"
									showMenuByLongpress={showMenuByLongpress}
								/>
							</SwiperItem>
						))}
					</Swiper>
				) : (
					<Text className="text-sm text-white/40">暂无图片内容</Text>
				)}
			</View>

			{/* 底部扩展动作区 */}
			<View className="w-full px-4 flex flex-col gap-3 pb-safe z-10">
				{actions ? (
					actions
				) : (
					showMenuByLongpress && (
						<Text className="text-center text-xs text-white/40 tracking-wide">
							长按图片可进行转发、保存或识别
						</Text>
					)
				)}
			</View>
		</View>
	);
}

/**
 * 静态辅助函数：直接调起微信原生全屏图片预览
 */
ImagePreview.show = ({
	urls,
	current = 0,
}: {
	urls: string[];
	current?: number | string;
}) => {
	if (!urls || !urls.length) return;
	const currentUrl = typeof current === 'number' ? urls[current] || urls[0] : current;

	Taro.previewImage({
		urls,
		current: currentUrl,
	});
};
