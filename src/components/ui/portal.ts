import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * H5 端将全局浮层（Drawer / Dialog / ImagePreview）传送至 document.body，
 * 彻底脱离 Taro H5 路由页面 (.taro_page z-index: 0) 与 .taro-tabbar__panel (overflow: hidden) 的层叠上下文限制；
 * 小程序端原样返回，无任何额外开销。
 */
export function renderPortal(node: ReactNode): ReactNode {
	if (process.env.TARO_ENV === 'h5' && typeof document !== 'undefined' && document.body) {
		return createPortal(node, document.body);
	}
	return node;
}
