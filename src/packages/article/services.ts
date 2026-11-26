import { http } from '@/utils/http';
import { BaseResponse, PageData } from '@/types/common';
import { ArticleCategory, ArticleDetail, ArticleItem, ArticleListQuery } from './types';

/**
 * 获取文章分类列表
 * GET /article/categories
 */
export const getArticleCategoriesAPI = () => http.get<BaseResponse<ArticleCategory[]>>('/article/categories');

/**
 * 获取文章分页列表
 * GET /article/list
 */
export const getArticleListAPI = (params?: ArticleListQuery) =>
	http.get<BaseResponse<PageData<ArticleItem>>>('/article/list', params);

/**
 * 获取文章详情
 * GET /article/detail
 */
export const getArticleDetailAPI = (id: string) => http.get<BaseResponse<ArticleDetail>>('/article/detail', { id });
