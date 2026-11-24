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
	title?: string;
	/** 状态提示副标题 */
	subTitle?: string;
	/** 按钮文本 */
	buttonText?: string;
	/** 图标名，使用 Iconify 图标类名 */
	icon?: string;
	/** 自定义空状态图片/动图 URL（优先级高于全局注册的默认图片） */
	image?: string;
	/** 按钮点击事件 */
	onButtonClick?: () => void;
	className?: string;
	children?: ReactNode;
}

/**
 * Empty 空状态根组件
 */
export function Empty({
	title = '空空如也',
	subTitle = '暂无数据，试试其他搜索关键词吧',
	buttonText,
	icon = 'icon-[ph--mailbox-duotone]',
	image,
	onButtonClick,
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

	if (!children) {
		return (
			<View
				className={cn(
					'w-full py-12 flex flex-col gap-4 items-center justify-center animate-fade-in flex-1',
					className,
				)}
				{...props}
			>
				<EmptyIcon icon={icon} image={activeImage} />
				<View className="flex flex-col items-center gap-1">
					<EmptyTitle>{title}</EmptyTitle>
					{subTitle && <EmptyDescription>{subTitle}</EmptyDescription>}
				</View>
				{buttonText && onButtonClick && (
					<EmptyAction>
						<Button size="sm" variant="primary" rounded onClick={onButtonClick}>
							{buttonText}
						</Button>
					</EmptyAction>
				)}
			</View>
		);
	}

	return (
		<View
			className={cn('w-full py-12 flex flex-col gap-4 items-center justify-center animate-fade-in', className)}
			{...props}
		>
			{children}
		</View>
	);
}

/**
 * EmptyIcon 空状态图标/插图
 */
export function EmptyIcon({
	icon = 'icon-[ph--mailbox-duotone]',
	image,
	className,
	children,
}: {
	icon?: string;
	image?: string;
	className?: string;
	children?: ReactNode;
}) {
	if (image && !children) {
		return (
			<Image
				src={image}
				mode="aspectFit"
				className={cn('size-28 rounded-xl', className)}
			/>
		);
	}

	return (
		<View className={cn('rounded-full bg-zinc-100 p-4 flex items-center justify-center', className)}>
			{children ? children : <View className={cn('w-10 h-10 text-zinc-400', icon)} />}
		</View>
	);
}

/**
 * EmptyTitle 空状态主标题
 */
export function EmptyTitle({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('text-base font-bold text-text-title text-center', className)} {...props}>
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}

/**
 * EmptyDescription 空状态副标题/描述
 */
export function EmptyDescription({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('text-xs text-text-muted text-center px-6 leading-relaxed', className)} {...props}>
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}

/**
 * EmptyAction 空状态底部按钮/操作区
 */
export function EmptyAction({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('mt-2 flex items-center justify-center gap-2', className)} {...props}>
			{children}
		</View>
	);
}
