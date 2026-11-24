import { View, Text, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';
import { UiColor } from '../types';

export type BadgeVariant = UiColor;

const VARIANT_MAP: Record<BadgeVariant, { bgClass: string; textClass: string; dotClass: string }> = {
	primary: {
		bgClass: 'bg-primary/10 border-primary/20',
		textClass: 'text-primary',
		dotClass: 'bg-primary',
	},
	blue: {
		bgClass: 'bg-blue-600/10 border-blue-200',
		textClass: 'text-blue-600',
		dotClass: 'bg-blue-500',
	},
	sky: {
		bgClass: 'bg-sky-600/10 border-sky-200',
		textClass: 'text-sky-600',
		dotClass: 'bg-sky-500',
	},
	indigo: {
		bgClass: 'bg-indigo-600/10 border-indigo-200',
		textClass: 'text-indigo-600',
		dotClass: 'bg-indigo-500',
	},
	emerald: {
		bgClass: 'bg-emerald-600/10 border-emerald-200',
		textClass: 'text-emerald-600',
		dotClass: 'bg-emerald-500',
	},
	amber: {
		bgClass: 'bg-amber-600/10 border-amber-200',
		textClass: 'text-amber-600',
		dotClass: 'bg-amber-500',
	},
	orange: {
		bgClass: 'bg-orange-600/10 border-orange-200',
		textClass: 'text-orange-600',
		dotClass: 'bg-orange-500',
	},
	rose: {
		bgClass: 'bg-rose-600/10 border-rose-200',
		textClass: 'text-rose-600',
		dotClass: 'bg-rose-500',
	},
	slate: {
		bgClass: 'bg-slate-600/10 border-slate-200',
		textClass: 'text-slate-600',
		dotClass: 'bg-slate-400',
	},
};

export interface BadgeProps extends ViewProps {
	/** 颜色主题，默认 slate */
	variant?: BadgeVariant;
	/** 是否为胶囊形状（全圆角），默认 false */
	pill?: boolean;
	/** 是否在文字左侧显示状态圆点 */
	dot?: boolean;
	/** 前缀图标 (Iconify 类名 string 或 ReactNode) */
	icon?: ReactNode;
	className?: string;
	children?: ReactNode;
}

/**
 * Badge 徽章/标签组件
 */
export function Badge({
	children,
	variant = 'slate',
	pill = false,
	dot = false,
	icon,
	className,
	onClick,
	...props
}: BadgeProps) {
	const config = VARIANT_MAP[variant] || VARIANT_MAP.slate;

	const renderIcon = () => {
		if (dot) {
			return <View className={cn('size-1.5 rounded-full shrink-0', config.dotClass)} />;
		}
		if (icon) {
			if (typeof icon === 'string') {
				return <View className={cn('size-3 shrink-0', icon)} />;
			}
			return icon;
		}
		return null;
	};

	return (
		<View
			onClick={onClick}
			className={cn(
				'flex items-center justify-center border border-transparent transition-colors gap-1 text-xs px-2 py-0.5 ring-1 ring-inset',
				pill ? 'rounded-full' : 'rounded-md',
				config.bgClass,
				config.textClass,
				onClick && 'active:opacity-80',
				className,
			)}
			{...props}
		>
			{renderIcon()}
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}
