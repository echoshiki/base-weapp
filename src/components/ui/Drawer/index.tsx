import { View, Text, ScrollView, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';
import { renderPortal } from '../portal';

export type DrawerPosition = 'right' | 'bottom' | 'left' | 'top';

export interface DrawerProps extends Omit<ViewProps, 'title'> {
	/** 控制显隐 */
	open?: boolean;
	/** 兼容旧版 isOpen 属性 */
	isOpen?: boolean;
	/** 显隐状态变更回调 */
	onOpenChange?: (open: boolean) => void;
	/** 兼容旧版 onClose 回调 */
	onClose?: () => void;
	/** 弹出方向，默认 right */
	position?: DrawerPosition;
	/** 覆盖抽屉宽度或高度尺寸类（如 w-[85vw]、h-[75vh]） */
	sizeClass?: string;
	/** 抽屉标题 */
	title?: ReactNode;
	/** 抽屉描述 */
	description?: ReactNode;
	/** 底部吸底操作区 */
	footer?: ReactNode;
	/** 内容区是否自动包裹 ScrollView，默认 true（若内部自行管理 ScrollView 可设为 false） */
	scrollable?: boolean;
	/** 是否允许点击遮罩关闭，默认 true */
	closeOnOverlayClick?: boolean;
	className?: string;
	children?: ReactNode;
}

/**
 * Drawer 抽屉组件
 * 支持 right / bottom / left / top 四个弹出方向，内置标题栏、滚动内容区与吸底操作栏
 */
export function Drawer({
	open,
	isOpen,
	onOpenChange,
	onClose,
	position = 'right',
	sizeClass,
	title,
	description,
	footer,
	scrollable = true,
	closeOnOverlayClick = true,
	className,
	children,
	...props
}: DrawerProps) {
	const activeOpen = open !== undefined ? open : !!isOpen;

	const handleClose = () => {
		onOpenChange?.(false);
		onClose?.();
	};

	const getPositionClasses = () => {
		switch (position) {
			case 'bottom':
				return cn(
					'left-0 right-0 bottom-0 max-h-[85vh] rounded-t-2xl',
					sizeClass || 'h-auto',
					activeOpen ? 'translate-y-0' : 'translate-y-full',
				);
			case 'left':
				return cn(
					'top-0 left-0 h-full',
					sizeClass || 'w-[85vw]',
					activeOpen ? 'translate-x-0' : '-translate-x-full',
				);
			case 'top':
				return cn(
					'top-0 left-0 right-0 max-h-[85vh] rounded-b-2xl',
					sizeClass || 'h-auto',
					activeOpen ? 'translate-y-0' : '-translate-y-full',
				);
			case 'right':
			default:
				return cn(
					'top-0 right-0 h-full',
					sizeClass || 'w-[85vw]',
					activeOpen ? 'translate-x-0' : 'translate-x-full',
				);
		}
	};

	const content = (
		<View
			className={cn(
				'fixed inset-0 z-600 transition-opacity duration-300 ease-in-out',
				activeOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
			)}
			{...props}
		>
			{/* 遮罩层 */}
			<View
				className="absolute inset-0 bg-black/40"
				onClick={() => closeOnOverlayClick && handleClose()}
				catchMove
			/>

			{/* 抽屉主体面板 */}
			<View
				className={cn(
					'absolute bg-white flex flex-col transition-transform duration-300 ease-out transform overflow-hidden',
					getPositionClasses(),
					className,
				)}
			>
				{/* 头部区域 */}
				{(title || description) && (
					<View className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-200 shrink-0">
						<View className="flex flex-col gap-0.5 flex-1 min-w-0">
							{title && (
								<View className="font-bold text-base leading-tight">
									{typeof title === 'string' ? <Text>{title}</Text> : title}
								</View>
							)}
							{description && (
								<View className="text-xs opacity-60 leading-relaxed">
									{typeof description === 'string' ? <Text>{description}</Text> : description}
								</View>
							)}
						</View>
						<View
							className="icon-[ph--x-bold] size-5 text-zinc-400 active:text-zinc-600 transition-colors p-1 shrink-0 ml-2 cursor-pointer"
							onClick={handleClose}
						/>
					</View>
				)}

				{/* 内容区域 */}
				{scrollable ? (
					<ScrollView scrollY className="flex-1 w-full min-h-0 overflow-hidden relative p-4">
						{children}
					</ScrollView>
				) : (
					<View className="p-4 flex-1 w-full min-h-0 flex flex-col overflow-hidden">{children}</View>
				)}

				{/* 吸底操作栏 */}
				{footer && (
					<View className="shrink-0 p-4 border-t border-zinc-100/80 bg-white pb-safe flex items-center justify-end gap-3">
						{footer}
					</View>
				)}
			</View>
		</View>
	);

	return renderPortal(content);
}
