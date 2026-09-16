import { View, ViewProps, Text, Image, ImageProps } from '@tarojs/components';
import { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/utils/common';

export type CardLayout = 'vertical' | 'horizontal';

const CardContext = createContext<{ layout?: CardLayout }>({ layout: 'vertical' });

export interface CardProps extends ViewProps {
	/** 布局方向：vertical (纵向上下结构, 默认) 或 horizontal (横向图文结构) */
	layout?: CardLayout;
	/** 取消内部边距 (用于包含全宽图片的卡片) */
	noPadding?: boolean;
	/** 是否启用圆角，默认 true */
	rounded?: boolean;
	/** 是否启用点击按下反馈 */
	clickable?: boolean;
	className?: string;
	children?: ReactNode;
}

/**
 * Card 卡片容器组件 (核心根组件)
 */
export function Card({
	layout = 'vertical',
	noPadding = false,
	rounded = true,
	clickable = false,
	className,
	children,
	...props
}: CardProps) {
	return (
		<CardContext.Provider value={{ layout }}>
			<View
				className={cn(
					'bg-white overflow-hidden transition-all border border-gray-100/80 shadow-xs',
					layout === 'horizontal' ? 'flex items-start gap-3.5' : 'flex flex-col',
					rounded ? 'rounded-card' : 'rounded-none',
					noPadding ? 'p-0' : 'p-4',
					clickable && 'active:scale-[0.98] transition-transform',
					className,
				)}
				{...props}
			>
				{children}
			</View>
		</CardContext.Provider>
	);
}

export interface CardImageProps extends Omit<ImageProps, 'className'> {
	src: string;
	className?: string;
}

/**
 * CardImage 卡片专属封面图组件
 * 自动根据 Card layout 方向适配尺寸 (horizontal 下自动变为 80x80 方图，vertical 下为全宽图)
 */
export function CardImage({ src, mode = 'aspectFill', className, ...props }: CardImageProps) {
	const { layout } = useContext(CardContext);

	return (
		<Image
			src={src}
			mode={mode}
			className={cn(
				'bg-gray-100 shrink-0 overflow-hidden',
				layout === 'horizontal' ? 'size-24 rounded shadow-xs' : 'w-full h-40 rounded-t-card',
				className,
			)}
			{...props}
		/>
	);
}

/**
 * CardHeader 卡片头部区域
 */
export function CardHeader({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('flex flex-col gap-1 mb-1.5', className)} {...props}>
			{children}
		</View>
	);
}

/**
 * CardTitle 卡片标题组件
 */
export function CardTitle({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('font-bold text-base text-text-title leading-tight tracking-tight', className)} {...props}>
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}

/**
 * CardDescription 卡片描述副标题
 */
export function CardDescription({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('text-xs text-text-muted leading-relaxed', className)} {...props}>
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}

/**
 * CardContent 卡片主要内容区
 */
export function CardContent({ className, children, ...props }: ViewProps) {
	const { layout } = useContext(CardContext);

	return (
		<View
			className={cn(
				'text-sm text-text-body leading-normal',
				layout === 'horizontal' && 'flex-1 min-w-0 flex flex-col h-24 justify-between',
				className,
			)}
			{...props}
		>
			{children}
		</View>
	);
}

/**
 * CardFooter 卡片底部/操作区
 */
export function CardFooter({ className, children, ...props }: ViewProps) {
	const { layout } = useContext(CardContext);

	return (
		<View
			className={cn(
				'flex items-center justify-between text-xs text-text-muted',
				layout === 'horizontal' ? 'pt-0 mt-0 border-none' : 'pt-3 mt-3 border-t border-gray-100/80',
				className,
			)}
			{...props}
		>
			{children}
		</View>
	);
}
