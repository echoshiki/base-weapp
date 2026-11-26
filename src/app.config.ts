import { articleSubPackage } from './packages/article/routes';
import { feedbackSubPackage } from './packages/feedback/routes';
import { messageSubPackage } from './packages/message/routes';
import { addressSubPackage } from './packages/address/routes';

export default defineAppConfig({
	pages: [
		'pages/home/index',
		'pages/example/index',
		'pages/user/index',
		'pages/user/profile/index',
		'pages/login/index',
		'pages/login/register/index',
	],
	/**
	 * 热插拔业务模块（Taro 分包）
	 * 需要卸载某个模块时，直接删除 src/packages/<module> 目录并移除此处对应一行即可
	 */
	subPackages: [articleSubPackage, feedbackSubPackage, messageSubPackage, addressSubPackage],
	tabBar: {
		color: '#71717a',
		selectedColor: '#155dfc',
		list: [
			{
				pagePath: 'pages/home/index',
				text: '首页',
				iconPath: 'assets/tabbar/home.png',
				selectedIconPath: 'assets/tabbar/home_fill.png',
			},
			{
				pagePath: 'pages/example/index',
				text: '组件',
				iconPath: 'assets/tabbar/component.png',
				selectedIconPath: 'assets/tabbar/component_fill.png',
			},
			{
				pagePath: 'pages/user/index',
				text: '我的',
				iconPath: 'assets/tabbar/user.png',
				selectedIconPath: 'assets/tabbar/user_fill.png',
			},
		],
	},
	window: {
		backgroundTextStyle: 'light',
		navigationBarBackgroundColor: '#fff',
		navigationBarTitleText: 'Base Taro',
		navigationBarTextStyle: 'black',
	},
});
