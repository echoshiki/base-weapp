import { View, Text, Button as TaroButton, ButtonProps as TaroButtonProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export type NavIconVariant = 'primary' | 'success' | 'secondary' | 'warning' | 'danger' | 'info' | 'ghost' | 'none';

const VARIANT_MAP: Record<Exclude<NavIconVariant, 'none'>, string> = {
	primary: 'bg-primary/10 text-primary',
	success: 'bg-emerald-500/10 text-emerald-600',
	secondary: 'bg-zinc-500/10 text-zinc-600',
	warning: 'bg-amber-500/10 text-amber-600',
	danger: 'bg-rose-500/10 text-rose-600',
	info: 'bg-blue-500/10 text-blue-600',
	ghost: 'bg-transparent text-text-title',
};

export interface NavItemProps {
	/** 导航文字 */
	label: string;
	/** Iconify 图标类名 string 或 ReactNode */
	icon?: ReactNode;
	/** 图标变体风格 (支持 none 纯净/自定义模式) */
	variant?: NavIconVariant;
	/** 排版风格：'grid' (九宫格) | 'list' (列表条目)，默认 'grid' */
	layout?: 'grid' | 'list';
	/** 小程序原生按钮 openType (如 'contact' 微信客服、'share' 分享等) */
	openType?: TaroButtonProps['openType'];
	/** 列表形态下右侧扩展区域 */
	extra?: ReactNode;
	/** 列表形态下是否包含底部分隔线，默认 true */
	border?: boolean;
	/** 图标容器自定义类名 (可用于微调背景、尺寸、色值) */
	iconClassName?: string;
	className?: string;
	/** 点击回调 */
	onClick?: () => void;
}

/**
 * NavItem 统一导航项组件 (支持 grid 九宫格与 list 列表条目模式)
 */
export function NavItem({
	label,
	icon,
	variant = 'primary',
	layout = 'grid',
	openType,
	extra,
	border = true,
	iconClassName,
	className,
	onClick,
}: NavItemProps) {
	const isList = layout === 'list';
	const actualVariant = isList && variant === 'primary' ? 'ghost' : variant;
	const variantClass = actualVariant === 'none' ? '' : VARIANT_MAP[actualVariant] || VARIANT_MAP.primary;

	const renderIcon = (iconSizeClass: string) => {
		if (!icon) return null;
		if (typeof icon === 'string') {
			return <View className={cn(iconSizeClass, icon)} />;
		}
		return icon;
	};

	return (
		<TaroButton
			className={cn(
				'm-0 p-0 bg-transparent text-left after:border-0 leading-normal overflow-visible min-h-0 min-w-0 font-normal',
				isList
					? cn(
							'flex items-center gap-3 px-3 py-3.5 transition-colors active:bg-gray-50/80 w-full',
							border && 'border-b border-gray-100/80',
						)
					: 'flex flex-col items-center gap-1.5 active:scale-95 transition-transform',
				className,
			)}
			openType={openType}
			onClick={onClick}
		>
			{/* 图标区 */}
			{isList ? (
				<View className={cn('flex items-center justify-center shrink-0', variantClass, iconClassName)}>
					{renderIcon('size-5.5 text-current')}
				</View>
			) : (
				<View
					className={cn(
						'size-12 rounded-card flex items-center justify-center shrink-0',
						variantClass,
						iconClassName,
					)}
				>
					{renderIcon('size-6 text-current')}
				</View>
			)}

			{/* 标题区 */}
			<Text className={cn('text-text-title truncate', isList ? 'flex-1 text-sm' : 'text-xs')}>{label}</Text>

			{/* 列表模式右侧扩展区与箭头 */}
			{isList && (
				<View className="flex items-center gap-1 shrink-0">
					{extra && <View className="text-xs text-text-muted">{extra}</View>}
					<View className="icon-[ph--caret-right-thin] size-4 text-text-muted/70" />
				</View>
			)}
		</TaroButton>
	);
}
