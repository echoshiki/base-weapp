import { View, Text, Image, ViewProps } from '@tarojs/components';
import { useState, ReactNode } from 'react';
import { cn } from '@/utils/common';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const BG_COLORS = [
	'bg-blue-400',
	'bg-emerald-400',
	'bg-violet-400',
	'bg-amber-400',
	'bg-rose-400',
	'bg-indigo-400',
	'bg-cyan-400',
];

const SIZE_MAP: Record<AvatarSize, { container: string; badge: string }> = {
	sm: { container: 'w-8 h-8 text-xs', badge: 'w-2.5 h-2.5' },
	md: { container: 'w-12 h-12 text-sm', badge: 'w-3.5 h-3.5' },
	lg: { container: 'w-16 h-16 text-base', badge: 'w-4 h-4' },
	xl: { container: 'w-20 h-20 text-xl', badge: 'w-5 h-5' },
};

export interface AvatarProps extends ViewProps {
	src?: string;
	name?: string;
	size?: AvatarSize;
	className?: string;
	children?: ReactNode;
}

/**
 * Avatar 根容器组件
 */
export function Avatar({ src, name = 'U', size = 'md', className, children, ...props }: AvatarProps) {
	const [isError, setIsError] = useState(false);

	const getBgColor = (str: string) => {
		const charCodeSum = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return BG_COLORS[charCodeSum % BG_COLORS.length];
	};

	const displayChar = name.charAt(0).toUpperCase();
	const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

	// 如果没有子节点且传入了 src/name，走经典方便模式
	if (!children) {
		return (
			<View
				className={cn(
					'relative rounded-full overflow-hidden flex items-center justify-center shrink-0 border-2 border-white/20 shadow-xs',
					sizeConfig.container,
					className
				)}
				{...props}
			>
				{src && !isError ? (
					<Image
						src={src}
						className="w-full h-full"
						mode="aspectFill"
						onError={() => setIsError(true)}
					/>
				) : (
					<View className={cn('w-full h-full flex items-center justify-center text-white font-bold', getBgColor(name))}>
						<Text>{displayChar}</Text>
					</View>
				)}
			</View>
		);
	}

	// 否则走复合组件模式
	return (
		<View
			className={cn(
				'relative rounded-full overflow-hidden flex items-center justify-center shrink-0 border-2 border-white/20 shadow-xs',
				sizeConfig.container,
				className
			)}
			{...props}
		>
			{children}
		</View>
	);
}

/**
 * AvatarImage 头像图片子组件
 */
export function AvatarImage({ src, className, ...props }: { src: string; className?: string }) {
	const [isError, setIsError] = useState(false);

	if (isError || !src) return null;

	return (
		<Image
			src={src}
			className={cn('w-full h-full', className)}
			mode="aspectFill"
			onError={() => setIsError(true)}
			{...props}
		/>
	);
}

/**
 * AvatarFallback 头像后备占位组件
 */
export function AvatarFallback({
	name = 'U',
	className,
	children,
}: {
	name?: string;
	className?: string;
	children?: ReactNode;
}) {
	const displayChar = name.charAt(0).toUpperCase();

	return (
		<View
			className={cn(
				'w-full h-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold',
				className
			)}
		>
			{children ? children : <Text>{displayChar}</Text>}
		</View>
	);
}

export type AvatarBadgeStatus = 'online' | 'offline' | 'busy' | 'away';

const BADGE_STATUS_MAP: Record<AvatarBadgeStatus, string> = {
	online: 'bg-emerald-500',
	offline: 'bg-gray-400',
	busy: 'bg-rose-500',
	away: 'bg-amber-500',
};

/**
 * AvatarBadge 头像右下角状态角标
 */
export function AvatarBadge({
	status = 'online',
	className,
}: {
	status?: AvatarBadgeStatus;
	className?: string;
}) {
	return (
		<View
			className={cn(
				'absolute bottom-0 right-0 rounded-full border-2 border-white',
				BADGE_STATUS_MAP[status],
				className
			)}
		/>
	);
}
