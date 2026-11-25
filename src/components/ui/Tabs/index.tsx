import { View, Text, ScrollView, ViewProps } from '@tarojs/components';
import { cn } from '@/utils/common';

export interface TabItem {
	label: string;
	value: string | number;
}

export interface TabsProps extends Omit<ViewProps, 'onChange'> {
	/** 选项卡数据列表 */
	tabs: TabItem[];
	/** 当前选中的值 */
	value?: string | number;
	/** 兼容旧版 current 属性 */
	current?: string | number;
	/** 选中变更回调 */
	onValueChange?: (val: string | number) => void;
	/** 兼容旧版 onChange 回调 */
	onChange?: (val: string | number, index: number) => void;
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
export function Tabs({
	tabs,
	value,
	current,
	onValueChange,
	onChange,
	scrollable = false,
	sticky = false,
	hasBackground = true,
	className,
	...props
}: TabsProps) {
	const activeValue = value !== undefined ? value : current;

	const handleSelect = (val: string | number, idx: number) => {
		onValueChange?.(val);
		onChange?.(val, idx);
	};

	const containerClassName = cn(
		sticky && 'sticky top-0 z-10',
		hasBackground && 'bg-white border-b border-zinc-100/80',
		!scrollable && 'flex w-full',
		className,
	);

	const tabNodes = tabs.map(({ label, value: tabVal }, index) => {
		const isActive = activeValue === tabVal;
		return (
			<View
				key={tabVal}
				className={cn(
					scrollable ? 'px-5 shrink-0' : 'flex-1',
					'pt-3.5 pb-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer',
				)}
				onClick={() => handleSelect(tabVal, index)}
			>
				<Text
					className={cn(
						'text-sm font-medium whitespace-nowrap transition-colors',
						isActive ? 'text-primary font-semibold' : 'text-zinc-900',
					)}
				>
					{label}
				</Text>
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
			<ScrollView
				scrollX
				scrollWithAnimation
				enhanced
				showScrollbar={false}
				className={containerClassName}
			>
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
