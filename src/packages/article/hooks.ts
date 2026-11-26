import { useQuery } from '@tanstack/react-query';
import { getArticleCategoriesAPI, getArticleDetailAPI, getArticleListAPI } from './services';
import { ArticleListQuery } from './types';

/** 获取文章分类列表 */
export const useArticleCategories = () => {
	return useQuery({
		queryKey: ['article', 'categories'],
		queryFn: async () => {
			const res = await getArticleCategoriesAPI();
			return res.data || [];
		},
		staleTime: 10 * 60 * 1000,
	});
};

/** 获取文章分页列表 */
export const useArticleList = (params: ArticleListQuery) => {
	return useQuery({
		queryKey: ['article', 'list', params],
		queryFn: async () => {
			const res = await getArticleListAPI(params);
			return res.data;
		},
		keepPreviousData: true,
	});
};

/** 获取文章详情 */
export const useArticleDetail = (id?: string) => {
	return useQuery({
		queryKey: ['article', 'detail', id],
		queryFn: async () => {
			if (!id) return null;
			const res = await getArticleDetailAPI(id);
			return res.data;
		},
		enabled: Boolean(id),
	});
};
