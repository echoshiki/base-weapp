import { View, Text, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export interface DialogProps extends Omit<ViewProps, 'title'> {
	/** 控制显隐 */
	open?: boolean;
	/** 兼容旧版 visible 属性 */
	visible?: boolean;
	/** 显隐状态变更回调 */
	onOpenChange?: (open: boolean) => void;
	/** 快捷关闭回调 */
	onClose?: () => void;
	/** 弹窗标题 */
	title?: ReactNode;
	/** 弹窗描述说明 */
	description?: ReactNode;
	/** 底部操作栏 */
	footer?: ReactNode;
	/** 是否允许点击遮罩层关闭，默认 true */
	closeOnOverlayClick?: boolean;
	/** 是否显示右上角关闭图标，默认 true */
	showClose?: boolean;
	className?: string;
	children?: ReactNode;
}

/**
 * Dialog 居中模态对话框组件
 */
export function Dialog({
	open,
	visible,
	onOpenChange,
	onClose,
	title,
	description,
	footer,
	closeOnOverlayClick = true,
	showClose = true,
	className,
	children,
	...props
}: DialogProps) {
	const activeOpen = open !== undefined ? open : !!visible;

	if (!activeOpen) return null;

	const handleClose = () => {
		onOpenChange?.(false);
		onClose?.();
	};

	return (
		<View className="fixed inset-0 z-50 flex items-center justify-center p-6">
			{/* 遮罩背景 */}
			<View
				className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
				onClick={() => closeOnOverlayClick && handleClose()}
			/>

			{/* 居中卡片容器 */}
			<View
				className={cn(
					'relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl transition-all border border-zinc-100 flex flex-col gap-4 animate-scale-in',
					className,
				)}
				{...props}
			>
				{/* 右上角关闭按钮 */}
				{showClose && (
					<View
						className="absolute top-4 right-4 icon-[ph--x] size-4 text-zinc-400 active:text-zinc-900 transition-colors p-1 cursor-pointer"
						onClick={handleClose}
					/>
				)}

				{/* 头部区域 */}
				{(title || description) && (
					<View className="flex flex-col gap-1.5 pr-6">
						{title && (
							<View className="text-base font-bold leading-snug">
								{typeof title === 'string' ? <Text>{title}</Text> : title}
							</View>
						)}
						{description && (
							<View className="text-xs opacity-60 leading-relaxed">
								{typeof description === 'string' ? <Text>{description}</Text> : description}
							</View>
						)}
					</View>
				)}

				{/* 自定义内容区 */}
				{children}

				{/* 底部操作栏 */}
				{footer && (
					<View className="flex flex-row items-center justify-end gap-2 pt-3 border-t border-zinc-100/80">
						{footer}
					</View>
				)}
			</View>
		</View>
	);
}
