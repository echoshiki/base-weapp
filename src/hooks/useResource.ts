import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Taro from '@tarojs/taro';
import {
	deleteChainResourceAPI,
	getChainResourceCategoryListAPI,
	getChainResourceDetailAPI,
	getChainResourceListAPI,
	getHomeDataAPI,
	getKnowledgeDetailAPI,
	getKnowledgeListAPI,
	getPolicyDetailAPI,
	getPolicyListAPI,
	updateChainResourceAPI,
} from '@/services/resource';
import { UpdateChainResourceRequest } from '@/types/resource';

/**
 * 补全资源图片路径（兼容相对路径与完整 URL）
 */
export const resolveResourcePhotoUrl = (path?: string) => {
	if (!path) return '';
	const trimmed = path.trim();
	if (!trimmed) return '';
	if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
	const baseUrl = process.env.TARO_APP_API || '';
	return `${baseUrl}${trimmed}`;
};

/**
 * 解析逗号分隔的多图地址为数组
 */
export const parseResourcePhotoList = (zyPhoto?: string): string[] => {
	if (!zyPhoto) return [];
	return zyPhoto
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
};

/**
 * 获取链资源分类列表 (GET /demand/lzyfl/list1)
 */
export const useChainResourceCategoryList = () => {
	return useQuery({
		queryKey: ['resource', 'categories'],
		queryFn: async () => {
			const res = await getChainResourceCategoryListAPI();
			return res.rows || [];
		},
		staleTime: 5 * 60 * 1000,
	});
};

/**
 * 无限分页获取链资源列表 (GET /demand/lzy/list)
 * @param all 综合搜索（资源名称，地点）
 * @param categoryId 资源分类主键
 * @param pageSize 每页条数，默认 10
 */
export const useInfiniteChainResourceList = (
	all?: string,
	categoryId?: string,
	pageSize = 10,
) => {
	const keyword = all?.trim() || undefined;
	const catId = categoryId?.trim() || undefined;

	return useInfiniteQuery({
		queryKey: ['resource', 'list', keyword, catId, pageSize],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await getChainResourceListAPI({
				pageNum: pageParam,
				pageSize,
				all: keyword,
				categoryId: catId,
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
 * 获取链资源详情 (GET /demand/lzy/{zyId})
 */
export const useChainResourceDetail = (zyId?: string) => {
	return useQuery({
		queryKey: ['resource', 'detail', zyId],
		queryFn: async () => {
			const res = await getChainResourceDetailAPI(zyId!);
			return res.data || null;
		},
		enabled: !!zyId,
	});
};

/**
 * 修改链资源 (PUT /demand/lzy) - 管理员限定
 */
export const useUpdateChainResource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateChainResourceRequest) => updateChainResourceAPI(data),
		onSuccess: (res, variables) => {
			Taro.showToast({ title: res.msg || '修改成功', icon: 'success' });
			queryClient.invalidateQueries(['resource', 'list']);
			if (variables.zyId) {
				queryClient.invalidateQueries(['resource', 'detail', variables.zyId]);
			}
		},
	});
};

/**
 * 删除链资源 (DELETE /demand/lzy/{zyId}) - 管理员限定
 */
export const useDeleteChainResource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (zyId: string) => deleteChainResourceAPI(zyId),
		onSuccess: (res, zyId) => {
			Taro.showToast({ title: res.msg || '删除成功', icon: 'success' });
			queryClient.invalidateQueries(['resource', 'list']);
			queryClient.removeQueries(['resource', 'detail', zyId]);
		},
	});
};

/**
 * 解析逗号分隔的分类标签为数组
 */
export const parsePolicyCategories = (category?: string): string[] => {
	if (!category) return [];
	return category
		.split(/[,，]/)
		.map((s) => s.trim())
		.filter(Boolean);
};

/**
 * 富文本 HTML 格式化（图片自适应屏幕宽度）
 */
export const formatRichHtml = (html?: string): string => {
	if (!html) return '';
	return html
		.replace(/<img[^>]*>/gi, (match) => {
			return match.replace(/style="[^"]*"/gi, '').replace(/style='[^']*'/gi, '');
		})
		.replace(
			/<img/gi,
			'<img style="max-width:100%;height:auto;display:block;margin:12px 0;border-radius:10px;"',
		);
};

/**
 * 无限分页获取政策文件列表 (GET /demand/zcwj/list)
 */
export const useInfinitePolicyList = (bbTitle?: string, pageSize = 10, enabled = true) => {
	const keyword = bbTitle?.trim() || undefined;

	return useInfiniteQuery({
		queryKey: ['policy', 'list', keyword, pageSize],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await getPolicyListAPI({
				pageNum: pageParam,
				pageSize,
				bbTitle: keyword,
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
		enabled,
	});
};

/**
 * 获取政策文件详情 (GET /demand/zcwj/{id})
 */
export const usePolicyDetail = (id?: string | number) => {
	return useQuery({
		queryKey: ['policy', 'detail', id],
		queryFn: async () => {
			const res = await getPolicyDetailAPI(id!);
			return res.data || null;
		},
		enabled: !!id,
	});
};

/**
 * 无限分页获取知识科普列表 (GET /demand/zskp/list)
 */
export const useInfiniteKnowledgeList = (title?: string, pageSize = 10, enabled = true) => {
	const keyword = title?.trim() || undefined;

	return useInfiniteQuery({
		queryKey: ['knowledge', 'list', keyword, pageSize],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await getKnowledgeListAPI({
				pageNum: pageParam,
				pageSize,
				title: keyword,
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
		enabled,
	});
};

/**
 * 获取知识科普详情 (GET /demand/zskp/{articleId})
 */
export const useKnowledgeDetail = (articleId?: string) => {
	return useQuery({
		queryKey: ['knowledge', 'detail', articleId],
		queryFn: async () => {
			const res = await getKnowledgeDetailAPI(articleId!);
			return res.data || null;
		},
		enabled: !!articleId,
	});
};

/**
 * 获取首页轮播图与展示内容 (GET /demand/home/list)
 */
export const useHomeData = () => {
	return useQuery({
		queryKey: ['home', 'data'],
		queryFn: async () => {
			const res = await getHomeDataAPI();
			const first = res.rows?.[0];
			const photos = parseResourcePhotoList(first?.homePhoto)
				.map(resolveResourcePhotoUrl)
				.filter(Boolean);
			return {
				photos,
				total: first?.total || '',
			};
		},
		staleTime: 60 * 1000,
	});
};
