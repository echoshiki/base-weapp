import { useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button as TaroButton } from '@tarojs/components';
import { cn } from '@/utils/common';
import { renderPortal } from '../portal';

export interface FloatCustomerServiceProps {
	/** 初始距离右侧距离 (px)，默认 16 */
	rightOffset?: number;
	/** 初始距离底部距离 (px)，默认 130 (避开底部操作栏) */
	bottomOffset?: number;
	className?: string;
}

const BALL_SIZE = 52;
const EDGE_PADDING = 12;

const getViewportSize = () => {
	try {
		const info = Taro.getSystemInfoSync();
		return {
			width: info.windowWidth || 375,
			height: info.windowHeight || 667,
		};
	} catch {
		return { width: 375, height: 667 };
	}
};

/**
 * 全局通用可拖拽移动的在线客服悬浮球
 * 默认采用纯 CSS fixed right/bottom 定位（彻底规避 Taro H5 MovableArea 首次懒加载水合落到左上角的 Bug），
 * 拖拽时切换为 left/top 跟随手指移动。
 */
export function FloatCustomerService({ rightOffset = 16, bottomOffset = 130, className }: FloatCustomerServiceProps) {
	const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
	const touchStartRef = useRef<{ x: number; y: number; moved: boolean }>({
		x: 0,
		y: 0,
		moved: false,
	});

	const handleTouchStart = (e: any) => {
		const touch = e.touches?.[0];
		if (!touch) return;
		touchStartRef.current = {
			x: touch.clientX,
			y: touch.clientY,
			moved: false,
		};
	};

	const handleTouchMove = (e: any) => {
		const touch = e.touches?.[0];
		if (!touch) return;

		const dx = touch.clientX - touchStartRef.current.x;
		const dy = touch.clientY - touchStartRef.current.y;
		if (!touchStartRef.current.moved && Math.hypot(dx, dy) < 6) {
			return;
		}
		touchStartRef.current.moved = true;

		const { width, height } = getViewportSize();
		const nextX = Math.min(Math.max(EDGE_PADDING, touch.clientX - BALL_SIZE / 2), width - BALL_SIZE - EDGE_PADDING);
		const nextY = Math.min(
			Math.max(EDGE_PADDING, touch.clientY - BALL_SIZE / 2),
			height - BALL_SIZE - EDGE_PADDING,
		);
		setDragPos({ x: nextX, y: nextY });
	};

	const content = (
		<View
			catchMove
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			style={
				dragPos
					? { left: `${dragPos.x}px`, top: `${dragPos.y}px` }
					: { right: `${rightOffset}px`, bottom: `${bottomOffset}px` }
			}
			className={cn('fixed z-550 size-12', className)}
		>
			<TaroButton
				openType="contact"
				className="size-full rounded-full bg-linear-to-b from-primary via-primary/80 to-primary/60 border border-primary/60 flex flex-col items-center justify-center p-0 m-0 after:border-0 active:scale-95 transition-transform gap-1"
			>
				<View className="icon-[ph--headset-fill] size-6 text-white" />
			</TaroButton>
		</View>
	);

	return renderPortal(content);
}
