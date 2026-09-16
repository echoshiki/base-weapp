import { View } from '@tarojs/components';
import { type Gender } from '@/types/common';
import { cn } from '@/utils/common';

export type GenderSize = 'xs' | 'sm' | 'md';

const SIZE_MAP: Record<GenderSize, { box: string; icon: string }> = {
	xs: { box: 'size-3.5', icon: 'size-2.5' },
	sm: { box: 'size-4.5', icon: 'size-3' },
	md: { box: 'size-5.5', icon: 'size-3.5' },
};

export interface GenderProps {
	/** 性别：'0'/0=男, '1'/1=女, '2'/2=未知 */
	gender?: Gender | string | number;
	/** 尺寸，默认 sm */
	size?: GenderSize;
	className?: string;
}

/**
 * Gender 性别徽标组件
 * 自动根据性别值展示蓝色男标或红色女标，未知/未设置时自动安全返回 null
 */
export function Gender({ gender, size = 'sm', className }: GenderProps) {
	const sizeConfig = SIZE_MAP[size] || SIZE_MAP.sm;
	const g = gender !== undefined && gender !== null ? String(gender) : '';

	if (g === '0' || g === 'male') {
		return (
			<View
				className={cn(
					'flex items-center justify-center rounded-full bg-sky-500/20 text-sky-400 shrink-0',
					sizeConfig.box,
					className,
				)}
			>
				<View className={cn('icon-[ph--gender-male-bold]', sizeConfig.icon)} />
			</View>
		);
	}

	if (g === '1' || g === 'female') {
		return (
			<View
				className={cn(
					'flex items-center justify-center rounded-full bg-rose-500/20 text-rose-400 shrink-0',
					sizeConfig.box,
					className,
				)}
			>
				<View className={cn('icon-[ph--gender-female-bold]', sizeConfig.icon)} />
			</View>
		);
	}

	return null;
}
