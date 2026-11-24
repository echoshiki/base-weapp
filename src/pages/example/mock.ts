/**
 * 示例组件全局通用测试/Mock 数据集
 * 用于 UI 组件预览页展示与用例演示
 */

export interface BannerMockItem {
	id: number;
	title: string;
	pic: string;
	url?: string;
}

export const MOCK_BANNERS: BannerMockItem[] = [
	{
		id: 1,
		title: '夏季限时特惠活动',
		pic: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
		url: '/pages/home/index',
	},
	{
		id: 2,
		title: '全新优质服务上线',
		pic: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80',
		url: '/pages/home/index',
	},
	{
		id: 3,
		title: '新手专属立减礼包',
		pic: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&auto=format&fit=crop&q=80',
		url: '/pages/home/index',
	},
];

export const MOCK_USER = {
	id: 'u_1001',
	name: '张三',
	avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
	role: 'VIP 高级会员',
	phone: '138****8888',
	status: 'online',
};

export const MOCK_TABS = [
	{ label: '全部动态', value: 'all' },
	{ label: '进行中', value: 'progress' },
	{ label: '已完成', value: 'completed' },
	{ label: '审核中', value: 'pending' },
];

export const MOCK_CARD_ITEM = {
	id: 101,
	title: '高级品牌奢品鉴定与评估服务',
	desc: '提供权威正品鉴定、市场行情预估及一站式上门估价服务。',
	tag: '热门推荐',
	time: '2026-07-29',
};
