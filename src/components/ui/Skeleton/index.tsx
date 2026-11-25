import { View, ViewProps } from '@tarojs/components';
import { cn } from '@/utils/common';

export interface SkeletonProps extends ViewProps {
	className?: string;
}

/**
 * Skeleton 骨架屏原子组件
 * 利用 Tailwind animate-pulse 实现预加载占位，通过 className 自由组合尺寸与形状
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
	return <View className={cn('animate-pulse bg-zinc-200/80 rounded-md shrink-0', className)} {...props} />;
}
