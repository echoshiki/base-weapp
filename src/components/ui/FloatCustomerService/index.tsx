import { useState } from 'react';
import Taro from '@tarojs/taro';
import { MovableArea, MovableView, View, Text, Button as TaroButton } from '@tarojs/components';
import { cn } from '@/utils/common';

export interface FloatCustomerServiceProps {
	/** 初始距离右侧距离 (px)，默认 16 */
	rightOffset?: number;
	/** 初始距离底部距离 (px)，默认 130 (避开底部操作栏) */
	bottomOffset?: number;
	className?: string;
}

/**
 * 全局通用可拖拽移动的在线客服悬浮窗
 */
export function FloatCustomerService({
	rightOffset = 16,
	bottomOffset = 130,
	className,
}: FloatCustomerServiceProps) {
	// 获取当前屏幕宽高以计算最佳初始落点
	const [sysInfo] = useState(() => {
		try {
			const info = Taro.getSystemInfoSync();
			return {
				windowWidth: info.windowWidth || 375,
				windowHeight: info.windowHeight || 667,
			};
		} catch {
			return { windowWidth: 375, windowHeight: 667 };
		}
	});

	// 计算初始位置 (右侧偏下，避开底部吸底栏)
	const initialX = Math.max(0, sysInfo.windowWidth - 56 - rightOffset);
	const initialY = Math.max(0, sysInfo.windowHeight - 56 - bottomOffset);

	return (
		<MovableArea className="fixed inset-0 w-full h-full pointer-events-none z-40" style={{ width: '100vw', height: '100vh' }}>
			<MovableView
				direction="all"
				inertia
				damping={30}
				friction={2}
				x={initialX}
				y={initialY}
				className={cn('size-13 pointer-events-auto', className)}
			>
				<TaroButton
					openType="contact"
					className="w-full h-full rounded-full bg-linear-to-b from-[#252220] via-[#161413] to-[#0a0a0a] border border-primary/50 shadow-xl shadow-black/35 flex flex-col items-center justify-center p-0 m-0 after:border-0 active:scale-95 transition-transform"
				>
					<View className="icon-[ph--headset-fill] size-5 text-primary" />
					<Text className="text-[18rpx] text-primary/95 font-medium leading-none mt-0.5 tracking-wider">
						客服
					</Text>
				</TaroButton>
			</MovableView>
		</MovableArea>
	);
}
