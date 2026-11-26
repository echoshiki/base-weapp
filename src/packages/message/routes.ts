/**
 * Message 模块路由路径常量
 */
export const MESSAGE_ROUTES = {
	list: '/packages/message/pages/list/index',
	detail: '/packages/message/pages/detail/index',
} as const;

/**
 * Taro 分包配置（在 src/app.config.ts 的 subPackages 中一行注册/卸载）
 */
export const messageSubPackage = {
	root: 'packages/message',
	pages: ['pages/list/index', 'pages/detail/index'],
};
