import { View, ViewProps } from '@tarojs/components';
import { cn } from '@/utils/common';

export interface SkeletonProps extends ViewProps {
	className?: string;
}

/**
 * Skeleton 骨架屏原子组件
 * @description 利用 Tailwind animate-pulse 实现波浪感预加载占位
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<View
			className={cn('animate-pulse bg-gray-200/80 rounded-md shrink-0', className)}
			{...props}
		/>
	);
}

export interface SkeletonAvatarProps extends ViewProps {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	className?: string;
}

const AVATAR_SIZE_MAP = {
	sm: 'size-8',
	md: 'size-10',
	lg: 'size-14',
	xl: 'size-18',
};

/** SkeletonAvatar - 头像骨架屏占位 */
export function SkeletonAvatar({ size = 'md', className, ...props }: SkeletonAvatarProps) {
	return (
		<Skeleton
			className={cn('rounded-full', AVATAR_SIZE_MAP[size] || AVATAR_SIZE_MAP.md, className)}
			{...props}
		/>
	);
}

export interface SkeletonTextProps extends ViewProps {
	/** 占位行数，默认 3 行 */
	lines?: number;
	className?: string;
}

/** SkeletonText - 多行文本骨架屏占位 */
export function SkeletonText({ lines = 3, className, ...props }: SkeletonTextProps) {
	return (
		<View className={cn('flex flex-col gap-2 w-full', className)} {...props}>
			{Array.from({ length: lines }).map((_, idx) => (
				<Skeleton
					key={idx}
					className={cn('h-3.5 w-full', idx === lines - 1 && 'w-3/5')}
				/>
			))}
		</View>
	);
}

/** SkeletonCard - 标准图文卡片骨架屏组合 */
export function SkeletonCard({ className, ...props }: ViewProps) {
	return (
		<View
			className={cn(
				'w-full p-4 rounded-card border border-gray-100 bg-white flex flex-col gap-3 shadow-xs',
				className
			)}
			{...props}
		>
			<View className="flex items-center gap-3">
				<SkeletonAvatar size="md" />
				<View className="flex flex-col gap-1.5 flex-1">
					<Skeleton className="h-4 w-1/3" />
					<Skeleton className="h-3 w-1/2" />
				</View>
			</View>
			<Skeleton className="h-32 w-full rounded-card" />
			<SkeletonText lines={2} />
		</View>
	);
}
