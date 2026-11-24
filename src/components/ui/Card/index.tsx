import { View, ViewProps } from '@tarojs/components';
import { cn } from '@/utils/common';

export type CardLayout = 'vertical' | 'horizontal';

export interface CardProps extends ViewProps {
	/** 布局方向：vertical (纵向上下结构, 默认) 或 horizontal (横向图文结构) */
	layout?: CardLayout;
	/** 取消内部边距 (用于包含全宽图片的卡片) */
	noPadding?: boolean;
	/** 是否启用圆角，默认 true */
	rounded?: boolean;
	/** 是否启用点击按下反馈（传入 onClick 时默认开启） */
	clickable?: boolean;
}

/**
 * Card 卡片容器组件
 * 提供统一的卡片外观、圆角、阴影、内边距及纵向/横向布局能力
 */
export function Card({
	layout = 'vertical',
	noPadding = false,
	rounded = true,
	clickable,
	className,
	onClick,
	children,
	...props
}: CardProps) {
	const isClickable = clickable ?? Boolean(onClick);

	return (
		<View
			onClick={onClick}
			className={cn(
				'overflow-hidden border border-zinc-100/80 bg-white shadow-xs transition-all',
				layout === 'horizontal' ? 'flex items-stretch gap-3.5' : 'flex flex-col',
				rounded ? 'rounded-card' : 'rounded-none',
				noPadding ? 'p-0' : 'px-4 py-5',
				isClickable && 'active:scale-[0.98]',
				className,
			)}
			{...props}
		>
			{children}
		</View>
	);
}
