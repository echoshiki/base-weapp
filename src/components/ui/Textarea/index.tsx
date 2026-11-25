import { View, Text, Textarea as TaroTextarea, TextareaProps as TaroTextareaProps } from '@tarojs/components';
import { cn } from '@/utils/common';

export type TextareaVariant = 'filled' | 'outlined' | 'ghost';

const VARIANT_MAP: Record<TextareaVariant, { base: string; normal: string; error: string }> = {
	filled: {
		base: 'p-3 rounded-card border',
		normal: 'border-zinc-200/80 bg-zinc-50/70',
		error: 'border-rose-400 bg-rose-50/30',
	},
	outlined: {
		base: 'p-3 rounded-card border bg-white',
		normal: 'border-zinc-200',
		error: 'border-rose-400',
	},
	ghost: {
		base: 'p-0 bg-transparent border-none',
		normal: '',
		error: '',
	},
};

export interface TextareaProps extends Omit<TaroTextareaProps, 'className'> {
	/** 视觉风格：filled (浅灰圆角框，默认) | outlined (白底描边) | ghost (无边框) */
	variant?: TextareaVariant;
	/** 便捷值变更回调 */
	onChange?: (value: string) => void;
	/** 是否在右下角显示字数统计，默认 false */
	showCount?: boolean;
	/** 是否处于错误校验态 */
	error?: boolean;
	/** 外层容器自定义类名 */
	className?: string;
	/** 内层原生 Textarea 自定义类名（可用于调整高度，默认 h-24） */
	textareaClassName?: string;
}

/**
 * Textarea 多行文本域组件
 * 支持 filled / outlined / ghost 视觉变体与右下角字数统计
 */
export function Textarea({
	variant = 'filled',
	value,
	maxlength = -1,
	onChange,
	onInput,
	showCount = false,
	error = false,
	disabled = false,
	autoHeight = false,
	placeholderClass = 'text-zinc-400',
	className,
	textareaClassName,
	...props
}: TextareaProps) {
	const currentLength = value ? String(value).length : 0;
	const variantConfig = VARIANT_MAP[variant] || VARIANT_MAP.filled;

	return (
		<View
			className={cn(
				'w-full flex flex-col gap-1.5 transition-colors',
				variantConfig.base,
				error ? variantConfig.error : variantConfig.normal,
				disabled && 'opacity-60 pointer-events-none',
				className,
			)}
		>
			<TaroTextarea
				value={value}
				maxlength={maxlength}
				disabled={disabled}
				autoHeight={autoHeight}
				placeholderClass={placeholderClass}
				className={cn(
					'w-full bg-transparent text-sm text-text-title leading-relaxed',
					!autoHeight && 'h-24',
					textareaClassName,
				)}
				onInput={(e) => {
					onInput?.(e);
					onChange?.(e.detail.value);
				}}
				{...props}
			/>

			{showCount && (
				<View className="flex justify-end">
					<Text className="text-xs text-zinc-400 font-mono">
						{maxlength > 0 ? `${currentLength} / ${maxlength}` : currentLength}
					</Text>
				</View>
			)}
		</View>
	);
}
