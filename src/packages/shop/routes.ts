/**
 * 电商模块路由与分包声明
 * 纯静态常量文件（禁止引入 Taro / React），供 app.config.ts 与业务代码共同引用
 */
export const SHOP_ROUTES = {
	/** 商品列表页 */
	goodsList: '/packages/shop/pages/goods-list/index',
	/** 商品详情页（传 ?id=xxx） */
	goodsDetail: '/packages/shop/pages/goods-detail/index',
	/** 购物车页 */
	cart: '/packages/shop/pages/cart/index',
	/** 确认订单页（传 ?mode=cart&cartIds=... 或 ?mode=buy_now&goodsId=...&skuId=...&quantity=...） */
	checkout: '/packages/shop/pages/checkout/index',
	/** 我的订单列表页（可选 ?status=pending_pay） */
	orderList: '/packages/shop/pages/order-list/index',
	/** 订单详情页（传 ?id=xxx） */
	orderDetail: '/packages/shop/pages/order-detail/index',
} as const;

export const shopSubPackage = {
	root: 'packages/shop',
	pages: [
		'pages/goods-list/index',
		'pages/goods-detail/index',
		'pages/cart/index',
		'pages/checkout/index',
		'pages/order-list/index',
		'pages/order-detail/index',
	],
};
