import { View, Text, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export interface FormItemProps extends ViewProps {
	/** 左侧标签文字 (简易模式使用) */
	label?: string;
	/** 右侧表单内容 */
	children?: ReactNode;
	/** 是否显示底部边框，默认 true */
	border?: boolean;
	/** 点击事件 */
	onClick?: () => void;
	/** 底部辅助说明文字 */
	helper?: string | ReactNode;
	/** 错误校验提示信息 */
	error?: string | ReactNode;
	/** 是否必填（展示红星） */
	required?: boolean;
	/** 布局方式，默认为 row */
	layout?: 'row' | 'column';
	className?: string;
}

/**
 * FormItem 表单项根组件
 */
export function FormItem({
	label,
	children,
	border = true,
	onClick,
	helper,
	error,
	required = false,
	layout = 'row',
	className,
	...props
}: FormItemProps) {
	const isColumn = layout === 'column';

	// 简易模式 (直接传 label)
	if (label !== undefined) {
		return (
			<View
				className={cn(
					'flex flex-col justify-center min-h-12 py-2.5',
					border && 'border-b border-gray-100/80',
					className,
				)}
				onClick={onClick}
				{...props}
			>
				<View
					className={cn('flex w-full', isColumn ? 'flex-col gap-2' : 'flex-row justify-between items-center')}
				>
					<FormLabel required={required}>{label}</FormLabel>
					<FormControl className={cn(!isColumn && 'text-right flex justify-end')}>{children}</FormControl>
				</View>

				{error ? (
					<FormMessage>{error}</FormMessage>
				) : helper ? (
					<FormDescription>{helper}</FormDescription>
				) : null}
			</View>
		);
	}

	// 复合模式
	return (
		<View
			className={cn(
				'flex flex-col justify-center min-h-12 py-2.5 gap-2',
				border && 'border-b border-gray-100/80',
				className,
			)}
			onClick={onClick}
			{...props}
		>
			{children}
		</View>
	);
}

export interface FormLabelProps extends ViewProps {
	required?: boolean;
	className?: string;
	children?: ReactNode;
}

/**
 * FormLabel - 表单标签
 */
export function FormLabel({ required = false, className, children, ...props }: FormLabelProps) {
	return (
		<View
			className={cn('flex items-center shrink-0 mr-4 text-sm text-text-title font-medium', className)}
			{...props}
		>
			{required && <Text className="text-red-500 mr-1 mt-0.5 font-bold">*</Text>}
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}

/**
 * FormControl - 表单输入控件包裹层
 */
export function FormControl({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('flex-1 min-w-0', className)} {...props}>
			{children}
		</View>
	);
}

/**
 * FormDescription - 辅助说明文案
 */
export function FormDescription({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('mt-1 text-xs text-text-muted leading-normal', className)} {...props}>
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}

/**
 * FormMessage - 表单校验错误提示 (红色醒目文本)
 */
export function FormMessage({ className, children, ...props }: ViewProps) {
	if (!children) return null;

	return (
		<View
			className={cn('mt-1 text-xs text-rose-500 font-medium leading-normal flex items-center gap-1', className)}
			{...props}
		>
			<View className="icon-[ph--warning-circle-fill] size-3.5 shrink-0" />
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}
