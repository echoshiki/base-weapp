import { View, Text } from '@tarojs/components';
import { cn } from '@/utils/common';

export type StepperSize = 'sm' | 'md';

export interface StepperProps {
	/** 当前数值 */
	value: number;
	/** 数值变更回调 */
	onChange?: (value: number) => void;
	/** 最小值，默认 1 */
	min?: number;
	/** 最大值，默认 999 */
	max?: number;
	/** 每次加减步长，默认 1 */
	step?: number;
	/** 尺寸规格：sm | md，默认 md */
	size?: StepperSize;
	/** 是否整体禁用 */
	disabled?: boolean;
	className?: string;
}

const SIZE_MAP: Record<StepperSize, { box: string; btn: string; icon: string; text: string }> = {
	sm: { box: 'h-7', btn: 'w-7', icon: 'size-3', text: 'min-w-7 text-xs' },
	md: { box: 'h-8', btn: 'w-8', icon: 'size-3.5', text: 'min-w-9 text-sm' },
};

/**
 * Stepper 步进器组件
 * 适用于商品数量、预约人数、票务张数等数值增减场景
 */
export function Stepper({
	value,
	onChange,
	min = 1,
	max = 999,
	step = 1,
	size = 'md',
	disabled = false,
	className,
}: StepperProps) {
	const styles = SIZE_MAP[size] || SIZE_MAP.md;
	const canMinus = !disabled && value > min;
	const canPlus = !disabled && value < max;

	const handleMinus = (e: any) => {
		e.stopPropagation();
		if (!canMinus) return;
		onChange?.(Math.max(min, value - step));
	};

	const handlePlus = (e: any) => {
		e.stopPropagation();
		if (!canPlus) return;
		onChange?.(Math.min(max, value + step));
	};

	return (
		<View
			className={cn(
				'inline-flex items-center rounded-lg border border-zinc-200 bg-white overflow-hidden select-none',
				styles.box,
				disabled && 'opacity-50',
				className,
			)}
		>
			<View
				className={cn(
					'h-full flex items-center justify-center bg-zinc-50 border-r border-zinc-200 transition-colors',
					styles.btn,
					canMinus ? 'text-zinc-700 active:bg-zinc-100 cursor-pointer' : 'text-zinc-300',
				)}
				onClick={handleMinus}
			>
				<View className={cn('icon-[ph--minus-bold]', styles.icon)} />
			</View>

			<View className={cn('px-2 flex items-center justify-center font-semibold text-zinc-900', styles.text)}>
				<Text>{value}</Text>
			</View>

			<View
				className={cn(
					'h-full flex items-center justify-center bg-zinc-50 border-l border-zinc-200 transition-colors',
					styles.btn,
					canPlus ? 'text-zinc-700 active:bg-zinc-100 cursor-pointer' : 'text-zinc-300',
				)}
				onClick={handlePlus}
			>
				<View className={cn('icon-[ph--plus-bold]', styles.icon)} />
			</View>
		</View>
	);
}
