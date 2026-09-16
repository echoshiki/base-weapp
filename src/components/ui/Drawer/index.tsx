import { View, Text, ScrollView, ViewProps } from '@tarojs/components';
import { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/utils/common';

export type DrawerPosition = 'right' | 'bottom' | 'left' | 'top';

const DrawerContext = createContext<{
	isOpen: boolean;
	onClose: () => void;
	position?: DrawerPosition;
}>({
	isOpen: false,
	onClose: () => {},
	position: 'right',
});

export interface DrawerProps extends ViewProps {
	/** 控制抽屉显隐 */
	isOpen?: boolean;
	open?: boolean;
	/** 关闭抽屉回调 */
	onClose?: () => void;
	onOpenChange?: (open: boolean) => void;
	/** 弹出方向，默认 'right' */
	position?: DrawerPosition;
	/** 简易模式：抽屉标题 */
	title?: string;
	/** 简易模式：底部吸底操作区 */
	footer?: ReactNode;
	/** 简易模式：面板宽度 class (仅在 position='right'|'left' 时有效) */
	width?: string;
	className?: string;
	children?: ReactNode;
}

/**
 * Drawer 抽屉根组件 (支持简易模式与 shadcn 声明式复合模式)
 */
export function Drawer({
	isOpen,
	open,
	onClose,
	onOpenChange,
	position = 'right',
	title,
	footer,
	width = 'w-[85vw]',
	className,
	children,
	...props
}: DrawerProps) {
	const activeOpen = open !== undefined ? open : !!isOpen;

	const handleClose = () => {
		if (onClose) onClose();
		if (onOpenChange) onOpenChange(false);
	};

	// 简易模式（传入 title/footer 或未走复合 DrawerContent）
	if (title !== undefined || footer !== undefined) {
		return (
			<DrawerContext.Provider value={{ isOpen: activeOpen, onClose: handleClose, position }}>
				<View
					className={cn(
						'fixed inset-0 z-50 transition-opacity duration-300 ease-in-out',
						activeOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
						className
					)}
					{...props}
				>
					{/* 遮罩 */}
					<View className="absolute inset-0 bg-black/40" onClick={handleClose} catchMove />

					{/* 面板 */}
					<View
						className={cn(
							'absolute top-0 right-0 h-full bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out transform',
							width,
							activeOpen ? 'translate-x-0' : 'translate-x-full'
						)}
					>
						{title && (
							<View className="flex items-center justify-between px-4 h-14 border-b border-gray-100 shrink-0">
								<Text className="text-sm font-semibold text-text-title">{title}</Text>
								<View
									className="icon-[ph--x-bold] size-5 text-gray-400 active:text-gray-600 transition-colors p-1"
									onClick={handleClose}
								/>
							</View>
						)}

						<ScrollView scrollY className="flex-1 w-full h-full overflow-hidden relative">
							{children}
						</ScrollView>

						{footer && (
							<View className="shrink-0 p-4 border-t border-gray-100/80 bg-white pb-safe">
								{footer}
							</View>
						)}
					</View>
				</View>
			</DrawerContext.Provider>
		);
	}

	// 声明式复合架构模式
	return (
		<DrawerContext.Provider value={{ isOpen: activeOpen, onClose: handleClose, position }}>
			<View
				className={cn(
					'fixed inset-0 z-50 transition-opacity duration-300 ease-in-out',
					activeOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
					className
				)}
				{...props}
			>
				<View className="absolute inset-0 bg-black/40" onClick={handleClose} catchMove />
				{children}
			</View>
		</DrawerContext.Provider>
	);
}

export interface DrawerContentProps extends ViewProps {
	/** 覆盖抽屉宽度或高度尺寸 */
	sizeClass?: string;
	className?: string;
	children?: ReactNode;
}

/**
 * DrawerContent - 抽屉面板主容器
 */
export function DrawerContent({ sizeClass, className, children, ...props }: DrawerContentProps) {
	const { isOpen, onClose, position } = useContext(DrawerContext);

	const getPositionClasses = () => {
		switch (position) {
			case 'bottom':
				return cn(
					'left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl',
					sizeClass || 'h-auto',
					isOpen ? 'translate-y-0' : 'translate-y-full'
				);
			case 'left':
				return cn(
					'top-0 left-0 h-full',
					sizeClass || 'w-[85vw]',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				);
			case 'top':
				return cn(
					'top-0 left-0 right-0 max-h-[85vh] rounded-b-2xl',
					sizeClass || 'h-auto',
					isOpen ? 'translate-y-0' : '-translate-y-full'
				);
			case 'right':
			default:
				return cn(
					'top-0 right-0 h-full',
					sizeClass || 'w-[85vw]',
					isOpen ? 'translate-x-0' : 'translate-x-full'
				);
		}
	};

	return (
		<View
			className={cn(
				'absolute bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out transform',
				getPositionClasses(),
				className
			)}
			{...props}
		>
			<ScrollView scrollY className="flex-1 w-full h-full overflow-hidden relative">
				{children}
			</ScrollView>
		</View>
	);
}

/**
 * DrawerHeader - 抽屉头部
 */
export function DrawerHeader({ className, children, ...props }: ViewProps) {
	const { onClose } = useContext(DrawerContext);

	return (
		<View className={cn('flex items-center justify-between px-4 h-14 border-b border-gray-100/80 shrink-0', className)} {...props}>
			<View className="flex flex-col gap-0.5 flex-1 min-w-0">{children}</View>
			<View
				className="icon-[ph--x-bold] size-5 text-gray-400 active:text-gray-600 transition-colors p-1 shrink-0 ml-2"
				onClick={onClose}
			/>
		</View>
	);
}

/**
 * DrawerTitle - 抽屉标题
 */
export function DrawerTitle({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('font-bold text-sm text-text-title leading-tight', className)} {...props}>
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}

/**
 * DrawerDescription - 抽屉描述
 */
export function DrawerDescription({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('text-xs text-text-muted leading-relaxed', className)} {...props}>
			{typeof children === 'string' ? <Text>{children}</Text> : children}
		</View>
	);
}

/**
 * DrawerFooter - 抽屉底部/吸底操作区
 */
export function DrawerFooter({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('shrink-0 p-4 border-t border-gray-100/80 bg-white pb-safe flex items-center justify-end gap-3', className)} {...props}>
			{children}
		</View>
	);
}
