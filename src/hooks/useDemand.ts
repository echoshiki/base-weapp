import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Taro from '@tarojs/taro';
import {
	addAppealAPI,
	deleteAppealAPI,
	getAppealDetailAPI,
	getAppealListAPI,
	getAppealTrackingDetailAPI,
	getAppealTrackingListAPI,
	getAppealTrackingRecordsAPI,
	getAppealTypeListAPI,
	updateAppealAPI,
} from '@/services/demand';
import { AddAppealRequest, TrackingStatus, UpdateAppealRequest } from '@/types/demand';
import { BadgeVariant } from '@/components/ui/Badge';

/** 诉求类别标签轮换配色（避免默认灰色单调，与企业徽章 blue 错开起始色） */
export const APPEAL_TAG_COLORS: readonly BadgeVariant[] = [
	'sky',
	'indigo',
	'emerald',
	'amber',
	'orange',
	'rose',
	'blue',
];

export const getAppealTagColor = (index: number): BadgeVariant =>
	APPEAL_TAG_COLORS[index % APPEAL_TAG_COLORS.length];

/** 诉求跟踪状态展示元数据（0 待处理，1 处理中，2 已完成） */
export const TRACKING_STATUS_META: Record<TrackingStatus, { label: string; variant: BadgeVariant; icon: string }> = {
	0: {
		label: '待处理',
		variant: 'blue',
		icon: 'icon-[ph--hourglass-medium-duotone]',
	},
	1: {
		label: '处理中',
		variant: 'amber',
		icon: 'icon-[ph--spinner-gap-duotone]',
	},
	2: {
		label: '已完成',
		variant: 'emerald',
		icon: 'icon-[ph--check-circle-duotone]',
	},
};

/**
 * 获取诉求类别列表及 ID -> Name 映射 (GET /demand/sqlb/list1)
 */
export const useAppealTypeList = () => {
	const query = useQuery({
		queryKey: ['demand', 'appealTypes'],
		queryFn: async () => {
			const res = await getAppealTypeListAPI();
			return res.rows || [];
		},
		staleTime: 5 * 60 * 1000,
	});

	const typeMap = useMemo(() => {
		const map = new Map<string, string>();
		(query.data || []).forEach((item) => {
			if (item.typeId) {
				map.set(item.typeId, item.typeName);
			}
		});
		return map;
	}, [query.data]);

	return {
		...query,
		typeMap,
	};
};

/**
 * 解析诉求类别标签列表（优先使用 typeName，缺失时通过 typeId + typeMap 兜底）
 */
export const resolveAppealTypeTags = (typeName?: string, typeId?: string, typeMap?: Map<string, string>): string[] => {
	if (typeName) {
		return typeName
			.split(/[,，、;；]/)
			.map((s) => s.trim())
			.filter(Boolean);
	}
	if (typeId && typeMap) {
		return typeId
			.split(/[,，]/)
			.map((id) => typeMap.get(id.trim()) || '')
			.filter(Boolean);
	}
	return [];
};

/**
 * 无限分页获取企业诉求列表 (GET /demand/qysq/list)
 * @param all 综合搜索（诉求标题、详细描述、企业名称）
 * @param pageSize 每页条数，默认 10
 */
export const useInfiniteAppealList = (all?: string, pageSize = 10, enabled = true) => {
	const keyword = all?.trim() || undefined;

	return useInfiniteQuery({
		queryKey: ['demand', 'appealList', keyword, pageSize],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await getAppealListAPI({
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
		enabled,
	});
};

/**
 * 获取企业诉求详情 (GET /demand/qysq/{requId})
 */
export const useAppealDetail = (requId?: string) => {
	return useQuery({
		queryKey: ['demand', 'appealDetail', requId],
		queryFn: async () => {
			const res = await getAppealDetailAPI(requId!);
			return res.data || null;
		},
		enabled: !!requId,
	});
};

/**
 * 无限分页获取诉求跟踪列表 (GET /demand/sqgz/listQySqgzVO)
 * @param status 处理状态（0 待处理，1 处理中，2 已完成，undefined 全部）
 * @param all 综合搜索（企业名称，标题，处理描述）
 * @param pageSize 每页条数，诉求跟踪默认 5
 */
export const useInfiniteAppealTrackingList = (
	status?: TrackingStatus,
	all?: string,
	pageSize = 5,
	enabled = true,
) => {
	const keyword = all?.trim() || undefined;

	return useInfiniteQuery({
		queryKey: ['demand', 'trackingList', status ?? 'all', keyword, pageSize],
		queryFn: async ({ pageParam = 1 }) => {
			const res = await getAppealTrackingListAPI({
				pageNum: pageParam,
				pageSize,
				status,
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
		enabled,
	});
};

/**
 * 获取诉求跟踪详情 (GET /demand/sqgz/{statusId})
 */
export const useAppealTrackingDetail = (statusId?: string) => {
	return useQuery({
		queryKey: ['demand', 'trackingDetail', statusId],
		queryFn: async () => {
			const res = await getAppealTrackingDetailAPI(statusId!);
			return res.data || null;
		},
		enabled: !!statusId,
	});
};

/**
 * 获取诉求跟踪进度记录列表 (GET /sqgzjl/sqgzjl/list)
 */
export const useAppealTrackingRecords = (requId?: string) => {
	return useQuery({
		queryKey: ['demand', 'trackingRecords', requId],
		queryFn: async () => {
			const res = await getAppealTrackingRecordsAPI(requId!);
			return Array.isArray(res.data) ? res.data : [];
		},
		enabled: !!requId,
	});
};

/**
 * 新增企业诉求 (POST /enterprise/addAppeal) - 企业端限定
 */
export const useAddAppeal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: AddAppealRequest) => addAppealAPI(data),
		onSuccess: (res) => {
			Taro.showToast({ title: res.msg || '发布成功', icon: 'success' });
			queryClient.invalidateQueries(['demand', 'appealList']);
		},
	});
};

/**
 * 修改企业诉求 (PUT /enterprise/uploadAppeal) - 企业端限定
 */
export const useUpdateAppeal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateAppealRequest) => updateAppealAPI(data),
		onSuccess: (res, variables) => {
			Taro.showToast({ title: res.msg || '修改成功', icon: 'success' });
			queryClient.invalidateQueries(['demand', 'appealList']);
			if (variables.requId) {
				queryClient.invalidateQueries(['demand', 'appealDetail', variables.requId]);
			}
		},
	});
};

/**
 * 删除企业诉求 (DELETE /enterprise/{requId}) - 企业端限定
 */
export const useDeleteAppeal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (requId: string) => deleteAppealAPI(requId),
		onSuccess: (res, requId) => {
			Taro.showToast({ title: res.msg || '删除成功', icon: 'success' });
			queryClient.invalidateQueries(['demand', 'appealList']);
			queryClient.removeQueries(['demand', 'appealDetail', requId]);
		},
	});
};
