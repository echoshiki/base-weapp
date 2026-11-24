import { View, Text, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';
import { UiColor } from '../types';

const VARIANT_MAP: Record<UiColor, { base: string; dot: string }> = {
	primary: { base: 'bg-primary/10 border-primary/20 text-primary', dot: 'bg-primary' },
	blue: { base: 'bg-blue-600/10 border-blue-200 text-blue-600', dot: 'bg-blue-500' },
	sky: { base: 'bg-sky-600/10 border-sky-200 text-sky-600', dot: 'bg-sky-500' },
	indigo: { base: 'bg-indigo-600/10 border-indigo-200 text-indigo-600', dot: 'bg-indigo-500' },
	emerald: { base: 'bg-emerald-600/10 border-emerald-200 text-emerald-600', dot: 'bg-emerald-500' },
	amber: { base: 'bg-amber-600/10 border-amber-200 text-amber-600', dot: 'bg-amber-500' },
	orange: { base: 'bg-orange-600/10 border-orange-200 text-orange-600', dot: 'bg-orange-500' },
	rose: { base: 'bg-rose-600/10 border-rose-200 text-rose-600', dot: 'bg-rose-500' },
	zinc: { base: 'bg-zinc-600/10 border-zinc-200 text-zinc-600', dot: 'bg-zinc-400' },
};

export interface BadgeProps extends ViewProps {
	/** 颜色主题，默认 zinc */
	variant?: UiColor;
	/** 是否为胶囊形状（全圆角），默认 false */
	pill?: boolean;
	/** 是否在文字左侧显示状态圆点 */
	dot?: boolean;
	/** 前缀图标 (Iconify 类名 string 或 ReactNode) */
	icon?: ReactNode;
	children?: ReactNode;
}

export function Badge({
	children,
	variant = 'zinc',
	pill = false,
	dot = false,
	icon,
	className,
	onClick,
	...props
}: BadgeProps) {
	const style = VARIANT_MAP[variant] ?? VARIANT_MAP.zinc;
	const isPrimitive = typeof children === 'string' || typeof children === 'number';

	return (
		<View
			onClick={onClick}
			className={cn(
				'inline-flex items-center justify-center gap-1 border px-2 py-0.5 text-xs transition-colors',
				pill ? 'rounded-full' : 'rounded-md',
				style.base,
				onClick && 'active:opacity-80',
				className,
			)}
			{...props}
		>
			{dot ? (
				<View className={cn('size-1.5 shrink-0 rounded-full', style.dot)} />
			) : typeof icon === 'string' ? (
				<View className={cn('size-3 shrink-0', icon)} />
			) : (
				icon
			)}

			{isPrimitive ? <Text>{children}</Text> : children}
		</View>
	);
}
