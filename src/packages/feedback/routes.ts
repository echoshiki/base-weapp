/**
 * Feedback 模块路由路径常量
 */
export const FEEDBACK_ROUTES = {
	form: '/packages/feedback/pages/form/index',
	list: '/packages/feedback/pages/list/index',
	detail: '/packages/feedback/pages/detail/index',
} as const;

/**
 * Taro 分包配置（在 src/app.config.ts 的 subPackages 中一行注册/卸载）
 */
export const feedbackSubPackage = {
	root: 'packages/feedback',
	pages: ['pages/form/index', 'pages/list/index', 'pages/detail/index'],
};
