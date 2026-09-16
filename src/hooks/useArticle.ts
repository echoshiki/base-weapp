import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
	getArticleListAPI,
	getArticleDetailAPI,
	ArticleListParams,
} from '@/services/article';

/**
 * 获取文章列表 Hook (普通 Query)
 */
export const useArticleList = (params?: ArticleListParams) => {
	return useQuery({
		queryKey: ['articleList', params],
		queryFn: () => getArticleListAPI(params),
	});
};

/**
 * 获取文章列表 Hook (无限滚动下拉加载)
 * @param pageSize 每页条数，默认 10
 */
export const useInfiniteArticleList = (pageSize = 10) => {
	return useInfiniteQuery({
		queryKey: ['infiniteArticleList', { pageSize }],
		queryFn: ({ pageParam = 1 }) => getArticleListAPI({ pageNum: pageParam, pageSize }),
		getNextPageParam: (lastPage) => {
			if (!lastPage) return undefined;
			const page = Number(lastPage.page);
			const totalPage = Number(lastPage.totalPage);
			if (page >= totalPage) return undefined;
			return page + 1;
		},
	});
};

/**
 * 获取文章详情 Hook
 * @param articleId 文章 ID
 */
export const useArticleDetail = (articleId?: number) => {
	return useQuery({
		queryKey: ['articleDetail', articleId],
		queryFn: () => getArticleDetailAPI(articleId!),
		enabled: !!articleId,
	});
};
