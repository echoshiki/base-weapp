import Taro from '@tarojs/taro';
import { Page, PageProps } from '@/components/ui';
import { normalizeRoutePath, useSjcsConfig } from '@/hooks/useSjcsConfig';
import { UserHeader } from '../UserHeader';
import { InfoBanner } from '../InfoBanner';

export interface BizPageProps extends Omit<PageProps, 'header'> {
	/** 是否允许显示业务共用顶部用户信息头部（仍受后台 pages[].showHeader 控制），默认 true */
	showHeader?: boolean;
	/** 当后台 /enterprise/sjcs 未配置当前页面时，是否默认展示 UserHeader，默认 false */
	defaultShowHeader?: boolean;
}

const getActiveRoute = () => {
	const pages = Taro.getCurrentPages();
	const current = pages[pages.length - 1];
	if (current?.route) return current.route;
	return Taro.getCurrentInstance().router?.path || '';
};

/**
 * BizPage 业务内页容器（组合纯 UI Page、业务 UserHeader 与 InfoBanner，受 /enterprise/sjcs 单页配置控制）
 */
export function BizPage({ showHeader = true, defaultShowHeader = false, ...props }: BizPageProps) {
	const { pageMap } = useSjcsConfig();
	const currentKey = normalizeRoutePath(getActiveRoute());
	const pageConfig = currentKey ? pageMap.get(currentKey) : undefined;

	const showUserHeader = showHeader && (pageConfig ? Boolean(pageConfig.showHeader) : defaultShowHeader);
	const showInfoBanner = Boolean(pageConfig?.showInfo && pageConfig?.info?.length);

	const headerNode =
		showUserHeader || showInfoBanner ? (
			<>
				{showUserHeader && <UserHeader variant="compact" />}
				{showInfoBanner && <InfoBanner info={pageConfig?.info} />}
			</>
		) : undefined;

	return <Page header={headerNode} {...props} />;
}
