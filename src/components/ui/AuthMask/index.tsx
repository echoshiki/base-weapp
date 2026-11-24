import { ReactNode } from 'react';
import { View, Text } from '@tarojs/components';
import { mapsTo, cn } from '@/utils/common';
import { Button } from '../Button';

export interface AuthMaskProps {
	/** 是否处于锁定/未登录遮挡状态，默认 true */
	locked?: boolean;
	/** 锁定提示标题 */
	title?: string;
	/** 锁定提示副标题 */
	subTitle?: string;
	/** 登录按钮文案 */
	buttonText?: string;
	/** 中心图标（Iconify 类名） */
	icon?: string;
	/** 点击登录按钮回调，默认跳转登录玄关页 */
	onLoginClick?: () => void;
	/** 最小高度类名，防止无子节点时遮罩高度过矮 */
	minHeightClass?: string;
	className?: string;
	children?: ReactNode;
}

/**
 * 局部高斯模糊登录遮罩组件
 * 用于未登录状态下遮挡局部内容，居中展示锁图标与登录引导
 */
export function AuthMask({
	locked = true,
	title = '登录后查看完整内容',
	subTitle,
	buttonText = '立即登录',
	icon = 'icon-[ph--lock-key-duotone]',
	onLoginClick,
	minHeightClass = 'min-h-52',
	className,
	children,
}: AuthMaskProps) {
	if (!locked) {
		return <>{children}</>;
	}

	const handleLogin = () => {
		if (onLoginClick) {
			onLoginClick();
		} else {
			mapsTo('/pages/login/index');
		}
	};

	return (
		<View className={cn('relative rounded-2xl overflow-hidden', !children && minHeightClass, className)}>
			{/* 底层预览/占位轮廓，供高斯模糊透出层次感 */}
			{children ? (
				<View className="pointer-events-none select-none opacity-60">{children}</View>
			) : (
				<View className="flex flex-col gap-2.5 p-1 pointer-events-none select-none">
					{[1, 2].map((idx) => (
						<View
							key={idx}
							className="p-4 rounded-2xl bg-white border border-zinc-100 flex flex-col gap-2.5"
						>
							<View className="h-4 w-4/5 rounded bg-zinc-200/80" />
							<View className="flex items-center justify-between">
								<View className="h-3.5 w-20 rounded-full bg-zinc-100" />
								<View className="h-3.5 w-16 rounded bg-zinc-100" />
							</View>
						</View>
					))}
				</View>
			)}

			{/* 高斯模糊遮罩层 + 水平垂直居中锁图标与引导 */}
			<View
				onClick={handleLogin}
				className="absolute inset-0 z-10 backdrop-blur-sm bg-white/10 flex flex-col items-center justify-center px-6 text-center cursor-pointer"
			>
				<View className="size-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-xs mb-3">
					<View className={cn(icon, 'size-6 text-blue-600')} />
				</View>

				<Text className="text-sm font-bold text-zinc-900">{title}</Text>
				{subTitle && <Text className="text-xs text-zinc-500 mt-1 leading-relaxed">{subTitle}</Text>}

				<Button size="sm" className="mt-3 text-white">
					{buttonText}
				</Button>
			</View>
		</View>
	);
}
