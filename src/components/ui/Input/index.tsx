import { View, Input as TaroInput, InputProps as TaroInputProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export type InputVariant = 'filled' | 'underline' | 'ghost';

const VARIANT_MAP: Record<InputVariant, { base: string; normal: string; error: string }> = {
	filled: {
		base: 'px-3.5 h-11 rounded-card border',
		normal: 'border-zinc-200/80 bg-zinc-50/70',
		error: 'border-rose-400 bg-rose-50/30',
	},
	underline: {
		base: 'px-0 h-10 border-b bg-transparent rounded-none',
		normal: 'border-zinc-200',
		error: 'border-rose-400',
	},
	ghost: {
		base: 'px-0 h-9 bg-transparent border-none',
		normal: '',
		error: '',
	},
};

export interface InputProps extends Omit<TaroInputProps, 'className'> {
	/** 视觉风格：filled (浅灰圆角框，默认) | underline (底部下划线) | ghost (无边框行内) */
	variant?: InputVariant;
	/** 便捷值变更回调 */
	onChange?: (value: string) => void;
	/** 左侧前缀（支持 Iconify 类名 string 或 ReactNode） */
	prefix?: ReactNode;
	/** 右侧后缀槽位（支持图标、单位、按钮等） */
	suffix?: ReactNode;
	/** 是否显示一键清空按钮，默认 false */
	clearable?: boolean;
	/** 清空回调 */
	onClear?: () => void;
	/** 是否处于错误校验态 */
	error?: boolean;
	/** 外层容器自定义类名 */
	className?: string;
	/** 内层原生 Input 自定义类名（如 text-right） */
	inputClassName?: string;
}

/**
 * Input 单行输入框组件
 * 支持 filled / underline / ghost 三种视觉变体，内置前后缀插槽与一键清空能力
 */
export function Input({
	variant = 'filled',
	value,
	onChange,
	onInput,
	prefix,
	suffix,
	clearable = false,
	onClear,
	error = false,
	disabled = false,
	placeholderClass = 'text-zinc-400',
	className,
	inputClassName,
	...props
}: InputProps) {
	const hasValue = value !== undefined && value !== null && String(value).length > 0;

	const renderPrefix = () => {
		if (!prefix) return null;
		if (typeof prefix === 'string') {
			return <View className={cn('size-4.5 text-zinc-400 shrink-0', prefix)} />;
		}
		return <View className="shrink-0 flex items-center">{prefix}</View>;
	};

	const handleClear = (e: any) => {
		e.stopPropagation();
		onClear?.();
		onChange?.('');
	};

	const variantConfig = VARIANT_MAP[variant] || VARIANT_MAP.filled;

	return (
		<View
			className={cn(
				'flex w-full items-center gap-2 transition-colors',
				variantConfig.base,
				error ? variantConfig.error : variantConfig.normal,
				disabled && 'opacity-60 pointer-events-none',
				className,
			)}
		>
			{renderPrefix()}

			<TaroInput
				value={value}
				disabled={disabled}
				placeholderClass={placeholderClass}
				className={cn(
					'flex-1 min-w-0 h-full flex items-center bg-transparent text-sm text-text-title',
					inputClassName,
				)}
				onInput={(e) => {
					onInput?.(e);
					onChange?.(e.detail.value);
				}}
				{...props}
			/>

			{clearable && hasValue && !disabled && (
				<View
					className="icon-[ph--x-circle-fill] size-4 text-zinc-300 active:text-zinc-500 shrink-0 cursor-pointer"
					onClick={handleClear}
				/>
			)}

			{suffix && <View className="shrink-0 flex items-center">{suffix}</View>}
		</View>
	);
}
