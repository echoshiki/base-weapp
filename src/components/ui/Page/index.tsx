import { View, Text, ViewProps } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { ReactNode, useEffect, useState } from 'react';
import { Loading } from '../Loading';
import { FloatQuickMenu } from '../FloatQuickMenu';
import { cn, mapsTo } from '@/utils/common';

export interface PageProps extends ViewProps {
	/** 是否包含底部 TabBar（用于留出底部安全高度 pb-24，默认 false） */
	hasTabBar?: boolean;
	/** 是否启用全站统一的左右内边距 (container-x)，默认 true */
	paddingX?: boolean;
	/** 页面级统一加载状态 (居中展示统一 Loading 占位) */
	loading?: boolean;
	/** 是否显示全局悬浮快捷功能菜单，默认 false */
	showQuickMenu?: boolean;
	/** H5 端是否显示顶部返回导航栏（默认非 TabBar 页且非微信内置浏览器时自动开启） */
	showH5Nav?: boolean;
	/** H5 顶部导航栏标题（不传时自动读取页面 navigationBarTitleText / document.title） */
	title?: string;
	/** H5 顶部导航栏右侧扩展槽位 */
	navExtra?: ReactNode;
	/** 自定义返回行为（默认有上一页时返回，无历史栈时回首页） */
	onBack?: () => void;
	/** 顶部自定义插槽（如业务头部） */
	header?: ReactNode;
	className?: string;
	children?: ReactNode;
}

const IS_H5 = process.env.TARO_ENV === 'h5';
const IS_WECHAT_BROWSER =
	IS_H5 && typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent);

/**
 * Page 页面级顶级 Layout 容器组件
 * 收归全站背景色、H5 二级页自动返回导航栏、页面级 Loading、左右边距 (container-x) 及 TabBar 安全区留白
 */
export function Page({
	hasTabBar = false,
	paddingX = true,
	loading = false,
	showQuickMenu = false,
	showH5Nav,
	title,
	navExtra,
	onBack,
	header,
	className,
	children,
	...props
}: PageProps) {
	const pbClass = hasTabBar ? 'pb-24' : 'pb-safe';
	const shouldShowH5Nav = IS_H5 && (showH5Nav ?? (!hasTabBar && !IS_WECHAT_BROWSER));

	const [docTitle, setDocTitle] = useState(() =>
		IS_H5 && typeof document !== 'undefined' ? document.title : '',
	);
	const [canGoBack, setCanGoBack] = useState(() => Taro.getCurrentPages().length > 1);

	const syncH5NavState = () => {
		if (!shouldShowH5Nav) return;
		setCanGoBack(Taro.getCurrentPages().length > 1);
		if (!title && typeof document !== 'undefined') {
			setDocTitle(document.title);
		}
	};

	useEffect(() => {
		syncH5NavState();
		if (!shouldShowH5Nav || title) return;
		// Taro H5 路由切换后更新 document.title 可能晚于首次 render，做一次微延迟同步
		const timer = setTimeout(syncH5NavState, 50);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouldShowH5Nav, title]);

	useDidShow(() => {
		syncH5NavState();
	});

	const handleBack = () => {
		if (onBack) {
			onBack();
			return;
		}
		if (Taro.getCurrentPages().length > 1) {
			Taro.navigateBack({ delta: 1 });
		} else {
			mapsTo('/pages/home/index', 'reLaunch');
		}
	};

	const activeTitle = title || docTitle;

	return (
		<View className={cn('min-h-screen bg-zinc-100/80 flex flex-col relative', pbClass, className)} {...props}>
			{/* H5 二级页自动吸顶返回导航栏（小程序端不渲染，直接使用官方原生 Header） */}
			{shouldShowH5Nav && (
				<View className="sticky top-0 z-30 h-11 bg-white/95 backdrop-blur-md border-b border-zinc-100/80 flex items-center justify-between px-3 shrink-0">
					<View className="w-16 flex items-center">
						<View
							onClick={handleBack}
							className="size-8 -ml-1 rounded-full flex items-center justify-center active:bg-zinc-100 transition-colors cursor-pointer"
						>
							<View
								className={cn(
									'size-5 text-zinc-800',
									canGoBack ? 'icon-[ph--caret-left-bold]' : 'icon-[ph--house]',
								)}
							/>
						</View>
					</View>

					<Text className="flex-1 text-center text-sm font-semibold truncate px-2">{activeTitle}</Text>

					<View className="w-16 flex items-center justify-end">{navExtra}</View>
				</View>
			)}

			{header}

			{/* 主内容区 */}
			{loading ? (
				<View className="flex-1 flex items-center justify-center py-20">
					<Loading title="页面加载中..." />
				</View>
			) : (
				<View className={cn('flex-1 flex flex-col', paddingX && 'container-x')}>{children}</View>
			)}

			{showQuickMenu && <FloatQuickMenu />}
		</View>
	);
}
