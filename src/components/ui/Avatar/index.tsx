import { View, Text, Image, ViewProps } from '@tarojs/components';
import { useState, useEffect, ReactNode } from 'react';
import { cn } from '@/utils/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const BG_COLORS = [
	'bg-blue-400',
	'bg-emerald-400',
	'bg-violet-400',
	'bg-amber-400',
	'bg-rose-400',
	'bg-indigo-400',
	'bg-cyan-400',
];

const SIZE_MAP: Record<AvatarSize, string> = {
	xs: 'size-6 text-xs',
	sm: 'size-8 text-xs',
	md: 'size-12 text-sm',
	lg: 'size-16 text-base',
	xl: 'size-20 text-xl',
};

const getBgColor = (str: string) => {
	const charCodeSum = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
	return BG_COLORS[charCodeSum % BG_COLORS.length];
};

export interface AvatarProps extends ViewProps {
	/** 头像图片地址 */
	src?: string;
	/** 用户名（用于无图/加载失败时的首字母兜底与背景色计算） */
	name?: string;
	/** 尺寸预设，默认 md */
	size?: AvatarSize;
	/** 自定义兜底占位内容（优先级高于默认首字母） */
	fallback?: ReactNode;
	className?: string;
}

/**
 * Avatar 头像组件
 * 支持图片展示、加载失败自动回退首字母彩底占位及自定义 fallback
 */
export function Avatar({ src, name = 'U', size = 'md', fallback, className, ...props }: AvatarProps) {
	const [isError, setIsError] = useState(false);

	// src 变化时重置错误状态，确保更换头像后能正常加载新图
	useEffect(() => {
		setIsError(false);
	}, [src]);

	const safeName = name?.trim() || 'U';
	const displayChar = safeName.charAt(0).toUpperCase();
	const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

	return (
		<View
			className={cn(
				'relative rounded-full overflow-hidden flex items-center justify-center shrink-0 border-2 border-white/20 shadow-xs',
				sizeClass,
				className,
			)}
			{...props}
		>
			{src && !isError ? (
				<Image src={src} className="size-full" mode="aspectFill" onError={() => setIsError(true)} />
			) : fallback !== undefined ? (
				fallback
			) : (
				<View className={cn('size-full flex items-center justify-center text-white font-bold', getBgColor(safeName))}>
					<Text>{displayChar}</Text>
				</View>
			)}
		</View>
	);
}
