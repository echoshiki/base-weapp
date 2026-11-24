import { ReactNode } from 'react';
import { View, Text, ViewProps } from '@tarojs/components';
import { mapsTo, cn } from '@/utils/common';
import { UiColor } from '../types';

export type ActionTileTheme = UiColor;
export type ActionTileLayout = 'square' | 'compact';
export type ActionTileTone = 'light' | 'dark';

interface ThemePalette {
	darkBg: string;
	lightBg: string;
	lightIconWrap: string;
	lightIconColor: string;
	lightUnitColor: string;
}

const THEME_MAP: Record<ActionTileTheme, ThemePalette> = {
	primary: {
		darkBg: 'bg-linear-to-br from-primary via-blue-600 to-indigo-700 shadow-md shadow-blue-500/20',
		lightBg: 'bg-linear-to-br from-white via-blue-50/90 to-blue-100/90 border border-slate-100 shadow-xs',
		lightIconWrap: 'bg-primary/10',
		lightIconColor: 'text-primary',
		lightUnitColor: 'text-primary',
	},
	blue: {
		darkBg: 'bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-md shadow-blue-500/20',
		lightBg: 'bg-linear-to-br from-white via-sky-50/90 to-sky-100/90 border border-slate-100 shadow-xs',
		lightIconWrap: 'bg-blue-100',
		lightIconColor: 'text-blue-600',
		lightUnitColor: 'text-blue-500',
	},
	sky: {
		darkBg: 'bg-linear-to-br from-sky-400 via-sky-500 to-blue-600 shadow-md shadow-sky-500/20',
		lightBg: 'bg-linear-to-br from-white via-sky-50/90 to-sky-100/90 border border-slate-100 shadow-xs',
		lightIconWrap: 'bg-sky-100',
		lightIconColor: 'text-sky-600',
		lightUnitColor: 'text-sky-500',
	},
	indigo: {
		darkBg: 'bg-linear-to-br from-indigo-500 via-indigo-600 to-purple-700 shadow-md shadow-indigo-500/20',
		lightBg: 'bg-linear-to-br from-white via-indigo-50/90 to-indigo-100/90 border border-slate-100 shadow-xs',
		lightIconWrap: 'bg-indigo-100',
		lightIconColor: 'text-indigo-600',
		lightUnitColor: 'text-indigo-500',
	},
	emerald: {
		darkBg: 'bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700 shadow-md shadow-emerald-500/20',
		lightBg: 'bg-linear-to-br from-white via-emerald-50/90 to-emerald-100/90 border border-slate-100 shadow-xs',
		lightIconWrap: 'bg-emerald-100',
		lightIconColor: 'text-emerald-600',
		lightUnitColor: 'text-emerald-600',
	},
	amber: {
		darkBg: 'bg-linear-to-br from-amber-400 via-amber-500 to-orange-600 shadow-md shadow-amber-500/20',
		lightBg: 'bg-linear-to-br from-white via-amber-50/90 to-amber-100/90 border border-slate-100 shadow-xs',
		lightIconWrap: 'bg-amber-100',
		lightIconColor: 'text-amber-600',
		lightUnitColor: 'text-amber-600',
	},
	orange: {
		darkBg: 'bg-linear-to-br from-orange-400 via-orange-500 to-amber-600 shadow-md shadow-orange-500/20',
		lightBg: 'bg-linear-to-br from-white via-orange-50/90 to-orange-100/90 border border-slate-100 shadow-xs',
		lightIconWrap: 'bg-orange-100',
		lightIconColor: 'text-orange-500',
		lightUnitColor: 'text-orange-500',
	},
	rose: {
		darkBg: 'bg-linear-to-br from-rose-500 via-rose-600 to-pink-700 shadow-md shadow-rose-500/20',
		lightBg: 'bg-linear-to-br from-white via-rose-50/90 to-rose-100/90 border border-slate-100 shadow-xs',
		lightIconWrap: 'bg-rose-100',
		lightIconColor: 'text-rose-500',
		lightUnitColor: 'text-rose-500',
	},
	slate: {
		darkBg: 'bg-linear-to-br from-slate-600 via-slate-700 to-slate-800 shadow-md shadow-slate-500/20',
		lightBg: 'bg-linear-to-br from-white via-slate-50/90 to-slate-100/90 border border-slate-200/80 shadow-xs',
		lightIconWrap: 'bg-slate-200/80',
		lightIconColor: 'text-slate-600',
		lightUnitColor: 'text-slate-600',
	},
};

export interface ActionTileProps extends Omit<ViewProps, 'onClick'> {
	/** 磁贴形态：square 方形主卡（默认）| compact 长方形统计/入口卡 */
	layout?: ActionTileLayout;
	/** 色彩风格：dark 深色渐变 | light 浅色渐变（square 默认 dark，compact 默认 light） */
	tone?: ActionTileTone;
	/** 主题色调 */
	theme?: ActionTileTheme;
	/** 主标题 */
	title: string;
	/** 副标题（square 底部说明，或 compact 无 value 时的辅助文案） */
	subTitle?: string;
	/** 数值（常用于 compact 展示统计数） */
	value?: string | number;
	/** 数值旁单位或增量角标，如 '条'、'+2' */
	unit?: string;
	/** 图标：传 Iconify 类名，或直接传自定义节点（如 3D 透明 PNG <Image />） */
	icon: string | ReactNode;
	/** 快捷跳转路径（未传 onClick 时生效） */
	url?: string;
	/** 点击回调（优先于 url） */
	onClick?: () => void;
	/** 是否禁用 */
	disabled?: boolean;
	className?: string;
}

