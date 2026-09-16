import { http } from '@/utils/http';
import { PageRes } from '@/types/common';
import { ArticleItem } from '@/types/article';

/**
 * 文章列表查询参数
 * GET /article/list
 */
export interface ArticleListParams {
	/** 页码 */
	pageNum?: number;
	/** 每页条数 */
	pageSize?: number;
}

/**
 * 获取文章列表 (分页)
 * GET /article/list
 * @param params 分页参数
 */
export const getArticleListAPI = (params?: ArticleListParams) =>
	http.get<PageRes<ArticleItem>>('/article/list', params);

/**
 * 获取文章详情
 * GET /article/{articleId}
 * @param articleId 文章 ID
 */
export const getArticleDetailAPI = (articleId: number) =>
	http.get<ArticleItem>(`/article/${articleId}`);
