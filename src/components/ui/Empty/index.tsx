import { View, Text, Image, ViewProps } from '@tarojs/components';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '../Button';
import { cn } from '@/utils/common';

let defaultEmptyImage: string | undefined;
const listeners = new Set<(url?: string) => void>();

/**
 * 全局注册默认空状态插画/动图（供业务层在拿到远端配置后注入，保持 Empty 组件纯 UI 无业务依赖）
 */
export function setDefaultEmptyImage(url?: string) {
	const next = url?.trim() || undefined;
	if (defaultEmptyImage === next) return;
	defaultEmptyImage = next;
	listeners.forEach((fn) => fn(next));
}

export interface EmptyProps extends ViewProps {
	/** 状态提示标题 */
	title?: ReactNode;
	/** 状态提示副标题 */
	subTitle?: ReactNode;
	/** 快捷操作按钮文本（需配合 onButtonClick 使用） */
	buttonText?: string;
	/** 快捷按钮点击事件 */
	onButtonClick?: () => void;
	/** 自定义底部操作区（优先级高于 buttonText） */
	action?: ReactNode;
	/** 图标名，使用 Iconify 图标类名 */
	icon?: string;
	/** 自定义空状态图片/动图 URL（优先级高于全局注册的默认图片） */
	image?: string;
	className?: string;
	children?: ReactNode;
}

/**
 * Empty 空状态组件
 */
export function Empty({
	title = '空空如也',
	subTitle = '暂无数据，试试其他搜索关键词吧',
	buttonText,
	onButtonClick,
	action,
	icon = 'icon-[ph--mailbox-duotone]',
	image,
	className,
	children,
	...props
}: EmptyProps) {
	const [globalImg, setGlobalImg] = useState<string | undefined>(defaultEmptyImage);

	useEffect(() => {
		const handler = (url?: string) => setGlobalImg(url);
		listeners.add(handler);
		setGlobalImg(defaultEmptyImage);
		return () => {
			listeners.delete(handler);
		};
	}, []);

	const activeImage = image ?? globalImg;

	return (
		<View
			className={cn(
				'w-full py-12 flex flex-col gap-4 items-center justify-center animate-fade-in flex-1',
				className,
			)}
			{...props}
		>
			{/* 插图 / 图标 */}
			{activeImage ? (
				<Image src={activeImage} mode="aspectFit" className="size-28 rounded-xl" />
			) : (
				<View className="rounded-full bg-zinc-100 p-4 flex items-center justify-center">
					<View className={cn('size-10 text-zinc-400', icon)} />
				</View>
			)}

			{/* 标题与描述 */}
			<View className="flex flex-col items-center gap-1">
				{title && (
					<View className="text-base font-bold text-center">
						{typeof title === 'string' ? <Text>{title}</Text> : title}
					</View>
				)}
				{subTitle && (
					<View className="text-xs opacity-60 text-center px-6 leading-relaxed">
						{typeof subTitle === 'string' ? <Text>{subTitle}</Text> : subTitle}
					</View>
				)}
			</View>

			{/* 自定义扩展内容或底部按钮 */}
			{children}

			{action ? (
				<View className="mt-1 flex items-center justify-center gap-2">{action}</View>
			) : buttonText && onButtonClick ? (
				<View className="mt-1 flex items-center justify-center gap-2">
					<Button size="sm" variant="primary" rounded onClick={onButtonClick}>
						{buttonText}
					</Button>
				</View>
			) : null}
		</View>
	);
}
