import { Button as TaroButton, ButtonProps as TaroButtonProps, View } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariant =
	| 'primary'
	| 'success'
	| 'secondary'
	| 'warning'
	| 'destructive'
	| 'info'
	| 'outline'
	| 'ghost'
	| 'none';

const SIZE_MAP: Record<ButtonSize, { button: string; icon: string }> = {
	xs: { button: 'h-7 px-3 text-xs gap-1', icon: 'size-3.5' },
	sm: { button: 'h-8 px-4 text-xs gap-1.5', icon: 'size-4' },
	md: { button: 'h-9.5 px-5 text-sm gap-2 font-medium', icon: 'size-4.5' },
	lg: { button: 'h-12 px-6 text-base gap-2 font-semibold', icon: 'size-5' },
	xl: { button: 'h-13 w-full text-base gap-2 font-semibold', icon: 'size-5.5' },
};

const VARIANT_MAP: Record<Exclude<ButtonVariant, 'none'>, string> = {
	primary: 'bg-primary text-white active:opacity-90',
	success: 'bg-emerald-500 text-white active:bg-emerald-600',
	secondary: 'bg-gray-100 text-text-body active:bg-gray-200',
	destructive: 'bg-rose-500 text-white active:bg-rose-600',
	warning: 'bg-amber-500 text-white active:bg-amber-600',
	info: 'bg-blue-500 text-white active:bg-blue-600',
	outline: 'bg-transparent text-primary border border-primary/40 active:bg-primary/5',
	ghost: 'bg-transparent text-text-muted active:bg-gray-100',
};

export interface ButtonProps extends Omit<TaroButtonProps, 'size' | 'type'> {
	size?: ButtonSize;
	variant?: ButtonVariant;
	/** 左侧图标 (Iconify 类名 string 或 ReactNode) */
	icon?: ReactNode;
	rounded?: boolean;
	block?: boolean;
	loading?: boolean;
	className?: string;
	children?: ReactNode;
}

/**
 * Button 按钮组件 (shadcn 范式)
 */
export function Button({
	size = 'md',
	variant = 'primary',
	icon,
	rounded = true,
	block = false,
	loading = false,
	className,
	children,
	disabled,
	...props
}: ButtonProps) {
	const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
	const variantClass = variant === 'none' ? '' : VARIANT_MAP[variant] || VARIANT_MAP.primary;

	const renderIcon = () => {
		if (loading) {
			return <View className={cn('icon-[ph--spinner-gap-bold] animate-spin shrink-0', sizeConfig.icon)} />;
		}
		if (icon) {
			if (typeof icon === 'string') {
				return <View className={cn('shrink-0', icon, sizeConfig.icon)} />;
			}
			return icon;
		}
		return null;
	};

	return (
		<TaroButton
			className={cn(
				'relative inline-flex items-center justify-center transition-all overflow-hidden m-0 min-h-0 min-w-0 after:hidden after:border-none',
				block ? 'w-full' : 'w-fit',
				rounded ? 'rounded-full' : 'rounded-card',
				disabled || loading ? 'opacity-50 grayscale pointer-events-none' : 'active:scale-[0.98]',
				sizeConfig.button,
				variantClass,
				className,
			)}
			disabled={disabled || loading}
			{...props}
		>
			{renderIcon()}
			{children}
		</TaroButton>
	);
}
