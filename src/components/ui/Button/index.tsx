import { Button as TaroButton, ButtonProps as TaroButtonProps, View } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';
import { UiColor } from '../types';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariant = UiColor | 'none';

export type ButtonAppearance = 'solid' | 'soft' | 'outline' | 'ghost';

type ColorVariant = Exclude<ButtonVariant, 'none'>;

const SIZE_MAP: Record<ButtonSize, { button: string; icon: string }> = {
	xs: { button: 'h-7 px-3 text-xs gap-1', icon: 'size-3.5' },
	sm: { button: 'h-8 px-4 text-xs gap-1.5', icon: 'size-4' },
	md: { button: 'h-9.5 px-5 text-sm gap-2 font-medium', icon: 'size-4.5' },
	lg: { button: 'h-12 px-6 text-base gap-2 font-semibold', icon: 'size-5' },
	xl: { button: 'h-13 px-6 text-base gap-2 font-semibold', icon: 'size-5.5' },
};

const APPEARANCE_MAP: Record<ButtonAppearance, Record<ColorVariant, string>> = {
	solid: {
		primary: 'bg-primary text-white active:opacity-90',
		blue: 'bg-blue-500 text-white active:bg-blue-600',
		sky: 'bg-sky-500 text-white active:bg-sky-600',
		indigo: 'bg-indigo-500 text-white active:bg-indigo-600',
		emerald: 'bg-emerald-500 text-white active:bg-emerald-600',
		amber: 'bg-amber-500 text-white active:bg-amber-600',
		orange: 'bg-orange-500 text-white active:bg-orange-600',
		rose: 'bg-rose-500 text-white active:bg-rose-600',
		zinc: 'bg-zinc-100 text-zinc-700 active:bg-zinc-200',
	},
	soft: {
		primary: 'bg-primary/15 text-primary active:opacity-80',
		blue: 'bg-blue-500/15 text-blue-600 active:opacity-80',
		sky: 'bg-sky-500/15 text-sky-600 active:opacity-80',
		indigo: 'bg-indigo-500/15 text-indigo-600 active:opacity-80',
		emerald: 'bg-emerald-500/15 text-emerald-600 active:opacity-80',
		amber: 'bg-amber-500/15 text-amber-600 active:opacity-80',
		orange: 'bg-orange-500/15 text-orange-600 active:opacity-80',
		rose: 'bg-rose-500/15 text-rose-600 active:opacity-80',
		zinc: 'bg-zinc-100 text-zinc-700 active:bg-zinc-200',
	},
	outline: {
		primary: 'bg-transparent text-primary border border-primary/40 active:bg-primary/5',
		blue: 'bg-transparent text-blue-600 border border-blue-500/40 active:bg-blue-500/5',
		sky: 'bg-transparent text-sky-600 border border-sky-500/40 active:bg-sky-500/5',
		indigo: 'bg-transparent text-indigo-600 border border-indigo-500/40 active:bg-indigo-500/5',
		emerald: 'bg-transparent text-emerald-600 border border-emerald-500/40 active:bg-emerald-500/5',
		amber: 'bg-transparent text-amber-600 border border-amber-500/40 active:bg-amber-500/5',
		orange: 'bg-transparent text-orange-600 border border-orange-500/40 active:bg-orange-500/5',
		rose: 'bg-transparent text-rose-600 border border-rose-500/40 active:bg-rose-500/5',
		zinc: 'bg-transparent text-zinc-700 border border-zinc-300 active:bg-zinc-100',
	},
	ghost: {
		primary: 'bg-transparent text-primary active:bg-primary/10',
		blue: 'bg-transparent text-blue-600 active:bg-blue-500/10',
		sky: 'bg-transparent text-sky-600 active:bg-sky-500/10',
		indigo: 'bg-transparent text-indigo-600 active:bg-indigo-500/10',
		emerald: 'bg-transparent text-emerald-600 active:bg-emerald-500/10',
		amber: 'bg-transparent text-amber-600 active:bg-amber-500/10',
		orange: 'bg-transparent text-orange-600 active:bg-orange-500/10',
		rose: 'bg-transparent text-rose-600 active:bg-rose-500/10',
		zinc: 'bg-transparent text-zinc-600 active:bg-zinc-100',
	},
};

export interface ButtonProps extends Omit<TaroButtonProps, 'size' | 'type'> {
	size?: ButtonSize;
	variant?: ButtonVariant;
	/** 按钮外观形态：solid 实心（默认）| soft 浅底深字 | outline 描边 | ghost 幽灵透明 */
	appearance?: ButtonAppearance;
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
	appearance = 'solid',
	icon,
	rounded = true,
	block = false,
	loading = false,
	className,
	children,
	disabled,
	onClick,
	openType,
	...props
}: ButtonProps) {
	const isDisabled = Boolean(disabled || loading);
	const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
	const variantClass =
		variant === 'none' ? '' : APPEARANCE_MAP[appearance]?.[variant] || APPEARANCE_MAP.solid.primary;

	return (
		<TaroButton
			className={cn(
				'relative inline-flex items-center justify-center whitespace-nowrap transition-all overflow-hidden m-0 min-h-0 min-w-0 after:hidden after:border-none',
				block ? 'w-full' : 'w-fit',
				rounded ? 'rounded-full' : 'rounded-card',
				isDisabled ? 'opacity-50 grayscale pointer-events-none' : 'active:scale-[0.98]',
				sizeConfig.button,
				variantClass,
				className,
			)}
			aria-disabled={isDisabled}
			openType={isDisabled ? undefined : openType}
			onClick={(e) => {
				if (isDisabled) return;
				onClick?.(e);
			}}
			{...props}
		>
			{loading ? (
				<View className={cn('icon-[ph--spinner-gap-bold] animate-spin shrink-0', sizeConfig.icon)} />
			) : typeof icon === 'string' ? (
				<View className={cn('shrink-0', icon, sizeConfig.icon)} />
			) : (
				icon
			)}
			{children}
		</TaroButton>
	);
}
