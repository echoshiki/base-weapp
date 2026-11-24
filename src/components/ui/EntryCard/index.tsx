import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Card } from '@/components/ui/Card';
import { UiColor } from '../types';

// 主题色映射表
const THEME_MAP: Record<
	UiColor,
	{ bg: string; iconBg: string; arrowBg: string; decorText: string }
> = {
	primary: {
		bg: 'bg-linear-to-br from-blue-100 via-white to-white border-primary/20',
		iconBg: 'bg-primary/10 text-primary',
		arrowBg: 'bg-primary/10 text-primary',
		decorText: 'text-primary',
	},
	blue: {
		bg: 'bg-linear-to-br from-blue-100 via-white to-white border-blue-200',
		iconBg: 'bg-blue-100 text-blue-600',
		arrowBg: 'bg-blue-100/50 text-blue-600',
		decorText: 'text-blue-600',
	},
	sky: {
		bg: 'bg-linear-to-br from-sky-100 via-white to-white border-sky-200',
		iconBg: 'bg-sky-100 text-sky-600',
		arrowBg: 'bg-sky-100/50 text-sky-600',
		decorText: 'text-sky-600',
	},
	indigo: {
		bg: 'bg-linear-to-br from-indigo-100 via-white to-white border-indigo-200',
		iconBg: 'bg-indigo-100 text-indigo-600',
		arrowBg: 'bg-indigo-100/50 text-indigo-600',
		decorText: 'text-indigo-600',
	},
	emerald: {
		bg: 'bg-linear-to-br from-emerald-100 via-white to-white border-emerald-200',
		iconBg: 'bg-emerald-100 text-emerald-600',
		arrowBg: 'bg-emerald-100/50 text-emerald-600',
		decorText: 'text-emerald-600',
	},
	amber: {
		bg: 'bg-linear-to-br from-amber-100 via-white to-white border-amber-200',
		iconBg: 'bg-amber-100 text-amber-600',
		arrowBg: 'bg-amber-100/50 text-amber-600',
		decorText: 'text-amber-600',
	},
	orange: {
		bg: 'bg-linear-to-br from-orange-100 via-white to-white border-orange-200',
		iconBg: 'bg-orange-100 text-orange-600',
		arrowBg: 'bg-orange-100/50 text-orange-600',
		decorText: 'text-orange-600',
	},
	rose: {
		bg: 'bg-linear-to-br from-rose-100 via-white to-white border-rose-200',
		iconBg: 'bg-rose-100 text-rose-600',
		arrowBg: 'bg-rose-100/50 text-rose-600',
		decorText: 'text-rose-600',
	},
	zinc: {
		bg: 'bg-linear-to-br from-zinc-100 via-white to-white border-zinc-200',
		iconBg: 'bg-zinc-100 text-zinc-600',
		arrowBg: 'bg-zinc-100/60 text-zinc-600',
		decorText: 'text-zinc-600',
	},
};

export interface EntryCardProps {
	/** 标题 */
	title: string;
	/** 描述文案 */
	desc: string;
	/** Ph 图标类名，例如 'icon-[ph--user-focus-duotone]' */
	icon: string;
	/** 点击跳转的目标路由 */
	url?: string;
	/** 外部点击拦截或自定义行为回调 */
	onClick?: () => void;
	/** 主题色调 */
	theme?: UiColor;
	/** 是否置灰禁用（比如用户已经在审核中，禁止重复点击） */
	disabled?: boolean;
}

/**
 * 玄关入口卡片
 */
export const EntryCard = ({ title, desc, icon, url, onClick, theme = 'blue', disabled = false }: EntryCardProps) => {
	const activeTheme = THEME_MAP[theme];

	const handleCardTap = () => {
		if (disabled) return;
		if (onClick) onClick();
		else if (url) Taro.navigateTo({ url });
	};

	return (
		<Card
			clickable={!disabled}
			className={`p-6 relative overflow-hidden border ${activeTheme.bg} ${
				disabled ? 'opacity-50 grayscale pointer-events-none' : ''
			}`}
			onClick={handleCardTap}
		>
			{/* 左侧主体内容区 */}
			<View className="relative z-10 flex flex-col gap-2.5 w-2/3">
				<View className={`size-10 rounded-full flex justify-center items-center ${activeTheme.iconBg}`}>
					<View className={`${icon} size-6`} />
				</View>

				<View className="flex flex-col gap-1">
					<Text className="text-lg font-bold text-text-title tracking-wide">{title}</Text>
					<Text className="text-xs text-text-body leading-relaxed">{desc}</Text>
				</View>
			</View>

			{/* 右侧轻量级引导箭头 */}
			<View className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
				<View
					className={`size-8 rounded-full flex justify-center items-center active:scale-90 transition-transform ${activeTheme.arrowBg}`}
				>
					<View className="icon-[ph--caret-right-bold] size-4" />
				</View>
			</View>

			{/* 大背景装饰 Icon */}
			<View className={`absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none ${activeTheme.decorText}`}>
				<View className={`${icon} size-36`} />
			</View>
		</Card>
	);
};
