import { View, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export interface AspectRatioProps extends ViewProps {
	/** 宽高比例 (如 16 / 9, 4 / 3, 1 / 1, 3 / 4)，默认 16 / 9 */
	ratio?: number;
	className?: string;
	children?: ReactNode;
}

/**
 * AspectRatio 宽高比容器组件 (shadcn 范式)
 * @description 将子元素 (图片、视频、骨架屏等) 强约束在指定的宽高比例容器内，防止内容加载跳变 (CLS)
 */
export function AspectRatio({ ratio = 16 / 9, className, children, ...props }: AspectRatioProps) {
	return (
		<View
			className={cn('relative w-full overflow-hidden shrink-0', className)}
			style={{ aspectRatio: `${ratio}` }}
			{...props}
		>
			<View className="absolute inset-0 size-full flex items-center justify-center">
				{children}
			</View>
		</View>
	);
}
