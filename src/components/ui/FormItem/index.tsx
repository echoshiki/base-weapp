import { View, Text, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export interface FormItemProps extends ViewProps {
	/** 标签内容（支持纯文本或自定义 ReactNode） */
	label?: ReactNode;
	/** 表单控件内容 */
	children?: ReactNode;
	/** 是否显示底部分隔线（默认 row 布局开启、column 布局关闭） */
	border?: boolean;
	/** 底部或标题旁辅助说明文字 */
	helper?: ReactNode;
	/** 错误校验提示信息（优先级高于 helper） */
	error?: ReactNode;
	/** 是否必填（展示红星） */
	required?: boolean;
	/** 布局方式：row (左右排版, 默认) | column (上下排版) */
	layout?: 'row' | 'column';
	className?: string;
}

/**
 * FormItem 表单项容器组件
 * 专注于字段标签、必填标识、辅助/错误提示与控件排版，不包含输入框自身视觉样式
 */
export function FormItem({
	label,
	children,
	border,
	onClick,
	helper,
	error,
	required = false,
	layout = 'row',
	className,
	...props
}: FormItemProps) {
	const isColumn = layout === 'column';
	const showBorder = border ?? !isColumn;

	const renderLabel = () => {
		if (label === undefined || label === null) return null;
		return (
			<View className="flex items-center gap-1 shrink-0 mr-4 text-sm font-medium">
				{typeof label === 'string' || typeof label === 'number' ? <Text>{label}</Text> : label}
				{required && <Text className="text-rose-500 mt-0.5">*</Text>}
			</View>
		);
	};

	const renderHelper = (extraClass?: string) => {
		if (!helper) return null;
		return (
			<View className={cn('mt-1 text-xs text-zinc-500 leading-normal', extraClass)}>
				{typeof helper === 'string' || typeof helper === 'number' ? <Text>{helper}</Text> : helper}
			</View>
		);
	};

	const renderError = () => {
		if (!error) return null;
		return (
			<View className="mt-1.5 text-xs text-rose-500 font-medium leading-normal flex items-center gap-1">
				<View className="icon-[ph--warning-circle-fill] size-3.5 shrink-0" />
				{typeof error === 'string' || typeof error === 'number' ? <Text>{error}</Text> : error}
			</View>
		);
	};

	return (
		<View
			className={cn(
				'flex flex-col justify-center min-h-12 py-2.5',
				showBorder && 'border-b border-zinc-100/80',
				className,
			)}
			onClick={onClick}
			{...props}
		>
			<View
				className={cn('flex w-full', isColumn ? 'flex-col gap-2.5' : 'flex-row justify-between items-center')}
			>
				{isColumn
					? (label !== undefined || (!error && helper)) && (
							<View className="flex items-center justify-between gap-2 w-full">
								{renderLabel()}
								{!error && renderHelper('mt-0 shrink-0')}
							</View>
						)
					: renderLabel()}

				<View className={cn('flex-1 min-w-0', !isColumn && 'text-right flex justify-end')}>{children}</View>
			</View>

			{error ? renderError() : !isColumn ? renderHelper() : null}
		</View>
	);
}
