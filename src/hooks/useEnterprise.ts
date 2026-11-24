import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
	getEnterpriseDetailAPI,
	getEnterpriseHonorListAPI,
	getEnterpriseListAPI,
} from '@/services/enterprise';

/**
 * 获取企业认证称号数量列表 (GET /demand/cn/honorList)
 */
export const useEnterpriseHonorList = () => {
	return useQuery({
		queryKey: ['enterprise', 'honorList'],
		queryFn: async () => {
			const res = await getEnterpriseHonorListAPI();
			return res.rows || [];
		},
		staleTime: 60 * 1000,
	});
};

/**
 * 无限分页获取企业信息列表 (GET /demand/cn/list)
 * @param all 关键词（企业名称或荣誉名称）
 * @param pageSize 每页条数，默认 10
 */
export const useInfiniteEnterpriseList = (all?: string, pageSize = 10) => {
	const keyword = all?.trim() || undefined;

	return useInfiniteQuery({
		queryKey: ['enterprise', 'list', keyword, pageSize],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await getEnterpriseListAPI({
				pageNum: pageParam,
				pageSize,
				all: keyword,
			});
			return {
				list: res.rows || [],
				total: res.total || 0,
				pageNum: pageParam,
			};
		},
		getNextPageParam: (lastPage, allPages) => {
			const loadedCount = allPages.reduce((sum, page) => sum + page.list.length, 0);
			return loadedCount < lastPage.total ? lastPage.pageNum + 1 : undefined;
		},
	});
};

/**
 * 获取企业信息详情 (GET /demand/cn/{entId})
 */
export const useEnterpriseDetail = (entId?: string) => {
	return useQuery({
		queryKey: ['enterprise', 'detail', entId],
		queryFn: async () => {
			const res = await getEnterpriseDetailAPI(entId!);
			return res.data || null;
		},
		enabled: !!entId,
	});
};
