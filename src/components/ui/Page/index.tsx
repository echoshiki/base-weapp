import { View, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { Loading } from '../Loading';
import { cn } from '@/utils/common';

export interface PageProps extends ViewProps {
	/** 是否包含底部 TabBar（用于留出底部安全高度 pb-24，默认 false） */
	hasTabBar?: boolean;
	/** 是否启用全站统一的左右内边距 (container-x)，默认 true */
	paddingX?: boolean;
	/** 页面级统一加载状态 (居中展示统一 Loading 占位) */
	loading?: boolean;
	className?: string;
	children?: ReactNode;
}

/**
 * Page 页面级顶级 Layout 容器组件
 * 核心目标：收归全站背景色、页面级 Loading 占位、左右边距 (container-x) 及 TabBar 安全区留白
 */
export function Page({
	hasTabBar = false,
	paddingX = true,
	loading = false,
	className,
	children,
	...props
}: PageProps) {
	const pbClass = hasTabBar ? 'pb-24' : 'pb-safe';

	return (
		<View className={cn('min-h-screen bg-main-bg flex flex-col relative', pbClass, className)} {...props}>
			{/* 主内容区 */}
			{loading ? (
				<View className="flex-1 flex items-center justify-center py-20">
					<Loading title="页面加载中..." />
				</View>
			) : (
				<View className={cn('flex-1 flex flex-col', paddingX && 'container-x')}>{children}</View>
			)}
		</View>
	);
}

/**
 * PageContent - 页面局部内容容器
 * 专供通栏 Banner/背景图页面在局部包裹需要 paddingX 的内容块
 */
export function PageContent({ className, children, ...props }: ViewProps) {
	return (
		<View className={cn('container-x flex flex-col', className)} {...props}>
			{children}
		</View>
	);
}
