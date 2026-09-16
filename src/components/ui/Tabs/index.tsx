import { View, Text, ScrollView, ViewProps } from '@tarojs/components';
import { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/utils/common';

export interface TabItem {
	label: string;
	value: string | number;
}

const TabsContext = createContext<{
	value?: string | number;
	onValueChange?: (val: string | number) => void;
}>({});

export interface TabsProps extends ViewProps {
	/** 数据驱动模式：Tab 项列表 */
	tabs?: TabItem[];
	/** 当前选中 Tab 值 */
	current?: string | number;
	value?: string | number;
	/** Tab 切换回调 */
	onChange?: (value: string | number, index: number) => void;
	onValueChange?: (value: string | number) => void;
	sticky?: boolean;
	scrollable?: boolean;
	hasBackground?: boolean;
	className?: string;
	children?: ReactNode;
}

/**
 * Tabs 根组件
 */
export function Tabs({
	tabs,
	current,
	value,
	onChange,
	onValueChange,
	sticky = true,
	scrollable = false,
	hasBackground = true,
	className,
	children,
	...props
}: TabsProps) {
	const activeValue = value !== undefined ? value : current;

	const handleValueChange = (val: string | number, idx: number = 0) => {
		if (onValueChange) onValueChange(val);
		if (onChange) onChange(val, idx);
	};

	// 经典数据驱动模式
	if (tabs) {
		const containerClassName = cn(
			sticky && 'sticky top-0 z-10',
			hasBackground && 'bg-white border-b border-gray-100/80',
			!scrollable && 'flex w-full',
			className
		);

		const tabNodes = tabs.map(({ label, value: tabVal }, index) => {
			const isActive = activeValue === tabVal;
			return (
				<View
					key={tabVal}
					className={cn(
						scrollable ? 'px-5' : 'flex-1',
						'pt-3.5 pb-2 flex flex-col items-center gap-1.5 transition-all',
						isActive && 'active-tab'
					)}
					onClick={() => handleValueChange(tabVal, index)}
				>
					<Text
						className={cn(
							'text-sm font-medium whitespace-nowrap transition-colors',
							isActive ? 'text-primary font-semibold' : 'text-text-title'
						)}
					>
						{label}
					</Text>
					<View
						className={cn(
							'h-0.5 w-6 rounded-full transition-all',
							isActive ? 'bg-primary scale-100' : 'bg-transparent scale-0'
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

		return <View className={containerClassName}>{tabNodes}</View>;
	}

	// 复合声明模式
	return (
		<TabsContext.Provider value={{ value: activeValue, onValueChange: (v) => handleValueChange(v, 0) }}>
			<View className={cn('w-full flex flex-col', className)} {...props}>
				{children}
			</View>
		</TabsContext.Provider>
	);
}

/**
 * TabsList 头部 Tab 选项栏列表容器
 */
export function TabsList({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('flex items-center w-full bg-white border-b border-gray-100/80', className)} {...props}>
			{children}
		</View>
	);
}

export interface TabsTriggerProps extends ViewProps {
	value: string | number;
	className?: string;
	children?: ReactNode;
}

/**
 * TabsTrigger 单个 Tab 触发器
 */
export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
	const ctx = useContext(TabsContext);
	const isActive = ctx.value === value;

	return (
		<View
			className={cn(
				'flex-1 pt-3.5 pb-2 flex flex-col items-center justify-center gap-1.5 transition-all',
				className
			)}
			onClick={() => ctx.onValueChange?.(value)}
			{...props}
		>
			<Text
				className={cn(
					'text-sm whitespace-nowrap transition-colors',
					isActive ? 'text-primary font-semibold' : 'text-text-title font-medium'
				)}
			>
				{typeof children === 'string' ? <Text>{children}</Text> : children}
			</Text>
			<View
				className={cn(
					'h-0.5 w-6 rounded-full transition-all',
					isActive ? 'bg-primary scale-100' : 'bg-transparent scale-0'
				)}
			/>
		</View>
	);
}

export interface TabsContentProps extends ViewProps {
	value: string | number;
	className?: string;
	children?: ReactNode;
}

/**
 * TabsContent 选项卡对应的内容区
 */
export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
	const ctx = useContext(TabsContext);
	if (ctx.value !== value) return null;

	return (
		<View className={cn('w-full py-3 animate-fade-in', className)} {...props}>
			{children}
		</View>
	);
}
