import { View, Text, ViewProps } from '@tarojs/components';
import { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/utils/common';

interface DialogContextType {
	open: boolean;
	onOpenChange?: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType>({ open: false });

export interface DialogProps extends ViewProps {
	open?: boolean;
	visible?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: ReactNode;
}

/**
 * Dialog 对话框根组件
 */
export function Dialog({ open, visible, onOpenChange, children }: DialogProps) {
	const activeOpen = open !== undefined ? open : !!visible;

	return (
		<DialogContext.Provider value={{ open: activeOpen, onOpenChange }}>
			{children}
		</DialogContext.Provider>
	);
}

export interface DialogContentProps extends ViewProps {
	/** 是否允许点击遮罩层关闭，默认 true */
	closeOnOverlayClick?: boolean;
	/** 是否显示右上角关闭图标，默认 true */
	showClose?: boolean;
	className?: string;
	children?: ReactNode;
}

/**
 * DialogContent 居中弹窗内容主体卡片
 */
export function DialogContent({
	closeOnOverlayClick = true,
	showClose = true,
	className,
	children,
	...props
}: DialogContentProps) {
	const { open, onOpenChange } = useContext(DialogContext);

	if (!open) return null;

	const handleOverlayClick = () => {
		if (closeOnOverlayClick && onOpenChange) {
			onOpenChange(false);
		}
	};

	return (
		<View className="fixed inset-0 z-50 flex items-center justify-center p-6">
			{/* 遮罩背景 */}
			<View
				className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
				onClick={handleOverlayClick}
			/>

			{/* 居中卡片容器 */}
			<View
				className={cn(
					'relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl transition-all border border-gray-100 flex flex-col gap-4 animate-scale-in',
					className
				)}
				{...props}
			>
				{/* 右上角关闭 cross */}
				{showClose && (
					<View
						className="absolute top-4 right-4 icon-[ph--x] size-4 text-text-muted/70 active:text-text-title transition-colors p-1 cursor-pointer"
						onClick={() => onOpenChange?.(false)}
					/>
				)}

				{children}
			</View>
		</View>
	);
}

/**
 * DialogHeader 头部区域
 */
export function DialogHeader({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)} {...props}>
			{children}
		</View>
	);
}

/**
 * DialogTitle 标题
 */
export function DialogTitle({ className, children, ...props }: ViewProps) {
	return (
		<Text className={cn('text-base font-bold text-text-title leading-none', className)} {...props}>
			{children}
		</Text>
	);
}

/**
 * DialogDescription 描述说明
 */
export function DialogDescription({ className, children, ...props }: ViewProps) {
	return (
		<Text className={cn('text-xs text-text-muted leading-relaxed', className)} {...props}>
			{children}
		</Text>
	);
}

/**
 * DialogFooter 底部操作按钮栏
 */
export function DialogFooter({ className, children, ...props }: ViewProps) {
	return (
		<View
			className={cn('flex flex-row items-center justify-end gap-2 pt-2 border-t border-gray-100/60', className)}
			{...props}
		>
			{children}
		</View>
	);
}
