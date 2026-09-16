import { View, Image, Text } from '@tarojs/components';
import { useState } from 'react';
import { usePageScroll } from '@tarojs/taro';
import { useNavInfo } from './useNavInfo';
import { cn } from '@/utils/common';

export interface NavBarProps {
	/** 自定义左侧 Logo 图片地址 */
	logoUrl?: string;
	/** 深色背景专用的反白 Logo 图片地址（可选，不传时自动通过 CSS 滤镜反白） */
	lightLogoUrl?: string;
	/** 左侧标题或文字（与 Logo 并排） */
	title?: string;
	/** 文字与图标初始主题色: 'dark' (深色黑字，默认) | 'light' (浅色白字) */
	theme?: 'dark' | 'light';
	/** 初始背景是否透明且向下滚动时自动渐变显现吸顶底色，默认 true */
	transparent?: boolean;
	/** 滚动后吸顶显示的背景类名 (默认 'bg-white/95 backdrop-blur-md shadow-xs'，可传 'bg-primary' 等) */
	activeBgClass?: string;
	/** 是否固定在顶部 (fixed)，默认 true */
	fixed?: boolean;
	/** 自定义外层样式类名 */
	className?: string;
}

export function NavBar({
	logoUrl,
	lightLogoUrl,
	title,
	theme = 'dark',
	transparent = true,
	activeBgClass = 'bg-white/95 backdrop-blur-md shadow-xs',
	fixed = true,
	className,
}: NavBarProps) {
	const { menuButton, paddingLeft, navBarHeight } = useNavInfo();
	const [scrollTop, setScrollTop] = useState(0);

	// 监听页面滚动，驱动背景渐变
	usePageScroll((res) => {
		if (transparent) {
			setScrollTop(res.scrollTop || 0);
		}
	});

	// 计算 50px 阀值的滚动渐变比例 (0 ~ 1)
	const progress = transparent ? Math.min(Math.max(scrollTop, 0) / 50, 1) : 1;

	// 滚动过半后，若初始是 light 白字，自动切为 dark 墨色，确保吸顶白底上文字清晰
	const isScrolled = progress > 0.5;
	const isLight = theme === 'light' && (!transparent || !isScrolled);

	// 决定当前渲染的 Logo 图片源
	const currentLogo = isLight && lightLogoUrl ? lightLogoUrl : logoUrl;
	// 如果没有传入专门的 lightLogoUrl，且处于 isLight 状态，则通过 CSS 滤镜一键反白
	const useFilterInvert = isLight && !lightLogoUrl;

	const navContent = (
		<View
			className={cn(
				fixed ? 'fixed top-0 left-0 right-0 z-50' : 'relative z-50',
				'transition-all duration-200 overflow-hidden',
				className,
			)}
			style={{ height: `${navBarHeight}px` }}
		>
			{/* 涵盖状态栏与胶囊全高度的吸顶底色背景层 */}
			<View
				className={cn('absolute inset-0 pointer-events-none transition-opacity duration-150', activeBgClass)}
				style={{ opacity: transparent ? progress : 1 }}
			/>

			{/* 导航栏内容：高度与胶囊对齐 */}
			<View
				className="flex items-center relative z-10"
				style={{
					marginTop: `${menuButton.top}px`,
					height: `${menuButton.height}px`,
					paddingLeft: `${paddingLeft}px`,
					paddingRight: `${menuButton.width + paddingLeft * 2}px`,
				}}
			>
				<View className="flex items-center h-full gap-2 truncate">
					{currentLogo && (
						<Image
							src={currentLogo}
							className={cn(
								'h-full shrink-0 transition-all duration-200',
								useFilterInvert && 'brightness-0 invert',
							)}
							mode="heightFix"
						/>
					)}
					{title && (
						<Text
							className={cn(
								'text-base font-bold truncate transition-colors leading-none duration-200',
								isLight ? 'text-white drop-shadow-sm' : 'text-gray-900',
							)}
						>
							{title}
						</Text>
					)}
				</View>
			</View>
		</View>
	);

	if (fixed) {
		return (
			<>
				{navContent}
				<View style={{ height: `${navBarHeight}px` }} className="w-full shrink-0 pointer-events-none" />
			</>
		);
	}

	return navContent;
}

export * from './useNavInfo';
