import { useMemo } from 'react';
import Taro from '@tarojs/taro';

export interface NavInfo {
	statusBarHeight: number;
	menuButton: {
		top: number;
		height: number;
		bottom: number;
		right: number;
		left: number;
		width: number;
	};
	paddingLeft: number;
	gap: number;
	bottomGap: number;
	navBarHeight: number;
}

// 模块级单例缓存：在单次小程序运行期间只计算一次
let cachedNavInfo: NavInfo | null = null;

export function getNavInfo(): NavInfo {
	if (cachedNavInfo) return cachedNavInfo;

	const sysInfo = Taro.getSystemInfoSync();
	const statusBarHeight = sysInfo.statusBarHeight || 20;

	let menuButton = {
		top: statusBarHeight + 4,
		height: 32,
		bottom: statusBarHeight + 36,
		right: sysInfo.windowWidth - 7,
		left: sysInfo.windowWidth - 94,
		width: 87,
	};

	try {
		const rect = Taro.getMenuButtonBoundingClientRect();
		if (rect && rect.top && rect.height) {
			menuButton = rect;
		}
	} catch (e) {
		console.warn('getMenuButtonBoundingClientRect 异常，使用默认兜底', e);
	}

	const gap = Math.max(menuButton.top - statusBarHeight, 4);
	// 胶囊底部的留白高度
	const bottomGap = Math.max(gap, 10);
	// 整个导航栏的总包含高度
	const navBarHeight = menuButton.bottom + bottomGap;

	cachedNavInfo = {
		statusBarHeight,
		menuButton,
		paddingLeft: 16,
		gap,
		bottomGap,
		navBarHeight,
	};

	return cachedNavInfo;
}

export function useNavInfo() {
	return useMemo(() => getNavInfo(), []);
}
