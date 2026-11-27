/**
 * 电商模块路由与分包声明
 * 纯静态常量文件（禁止引入 Taro / React），供 app.config.ts 与业务代码共同引用
 */
export const SHOP_ROUTES = {
	/** 商品列表页 */
	goodsList: '/packages/shop/pages/goods-list/index',
	/** 商品详情页（传 ?id=xxx） */
	goodsDetail: '/packages/shop/pages/goods-detail/index',
} as const;

export const shopSubPackage = {
	root: 'packages/shop',
	pages: ['pages/goods-list/index', 'pages/goods-detail/index'],
};
