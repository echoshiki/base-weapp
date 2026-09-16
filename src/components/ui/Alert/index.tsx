import { View, Text, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

/** 支持的提示变体 */
export type AlertVariant = 'default' | 'info' | 'warning' | 'success' | 'destructive' | 'error';

/** 变体样式与默认图标配置 */
const VARIANT_MAP: Record<
	AlertVariant,
	{ bgClass: string; borderClass: string; iconClass: string; textClass: string; defaultIcon: string }
> = {
	default: {
		bgClass: 'bg-gray-50/90',
		borderClass: 'border-gray-200/80',
		iconClass: 'text-gray-600',
		textClass: 'text-gray-900',
		defaultIcon: 'icon-[ph--bell-duotone]',
	},
	info: {
		bgClass: 'bg-blue-50/80',
		borderClass: 'border-blue-200/80',
		iconClass: 'text-blue-500',
		textClass: 'text-blue-900',
		defaultIcon: 'icon-[ph--info]',
	},
	warning: {
		bgClass: 'bg-amber-50/80',
		borderClass: 'border-amber-200/80',
		iconClass: 'text-amber-500',
		textClass: 'text-amber-900',
		defaultIcon: 'icon-[ph--warning-circle]',
	},
	success: {
		bgClass: 'bg-emerald-50/80',
		borderClass: 'border-emerald-200/80',
		iconClass: 'text-emerald-500',
		textClass: 'text-emerald-900',
		defaultIcon: 'icon-[ph--check-circle]',
	},
	destructive: {
		bgClass: 'bg-red-50/80',
		borderClass: 'border-red-200/80',
		iconClass: 'text-red-500',
		textClass: 'text-red-900',
		defaultIcon: 'icon-[ph--x-circle]',
	},
	error: {
		bgClass: 'bg-red-50/80',
		borderClass: 'border-red-200/80',
		iconClass: 'text-red-500',
		textClass: 'text-red-900',
		defaultIcon: 'icon-[ph--x-circle]',
	},
};

export interface AlertProps extends React.ComponentProps<typeof View> {
	/** 变体样式，默认为 default */
	variant?: AlertVariant;
	/** 是否隐藏默认图标，默认 false */
	hideIcon?: boolean;
	/** 自定义图标（支持 Iconify 类名 string 或 ReactNode） */
	icon?: ReactNode;
	/** 外层容器追加样式 */
	className?: string;
	children?: ReactNode;
}

/**
 * Alert 主容器组件
 */
export function Alert({ variant = 'default', hideIcon = false, icon, className, children, ...props }: AlertProps) {
	const config = VARIANT_MAP[variant] || VARIANT_MAP.default;

	const renderIcon = () => {
		if (hideIcon) return null;
		if (icon) {
			if (typeof icon === 'string') {
				return <View className={cn('size-4.5 shrink-0', config.iconClass, icon)} />;
			}
			return icon;
		}
		return <View className={cn('size-4.5 shrink-0', config.iconClass, config.defaultIcon)} />;
	};

	return (
		<View
			className={cn(
				'relative w-full rounded-card border p-3 flex items-start gap-2 transition-colors',
				config.bgClass,
				config.borderClass,
				config.textClass,
				className,
			)}
			{...props}
		>
			{renderIcon()}
			<View className="flex-1 min-w-0 flex flex-col justify-center text-xs leading-normal">
				{typeof children === 'string' ? <Text>{children}</Text> : children}
			</View>
		</View>
	);
}

/**
 * Alert 标题组件
 */
export function AlertTitle({ className, children, ...props }: React.ComponentProps<typeof View>) {
	return (
		<View
			className={cn('font-semibold text-sm leading-tight tracking-tight mb-1 text-inherit', className)}
			{...props}
		>
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}

/**
 * Alert 描述内容组件
 */
export function AlertDescription({ className, children, ...props }: React.ComponentProps<typeof View>) {
	return (
		<View className={cn('text-xs opacity-90 leading-relaxed text-inherit', className)} {...props}>
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}

/**
 * Alert 尾部/右侧操作区组件
 */
export function AlertAction({ className, children, ...props }: React.ComponentProps<typeof View>) {
	return (
		<View className={cn('ml-auto shrink-0 self-center pl-2', className)} {...props}>
			{children}
		</View>
	);
}
