import { View, Text, Input, InputProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export type SearchBarVariant = 'filled' | 'outline';

export interface SearchBarProps extends Omit<InputProps, 'onInput' | 'onConfirm' | 'className'> {
	/** 是否为只读模式 (只读时点击触发 onClick 回调，常用于首页搜索条跳转) */
	readonly?: boolean;
	value?: string;
	placeholder?: string;
	/** 变体样式：'filled' (浅灰填充，默认) | 'outline' (纯白+细边框) */
	variant?: SearchBarVariant;
	/** 是否为胶囊全圆角，默认 true */
	pill?: boolean;
	/** 右侧外置扩展槽位 (纯解耦 Slot，可自由传入 <Button>、<Text> 等自定义节点) */
	action?: ReactNode;
	/** 聚焦状态 */
	focus?: boolean;
	disabled?: boolean;
	/** 自定义前缀图标 */
	prefixIcon?: ReactNode;
	className?: string;
	onClick?: () => void;
	onInput?: (val: string) => void;
	onConfirm?: () => void;
	onClear?: () => void;
}

const VARIANT_MAP: Record<SearchBarVariant, string> = {
	filled: 'bg-gray-100/80 border-transparent',
	outline: 'bg-white border-gray-200/90 shadow-2xs',
};

/**
 * SearchBar 搜索栏组件 (shadcn 范式)
 */
export function SearchBar({
	readonly = false,
	value = '',
	placeholder = '想找点什么？',
	variant = 'filled',
	pill = true,
	action,
	focus = false,
	disabled = false,
	prefixIcon,
	className,
	onClick,
	onInput,
	onConfirm,
	onClear,
	...props
}: SearchBarProps) {
	const handleClear = (e: any) => {
		e.stopPropagation();
		onClear?.();
		onInput?.('');
	};

	return (
		<View className={cn('flex w-full items-center gap-2', className)}>
			{/* 搜索框输入区 */}
			<View
				className={cn(
					'flex-1 flex items-center h-10 px-3.5 transition-all border',
					pill ? 'rounded-full' : 'rounded-card',
					VARIANT_MAP[variant] || VARIANT_MAP.filled,
					readonly && 'active:opacity-80 cursor-pointer',
					disabled && 'opacity-50 pointer-events-none bg-gray-50'
				)}
				onClick={() => readonly && onClick?.()}
			>
				{/* 前缀图标 */}
				{prefixIcon || (
					<View className="icon-[ph--magnifying-glass-bold] size-4 text-text-muted shrink-0" />
				)}

				{readonly ? (
					<Text className="ml-2 text-sm text-text-muted/60 flex-1 truncate">{placeholder}</Text>
				) : (
					<View className="flex-1 flex items-center ml-2 min-w-0">
						<Input
							className="flex-1 h-full text-sm text-text-title"
							placeholder={placeholder}
							value={value}
							focus={focus}
							disabled={disabled}
							onInput={(e) => onInput?.(e.detail.value)}
							onConfirm={() => onConfirm?.()}
							{...props}
						/>
						{value && !disabled && (
							<View
								className="icon-[ph--x-circle-fill] size-4 text-gray-300 active:text-gray-500 ml-1.5 shrink-0 p-0.5 cursor-pointer"
								onClick={handleClear}
							/>
						)}
					</View>
				)}
			</View>

			{/* 右侧外置纯槽位 */}
			{action && !readonly && <View className="shrink-0">{action}</View>}
		</View>
	);
}
