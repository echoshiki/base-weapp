import { PageQuery } from '@/types/common';

/** 文章分类 */
export interface ArticleCategory {
	id: string;
	name: string;
}

/** 文章列表项 */
export interface ArticleItem {
	id: string;
	title: string;
	summary?: string;
	cover?: string;
	categoryId?: string;
	categoryName?: string;
	author?: string;
	publishTime?: string;
	views?: number;
}

/** 文章详情 */
export interface ArticleDetail extends ArticleItem {
	/** 富文本 HTML 或纯文本正文 */
	content: string;
}

/** 文章列表查询参数 */
export interface ArticleListQuery extends PageQuery {
	categoryId?: string;
	keyword?: string;
}
