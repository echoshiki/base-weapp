import { View, Text, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export type BadgeVariant =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'destructive'
	| 'danger'
	| 'info'
	| 'outline';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

const VARIANT_MAP: Record<BadgeVariant, { bgClass: string; textClass: string; dotClass: string }> = {
	default: {
		bgClass: 'bg-primary/10 border-primary/20',
		textClass: 'text-primary',
		dotClass: 'bg-primary',
	},
	primary: {
		bgClass: 'bg-primary/10 border-primary/20',
		textClass: 'text-primary',
		dotClass: 'bg-primary',
	},
	secondary: {
		bgClass: 'bg-gray-500/10 border-gray-200',
		textClass: 'text-gray-600',
		dotClass: 'bg-gray-400',
	},
	success: {
		bgClass: 'bg-emerald-500/10 border-emerald-200',
		textClass: 'text-emerald-600',
		dotClass: 'bg-emerald-500',
	},
	warning: {
		bgClass: 'bg-amber-500/10 border-amber-200',
		textClass: 'text-amber-600',
		dotClass: 'bg-amber-500',
	},
	destructive: {
		bgClass: 'bg-rose-500/10 border-rose-200',
		textClass: 'text-rose-600',
		dotClass: 'bg-rose-500',
	},
	danger: {
		bgClass: 'bg-rose-500/10 border-rose-200',
		textClass: 'text-rose-600',
		dotClass: 'bg-rose-500',
	},
	info: {
		bgClass: 'bg-blue-500/10 border-blue-200',
		textClass: 'text-blue-600',
		dotClass: 'bg-blue-500',
	},
	outline: {
		bgClass: 'bg-transparent border border-gray-300',
		textClass: 'text-text-body',
		dotClass: 'bg-gray-400',
	},
};

const SIZE_MAP: Record<BadgeSize, string> = {
	xs: 'text-[20rpx] px-1.5 py-0.5 gap-1',
	sm: 'text-xs px-2 py-0.5 gap-1',
	md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
	lg: 'text-sm px-3 py-1 gap-1.5 font-semibold',
};

export interface BadgeProps extends ViewProps {
	/** 视觉变体，默认 secondary */
	variant?: BadgeVariant;
	/** 尺寸，默认 sm */
	size?: BadgeSize;
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
	variant = 'secondary',
	size = 'sm',
	pill = false,
	dot = false,
	icon,
	className,
	onClick,
	...props
}: BadgeProps) {
	const config = VARIANT_MAP[variant] || VARIANT_MAP.secondary;

	const renderIcon = () => {
		if (dot) {
			return <View className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotClass)} />;
		}
		if (icon) {
			if (typeof icon === 'string') {
				return <View className={cn('w-3 h-3 shrink-0', icon)} />;
			}
			return icon;
		}
		return null;
	};

	return (
		<View
			onClick={onClick}
			className={cn(
				'inline-flex items-center justify-center tracking-wide border border-transparent transition-colors',
				pill ? 'rounded-full' : 'rounded-md',
				config.bgClass,
				config.textClass,
				SIZE_MAP[size],
				onClick && 'active:opacity-80',
				className
			)}
			{...props}
		>
			{renderIcon()}
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}
