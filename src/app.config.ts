export default defineAppConfig({
	pages: [
		'pages/home/index',
		'pages/user/index',
		'pages/user/profile/index',
		'pages/article/index',
		'pages/article/detail/index',
		'pages/common/agreement/index',
		'pages/login/index',
	],
	window: {
		backgroundTextStyle: 'light',
		navigationBarBackgroundColor: '#fff',
		navigationBarTitleText: 'WeChat',
		navigationBarTextStyle: 'black',
	},
	tabBar: {
		list: [
			{
				iconPath: 'assets/tabbar/home.png',
				selectedIconPath: 'assets/tabbar/home_fill.png',
				pagePath: 'pages/home/index',
				text: '首页',
			},
			{
				iconPath: 'assets/tabbar/user.png',
				selectedIconPath: 'assets/tabbar/user_fill.png',
				pagePath: 'pages/user/index',
				text: '我的',
			},
		],
		color: '#3a3a3a',
		selectedColor: '#000000',
		backgroundColor: '#fff',
		borderStyle: 'white',
	},
});
