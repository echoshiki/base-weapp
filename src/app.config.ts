export default defineAppConfig({
	pages: [
		'pages/home/index',
		'pages/example/index',
		'pages/user/index',
		'pages/user/profile/index',
		'pages/login/index',
		'pages/login/register/index',
	],
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
