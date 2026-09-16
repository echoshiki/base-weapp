import { View, Text, ViewProps } from '@tarojs/components';
import { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/utils/common';

const DescriptionListContext = createContext<{ divider?: boolean }>({ divider: false });

export interface DescriptionListProps extends ViewProps {
	/** 是否在每一项之间加分隔线，默认 false */
	divider?: boolean;
	className?: string;
	children?: ReactNode;
}

/**
 * DescriptionList 描述列表容器组件
 */
export function DescriptionList({ divider = false, className, children, ...props }: DescriptionListProps) {
	return (
		<DescriptionListContext.Provider value={{ divider }}>
			<View
				className={cn('flex flex-col w-full', divider ? 'gap-0' : 'gap-2.5', className)}
				{...props}
			>
				{children}
			</View>
		</DescriptionListContext.Provider>
	);
}

export interface DescriptionProps extends ViewProps {
	/** 标签文字 */
	label: string;
	/** 内容（字符串、数字或 React 节点） */
	value: ReactNode;
	/** 对齐方式：between (两端分布, 默认) 或 start (紧贴左侧) */
	variant?: 'between' | 'start';
	/** 垂直对齐方式，默认 center */
	align?: 'start' | 'center' | 'end';
	valueTextClass?: string;
	labelTextClass?: string;
	labelWidth?: string;
	className?: string;
}

/**
 * Description 描述项单项组件 (左右排版描述，常用于订单/商品详情参数表)
 */
export function Description({
	label,
	value,
	variant = 'start',
	align = 'center',
	labelWidth = 'w-20',
	valueTextClass = 'text-text-title font-medium',
	labelTextClass = 'text-text-muted',
	className,
	...props
}: DescriptionProps) {
	const { divider } = useContext(DescriptionListContext);
	const isSimpleText = typeof value === 'string' || typeof value === 'number';

	const flexAlignClass = align === 'start' ? 'items-start' : align === 'end' ? 'items-end' : 'items-center';

	return (
		<View
			className={cn(
				'text-xs flex w-full gap-2',
				divider && 'py-2.5 border-b border-gray-100/80 last:border-b-0 last:pb-0 first:pt-0',
				variant === 'between' ? 'justify-between' : 'justify-start',
				flexAlignClass,
				className
			)}
			{...props}
		>
			<Text className={cn('shrink-0 text-inherit', labelTextClass, variant === 'start' && labelWidth)}>
				{label}
			</Text>

			{isSimpleText ? (
				<Text
					className={cn(
						'flex-1 leading-relaxed text-inherit',
						variant === 'between' ? 'text-right' : 'text-left',
						valueTextClass
					)}
				>
					{value}
				</Text>
			) : (
				<View className={cn('flex-1', variant === 'between' ? 'text-right flex justify-end' : 'text-left')}>
					{value}
				</View>
			)}
		</View>
	);
}

/** 别名导出 */
export const DescriptionItem = Description;
