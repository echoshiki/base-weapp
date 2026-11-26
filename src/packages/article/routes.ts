/**
 * Article 模块路由路径常量（供外部或模块内跳转使用）
 */
export const ARTICLE_ROUTES = {
	list: '/packages/article/pages/list/index',
	detail: '/packages/article/pages/detail/index',
} as const;

/**
 * Taro 分包配置（在 src/app.config.ts 的 subPackages 中一行注册/卸载）
 */
export const articleSubPackage = {
	root: 'packages/article',
	pages: ['pages/list/index', 'pages/detail/index'],
};
