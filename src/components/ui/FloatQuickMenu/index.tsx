import { useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { mapsTo, cn } from '@/utils/common';

export interface FloatQuickMenuProps {
	/** 初始距离右侧距离 (px)，默认 16 */
	rightOffset?: number;
	/** 初始距离底部距离 (px)，默认 96（避开底部操作栏） */
	bottomOffset?: number;
	className?: string;
}

const BALL_SIZE = 44;
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
 * 全局可拖拽悬浮快捷功能菜单
 * 默认使用纯 CSS fixed right/bottom 定位（彻底避免 Taro MovableArea 首次懒加载水合落到左侧的 Bug），
 * 拖拽时切换为 left/top 坐标跟随手指移动。
 */
export function FloatQuickMenu({ rightOffset = 16, bottomOffset = 96, className }: FloatQuickMenuProps) {
	const [expanded, setExpanded] = useState(false);
	const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

	const touchStartRef = useRef<{ x: number; y: number; moved: boolean }>({
		x: 0,
		y: 0,
		moved: false,
	});

	const viewport = getViewportSize();
	// 默认位于右下角（向上展开）；若用户将其拖拽到屏幕上半区则向下展开
	const expandDown = dragPos ? dragPos.y < viewport.height * 0.4 : false;

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

	const handleToggle = () => {
		// 刚刚发生过拖拽时不触发点击展开/收起
		if (touchStartRef.current.moved) {
			touchStartRef.current.moved = false;
			return;
		}
		setExpanded((prev) => !prev);
	};

	const handleBack = () => {
		setExpanded(false);
		const pages = Taro.getCurrentPages();
		if (pages.length > 1) {
			Taro.navigateBack({ delta: 1 });
		} else {
			mapsTo('/pages/home/index', 'reLaunch');
		}
	};

	const handleHome = () => {
		setExpanded(false);
		mapsTo('/pages/home/index', 'reLaunch');
	};

	const handleScrollTop = () => {
		setExpanded(false);
		Taro.pageScrollTo({ scrollTop: 0, duration: 300 });
	};

	const actions = [
		{ key: 'back', label: '返回', icon: 'icon-[ph--arrow-u-up-left-bold]', onClick: handleBack },
		{ key: 'home', label: '首页', icon: 'icon-[ph--house-duotone]', onClick: handleHome },
		{ key: 'top', label: '置顶', icon: 'icon-[ph--arrow-line-up-bold]', onClick: handleScrollTop },
	];

	return (
		<View
			catchMove
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			style={
				dragPos
					? { left: `${dragPos.x}px`, top: `${dragPos.y}px` }
					: { right: `${rightOffset}px`, bottom: `${bottomOffset}px` }
			}
			className={cn('fixed z-50 size-11', className)}
		>
			<View className="relative size-11">
				{/* 展开态快捷菜单面板 */}
				{expanded && (
					<View
						className={cn(
							'absolute right-0 w-20 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl py-1.5 flex flex-col gap-1 z-50',
							expandDown ? 'top-13' : 'bottom-13',
						)}
					>
						{actions.map((item) => (
							<View
								key={item.key}
								onClick={item.onClick}
								className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl active:bg-slate-100 cursor-pointer"
							>
								<View className={cn(item.icon, 'size-6 text-slate-700')} />
								<Text className="text-xs text-slate-800 font-medium mt-0.5">{item.label}</Text>
							</View>
						))}
					</View>
				)}

				{/* 悬浮触发球 */}
				<View
					onClick={handleToggle}
					className={cn(
						'size-12 rounded-full flex items-center justify-center shadow-lg border transition-all cursor-pointer active:scale-95',
						expanded
							? 'bg-primary border-primary text-white shadow-blue-500/30'
							: 'bg-white/95 backdrop-blur-md border-slate-200/80 text-slate-800 shadow-slate-900/15',
					)}
				>
					<View className={cn(expanded ? 'icon-[ph--x-bold]' : 'icon-[ph--dots-nine-bold]', 'size-6')} />
				</View>
			</View>
		</View>
	);
}
