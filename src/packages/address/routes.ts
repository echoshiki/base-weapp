/**
 * 地址管理模块路由与分包声明
 * 纯静态常量文件（禁止引入 Taro / React），供 app.config.ts 与业务代码共同引用
 */
export const ADDRESS_ROUTES = {
	/** 收货地址列表页（支持 ?mode=select&selectedId=xxx 选择模式） */
	list: '/packages/address/pages/list/index',
	/** 新增 / 编辑收货地址页（编辑传 ?id=xxx） */
	form: '/packages/address/pages/form/index',
} as const;

/**
 * 跨模块事件名（选择模式下通过 Taro.eventCenter 回传选中地址，避免模块间直接耦合）
 */
export const ADDRESS_EVENTS = {
	selected: 'address:selected',
} as const;

export const addressSubPackage = {
	root: 'packages/address',
	pages: ['pages/list/index', 'pages/form/index'],
};
