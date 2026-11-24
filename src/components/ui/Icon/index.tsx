import { View, Image, ViewProps } from '@tarojs/components';
import { cn } from '@/utils/common';
import { UiColor } from '../types';

const isImgPath = (path: string) =>
	path.startsWith('http') || path.startsWith('https') || path.startsWith('/') || path.startsWith('data:');

const ICON_THEMES: Record<UiColor, { box: string; text: string }> = {
	primary: { box: 'bg-primary/10 text-primary', text: 'text-primary' },
	blue: { box: 'bg-blue-50 text-blue-600', text: 'text-blue-600' },
	sky: { box: 'bg-sky-50 text-sky-600', text: 'text-sky-600' },
	indigo: { box: 'bg-indigo-50 text-indigo-600', text: 'text-indigo-600' },
	emerald: { box: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-600' },
	amber: { box: 'bg-amber-50 text-amber-600', text: 'text-amber-600' },
	orange: { box: 'bg-orange-50 text-orange-600', text: 'text-orange-600' },
	rose: { box: 'bg-rose-50 text-rose-600', text: 'text-rose-600' },
	zinc: { box: 'bg-zinc-100 text-zinc-700', text: 'text-zinc-700' },
};

const ICON_SIZES = {
	sm: { container: 'size-7', radius: 'rounded-lg', icon: 'size-4' },
	md: { container: 'size-10', radius: 'rounded-xl', icon: 'size-5' },
	lg: { container: 'size-14', radius: 'rounded-2xl', icon: 'size-7' },
} as const;

export type IconSize = keyof typeof ICON_SIZES | number;
export type IconTheme = UiColor;

export interface IconProps extends Omit<ViewProps, 'className'> {
	/** 图标类名（Iconify）或图片路径 */
	icon: string;
	/** 容器形状：none(纯图标) | circle(圆形底) | square(圆角矩形底) */
	shape?: 'none' | 'circle' | 'square';
	/** 尺寸：支持语义档位 'sm' | 'md' | 'lg' 或具体像素数值（如 40） */
	size?: IconSize;
	/** 预设颜色主题（shape='none' 时仅在显式传入时应用文字色） */
	theme?: IconTheme;
	/** 外层容器自定义类名 */
	className?: string;
	/** 内层图标/图片自定义类名（仅 shape !== 'none' 时生效） */
	iconClassName?: string;
}

/**
 * Icon 通用图标与带底块图标容器组件
 */
export function Icon({
	icon,
	shape = 'none',
	size = 'md',
	theme,
	className,
	iconClassName,
	style,
	...props
}: IconProps) {
	const isImage = isImgPath(icon);
	const isNumericSize = typeof size === 'number';
	const presetSize = isNumericSize ? ICON_SIZES.md : ICON_SIZES[size] || ICON_SIZES.md;
	const activeTheme = theme ? ICON_THEMES[theme] : undefined;

	// 纯图标模式
	if (shape === 'none') {
		const sizeStyle = isNumericSize ? { width: `${size}px`, height: `${size}px` } : undefined;
		const sizeClass = isNumericSize ? '' : presetSize.icon;

		return isImage ? (
			<Image src={icon} mode="aspectFit" style={sizeStyle} className={cn('shrink-0', sizeClass, className)} />
		) : (
			<View
				style={sizeStyle}
				className={cn('shrink-0', icon, sizeClass, activeTheme?.text, className)}
				{...props}
			/>
		);
	}

	// 框型衬底复合模式
	const containerStyle = isNumericSize ? { width: `${size}px`, height: `${size}px` } : undefined;
	const innerPx = isNumericSize ? Math.round(size * 0.52) : undefined;
	const innerStyle = innerPx ? { width: `${innerPx}px`, height: `${innerPx}px` } : undefined;
	const shapeClass = shape === 'circle' ? 'rounded-full' : presetSize.radius;
	const boxThemeClass = (activeTheme || ICON_THEMES.primary).box;

	return (
		<View
			style={containerStyle}
			className={cn(
				'flex justify-center items-center shrink-0 transition-transform',
				!isNumericSize && presetSize.container,
				shapeClass,
				boxThemeClass,
				className,
			)}
			{...props}
		>
			{isImage ? (
				<Image
					src={icon}
					mode="aspectFit"
					style={innerStyle}
					className={cn(!isNumericSize && presetSize.icon, iconClassName)}
				/>
			) : (
				<View style={innerStyle} className={cn(icon, !isNumericSize && presetSize.icon, iconClassName)} />
			)}
		</View>
	);
}
