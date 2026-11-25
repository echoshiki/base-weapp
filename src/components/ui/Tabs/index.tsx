import { View, Text, ScrollView, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export interface TabItem<T extends string | number = string | number> {
	label: ReactNode;
	value: T;
}

export interface TabsProps<T extends string | number = string | number> extends Omit<ViewProps, 'onChange'> {
	/** 选项卡数据列表 */
	tabs: TabItem<T>[];
	/** 当前选中的值 */
	value?: T;
	/** 选中变更回调（重复点击当前项不会重复触发） */
	onChange?: (val: T, index: number) => void;
	/** 是否开启横向滚动（超出屏幕宽度时），默认 false */
	scrollable?: boolean;
	/** 是否顶部吸顶，默认 false */
	sticky?: boolean;
	/** 是否带白色背景与底边框，默认 true */
	hasBackground?: boolean;
	className?: string;
}

/**
 * Tabs 选项卡组件（数据驱动）
 */
export function Tabs<T extends string | number = string | number>({
	tabs,
	value,
	onChange,
	scrollable = false,
	sticky = false,
	hasBackground = true,
	className,
	...props
}: TabsProps<T>) {
	const handleSelect = (tabVal: T, idx: number) => {
		if (tabVal === value) return;
		onChange?.(tabVal, idx);
	};

	const containerClassName = cn(
		sticky && 'sticky top-0 z-10',
		hasBackground && 'bg-white border-b border-zinc-200',
		!scrollable && 'flex w-full',
		className,
	);

	const tabNodes = tabs.map(({ label, value: tabVal }, index) => {
		const isActive = value === tabVal;
		return (
			<View
				key={String(tabVal)}
				className={cn(
					scrollable ? 'px-5 shrink-0' : 'flex-1',
					'pt-3.5 pb-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer',
				)}
				onClick={() => handleSelect(tabVal, index)}
			>
				<View
					className={cn(
						'text-sm whitespace-nowrap transition-colors',
						isActive ? 'text-primary font-semibold' : 'text-zinc-500 font-medium',
					)}
				>
					{typeof label === 'string' || typeof label === 'number' ? <Text>{label}</Text> : label}
				</View>
				<View
					className={cn(
						'h-0.5 w-6 rounded-full transition-all',
						isActive ? 'bg-primary scale-100' : 'bg-transparent scale-0',
					)}
				/>
			</View>
		);
	});

	if (scrollable) {
		return (
			<ScrollView scrollX scrollWithAnimation enhanced showScrollbar={false} className={containerClassName}>
				<View className="flex flex-row items-center">{tabNodes}</View>
			</ScrollView>
		);
	}

	return (
		<View className={containerClassName} {...props}>
			{tabNodes}
		</View>
	);
}
