import { View } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export interface DividerProps {
	/** 分割线方向 */
	orientation?: 'horizontal' | 'vertical';
	/** 是否为虚线 */
	dashed?: boolean;
	/** 分割线中间的文本或节点 (仅水平方向生效) */
	children?: ReactNode;
	/** 自定义外层类名 (常用于控制外边距，如 my-2, mx-3) */
	className?: string;
}

/**
 * 分割线组件
 * 支持水平、垂直方向，可设置是否为虚线，可设置中间的文本或节点
 */
export const Divider = ({ orientation = 'horizontal', dashed = false, children, className }: DividerProps) => {
	if (orientation === 'vertical') {
		return (
			<View
				className={cn(
					'inline-block w-px min-h-[1em] mx-2 align-middle self-center shrink-0',
					dashed ? 'border-l border-dashed border-gray-200 bg-transparent' : 'bg-gray-200',
					className,
				)}
			/>
		);
	}

	if (!children) {
		return (
			<View
				className={cn(
					'w-full h-px',
					dashed ? 'border-t border-dashed border-gray-200 bg-transparent' : 'bg-gray-200',
					className || 'my-3',
				)}
			/>
		);
	}

	const lineClasses = cn(
		'flex-1 h-[1px]',
		dashed ? 'border-t border-dashed border-gray-200 bg-transparent' : 'bg-gray-200',
	);

	return (
		<View className={cn('flex items-center w-full', className || 'my-4')}>
			<View className={lineClasses} />
			<View className="px-4 text-xs text-text-muted font-sans shrink-0">{children}</View>
			<View className={lineClasses} />
		</View>
	);
};