/**
 * ActionTile 快捷功能磁贴组件
 * 支持 square / compact 双形态与 light / dark 双色调风格
 */
export function ActionTile({
	layout = 'square',
	tone,
	theme = 'blue',
	title,
	subTitle,
	value,
	unit,
	icon,
	url,
	onClick,
	disabled = false,
	className,
	...props
}: ActionTileProps) {
	const palette = THEME_MAP[theme] || THEME_MAP.blue;
	const activeTone: ActionTileTone = tone ?? (layout === 'square' ? 'dark' : 'light');
	const isDark = activeTone === 'dark';

	const handleClick = () => {
		if (disabled) return;
		if (onClick) {
			onClick();
		} else if (url) {
			mapsTo(url);
		}
	};

	if (layout === 'compact') {
		return (
			<View
				onClick={handleClick}
				className={cn(
					'relative flex-1 rounded-2xl overflow-hidden px-3.5 py-3 flex flex-col justify-between transition-transform',
					isDark ? palette.darkBg : palette.lightBg,
					disabled ? 'opacity-50 grayscale pointer-events-none' : 'active:scale-[0.98] cursor-pointer',
					className,
				)}
				{...props}
			>
				<Text
					className={cn(
						'text-sm font-medium relative z-10',
						isDark ? 'text-white/90' : 'text-slate-600',
					)}
				>
					{title}
				</Text>

				{value !== undefined ? (
					<View className="flex items-baseline gap-1 relative z-10">
						<Text className={cn('text-xl font-bold font-mono', isDark ? 'text-white' : 'text-slate-900')}>
							{value}
						</Text>
						{unit && (
							<Text
								className={cn(
									'text-xs font-medium',
									isDark ? 'text-white/80' : palette.lightUnitColor,
								)}
							>
								{unit}
							</Text>
						)}
					</View>
				) : subTitle ? (
					<Text className={cn('text-xs relative z-10 truncate', isDark ? 'text-white/75' : 'text-slate-400')}>
						{subTitle}
					</Text>
				) : null}

				{/* 右下角破框装饰图标 */}
				<View
					className={cn(
						'absolute -right-2 -bottom-2 size-15 rounded-2xl -rotate-12 flex items-center justify-center pointer-events-none',
						isDark ? 'bg-white/15' : palette.lightIconWrap,
					)}
				>
					{typeof icon === 'string' ? (
						<View className={cn(icon, 'size-8', isDark ? 'text-white/90' : palette.lightIconColor)} />
					) : (
						icon
					)}
				</View>
			</View>
		);
	}

	return (
		<View
			onClick={handleClick}
			className={cn(
				'relative flex-1 rounded-2xl overflow-hidden flex flex-col justify-between transition-transform',
				isDark ? palette.darkBg : palette.lightBg,
				disabled ? 'opacity-50 grayscale pointer-events-none' : 'active:scale-[0.98] cursor-pointer',
				className,
			)}
			{...props}
		>
			{/* 纯 CSS 抽象几何立体装饰块 */}
			<View
				className={cn(
					'absolute -right-4 -top-4 size-24 rounded-2xl rotate-12 pointer-events-none',
					isDark ? 'bg-white/10' : 'bg-slate-900/5',
				)}
			/>
			<View
				className={cn(
					'absolute right-6 top-6 size-14 rounded-xl -rotate-12 pointer-events-none',
					isDark ? 'bg-white/10' : 'bg-slate-900/5',
				)}
			/>

			{/* 左上角图标徽章 */}
			<View className="p-3.5 relative z-10">
				<View
					className={cn(
						'size-10 rounded-xl flex items-center justify-center shadow-xs',
						isDark
							? 'bg-white/25 backdrop-blur-xs border border-white/20'
							: palette.lightIconWrap,
					)}
				>
					{typeof icon === 'string' ? (
						<View className={cn(icon, 'size-5', isDark ? 'text-white' : palette.lightIconColor)} />
					) : (
						icon
					)}
				</View>
			</View>

			{/* 底部信息条 */}
			<View
				className={cn(
					'relative z-10 px-3.5 py-3 flex flex-col gap-0.5',
					isDark ? 'bg-white/15 backdrop-blur-xs' : 'bg-white/70 backdrop-blur-xs',
				)}
			>
				<Text className={cn('text-base font-bold leading-tight', isDark ? 'text-white' : 'text-slate-900')}>
					{title}
				</Text>
				{subTitle && (
					<Text className={cn('text-xs truncate', isDark ? 'text-white/80' : 'text-slate-500')}>
						{subTitle}
					</Text>
				)}
			</View>
		</View>
	);
}
