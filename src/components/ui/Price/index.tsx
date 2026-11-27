import { View, Text } from '@tarojs/components';
import { cn } from '@/utils/common';

export type PriceSize = 'sm' | 'md' | 'lg' | 'xl';
export type PriceVariant = 'rose' | 'primary' | 'amber' | 'zinc';

export interface PriceProps {
	/** 金额（默认单位元；若传入分为单位请开启 inCent） */
	value: number | string;
	/** 可选划线原价 */
	originalPrice?: number | string;
	/** 是否以「分」为单位传入，默认 false */
	inCent?: boolean;
	/** 货币符号，默认 ¥ */
	symbol?: string;
	/** 价格后缀单位（如 /次、/晚） */
	unit?: string;
	/** 字号档位，默认 md */
	size?: PriceSize;
	/** 颜色主题，默认 rose */
	variant?: PriceVariant;
	/** 是否强制保留两位小数，默认 true */
	showZeroDecimal?: boolean;
	className?: string;
}

const SIZE_MAP: Record<PriceSize, { symbol: string; int: string; dec: string; original: string }> = {
	sm: { symbol: 'text-xs', int: 'text-sm', dec: 'text-xs', original: 'text-xs' },
	md: { symbol: 'text-xs', int: 'text-base', dec: 'text-xs', original: 'text-xs' },
	lg: { symbol: 'text-sm', int: 'text-xl', dec: 'text-xs', original: 'text-xs' },
	xl: { symbol: 'text-sm', int: 'text-2xl', dec: 'text-sm', original: 'text-sm' },
};

const VARIANT_MAP: Record<PriceVariant, string> = {
	rose: 'text-rose-500',
	primary: 'text-primary',
	amber: 'text-amber-600',
	zinc: 'text-zinc-900',
};

const normalizeAmount = (raw: number | string, inCent: boolean) => {
	const num = Number(raw);
	if (Number.isNaN(num)) return 0;
	return inCent ? num / 100 : num;
};

/**
 * Price 金额排版组件
 * 统一处理货币符号、整数/小数主次字号与划线原价，适用于商品、账单、预约定金等场景
 */
export function Price({
	value,
	originalPrice,
	inCent = false,
	symbol = '¥',
	unit,
	size = 'md',
	variant = 'rose',
	showZeroDecimal = true,
	className,
}: PriceProps) {
	const styles = SIZE_MAP[size] || SIZE_MAP.md;
	const colorClass = VARIANT_MAP[variant] || VARIANT_MAP.rose;

	const amount = normalizeAmount(value, inCent);
	const fixed = amount.toFixed(2);
	const [intPart, decPart] = fixed.split('.');
	const shouldShowDecimal = showZeroDecimal || decPart !== '00';

	const hasOriginal = originalPrice !== undefined && originalPrice !== null && originalPrice !== '';
	const originalFormatted = hasOriginal ? normalizeAmount(originalPrice!, inCent).toFixed(2) : '';

	return (
		<View className={cn('inline-flex items-baseline flex-wrap gap-1', className)}>
			<View className={cn('inline-flex items-baseline font-bold leading-none tabular-nums', colorClass)}>
				<Text className={cn('font-semibold mr-0.5', styles.symbol)}>{symbol}</Text>
				<Text className={styles.int}>{intPart}</Text>
				{shouldShowDecimal && <Text className={cn('font-semibold', styles.dec)}>.{decPart}</Text>}
				{unit && <Text className="text-xs font-normal text-zinc-400 ml-0.5">{unit}</Text>}
			</View>

			{hasOriginal && (
				<Text className={cn('text-zinc-400 line-through tabular-nums', styles.original)}>
					{symbol}
					{originalFormatted}
				</Text>
			)}
		</View>
	);
}
