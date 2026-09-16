import { View, Text, ViewProps } from '@tarojs/components';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

export type HeadingSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<HeadingSize, { icon: string; text: string }> = {
	sm: { icon: 'size-4', text: 'text-sm' },
	md: { icon: 'size-4.5', text: 'text-base' },
	lg: { icon: 'size-5', text: 'text-lg' },
};

export interface HeadingProps extends ViewProps {
	/** 标题文字 */
	title: string;
	/** 副标题 / 描述文案（支持 string 或自定义 ReactNode） */
	subtitle?: ReactNode;
	/** 标题尺寸，默认 md */
	size?: HeadingSize;
	/** 前缀图标 (Iconify 类名 string 或 ReactNode) */
	icon?: ReactNode;
	/** 右侧扩展槽位 (可传字符串如 "查看更多"、自定义组件等) */
	extra?: ReactNode;
	/** 右侧 extra 点击回调 */
	onExtraClick?: () => void;
	className?: string;
}

/**
 * Heading 通用区块标题组件
 * 基于 currentColor 自动管理标题、副标题、图标与 extra 的色阶与透明度
 */
export function Heading({
	title,
	subtitle,
	size = 'md',
	icon,
	extra,
	onExtraClick,
	className,
	...props
}: HeadingProps) {
	const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

	const renderIcon = () => {
		if (typeof icon === 'string') {
			return <View className={cn(sizeConfig.icon, 'shrink-0', icon)} />;
		}
		return icon;
	};

	const renderSubtitle = () => {
		if (!subtitle) return null;
		if (typeof subtitle === 'string') {
			return <Text className="text-xs opacity-60 mt-0.5 truncate">{subtitle}</Text>;
		}
		return subtitle;
	};

	return (
		<View className={cn('w-full flex items-center justify-between gap-3', className)} {...props}>
			{/* 左侧：图标 + 标题/副标题 */}
			<View className="flex flex-col min-w-0 flex-1">
				<View className="flex items-center gap-1.5">
					{renderIcon()}
					<Text className={cn('text-current font-bold truncate', sizeConfig.text)}>{title}</Text>
				</View>
				{renderSubtitle()}
			</View>

			{/* 右侧：统一 extra 槽位 */}
			{extra && (
				<View
					className={cn(
						'shrink-0 text-xs flex items-center gap-1',
						onExtraClick && 'active:opacity-70 cursor-pointer',
					)}
					onClick={onExtraClick}
				>
					{typeof extra === 'string' ? (
						<>
							<Text className="opacity-60">{extra}</Text>
							<View className="icon-[ph--caret-right] size-3.5 opacity-60" />
						</>
					) : (
						extra
					)}
				</View>
			)}
		</View>
	);
}
