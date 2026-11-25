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
		bgClass: 'bg-zinc-50/90',
		borderClass: 'border-zinc-200/80',
		iconClass: 'text-zinc-600',
		textClass: 'text-zinc-900',
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

export interface AlertProps extends ViewProps {
	/** 变体样式，默认为 default */
	variant?: AlertVariant;
	/** 可选标题 */
	title?: ReactNode;
	/** 右侧扩展操作区（如按钮、跳转链接或关闭图标） */
	extra?: ReactNode;
	/** 是否隐藏默认图标，默认 false */
	hideIcon?: boolean;
	/** 自定义图标（支持 Iconify 类名 string 或 ReactNode） */
	icon?: ReactNode;
	/** 外层容器追加样式 */
	className?: string;
	children?: ReactNode;
}

/**
 * Alert 行内提示条组件
 */
export function Alert({
	variant = 'default',
	title,
	extra,
	hideIcon = false,
	icon,
	className,
	children,
	...props
}: AlertProps) {
	const config = VARIANT_MAP[variant] || VARIANT_MAP.default;

	const renderIcon = () => {
		if (hideIcon) return null;
		if (icon) {
			if (typeof icon === 'string') {
				return <View className={cn('size-4.5 shrink-0 mt-0.5', config.iconClass, icon)} />;
			}
			return icon;
		}
		return <View className={cn('size-4.5 shrink-0 mt-0.5', config.iconClass, config.defaultIcon)} />;
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

			<View className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
				{title && (
					<View className="font-semibold text-sm leading-tight tracking-tight text-inherit">
						{typeof title === 'string' ? <Text>{title}</Text> : title}
					</View>
				)}
				{children && (
					<View className="text-xs opacity-90 leading-relaxed text-inherit">
						{typeof children === 'string' ? <Text>{children}</Text> : children}
					</View>
				)}
			</View>

			{extra && <View className="shrink-0 self-center pl-1">{extra}</View>}
		</View>
	);
}
