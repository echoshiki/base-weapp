import { http } from '@/utils/http';
import { BaseResponse, DataResponse, TableDataInfo } from '@/types/common';
import {
	ChainResourceCategoryItem,
	ChainResourceItem,
	ChainResourceListParams,
	HomeDataItem,
	KnowledgeItem,
	KnowledgeListParams,
	PolicyItem,
	PolicyListParams,
	UpdateChainResourceRequest,
} from '@/types/resource';

/**
 * 查询链资源分类列表（不分页）
 * GET /demand/lzyfl/list1
 */
export const getChainResourceCategoryListAPI = () =>
	http.get<TableDataInfo<ChainResourceCategoryItem>>('/demand/lzyfl/list1');

/**
 * 查询链资源列表
 * GET /demand/lzy/list
 */
export const getChainResourceListAPI = (params?: ChainResourceListParams) =>
	http.get<TableDataInfo<ChainResourceItem>>('/demand/lzy/list', params);

/**
 * 查询链资源详情
 * GET /demand/lzy/{zyId}
 */
export const getChainResourceDetailAPI = (zyId: string) =>
	http.get<DataResponse<ChainResourceItem>>(`/demand/lzy/${zyId}`);

/**
 * 修改链资源
 * PUT /demand/lzy
 */
export const updateChainResourceAPI = (data: UpdateChainResourceRequest) =>
	http.put<BaseResponse>('/demand/lzy', data);

/**
 * 删除链资源
 * DELETE /demand/lzy/{zyId}
 */
export const deleteChainResourceAPI = (zyId: string) =>
	http.delete<BaseResponse>(`/demand/lzy/${zyId}`);

/**
 * 查询政策文件列表
 * GET /demand/zcwj/list
 */
export const getPolicyListAPI = (params?: PolicyListParams) =>
	http.get<TableDataInfo<PolicyItem>>('/demand/zcwj/list', params);

/**
 * 查询政策文件详情
 * GET /demand/zcwj/{id}
 */
export const getPolicyDetailAPI = (id: number | string) =>
	http.get<DataResponse<PolicyItem>>(`/demand/zcwj/${id}`);

/**
 * 查询知识科普列表
 * GET /demand/zskp/list
 */
export const getKnowledgeListAPI = (params?: KnowledgeListParams) =>
	http.get<TableDataInfo<KnowledgeItem>>('/demand/zskp/list', params);

/**
 * 查询知识科普详情
 * GET /demand/zskp/{articleId}
 */
export const getKnowledgeDetailAPI = (articleId: string) =>
	http.get<DataResponse<KnowledgeItem>>(`/demand/zskp/${articleId}`);

/**
 * 查询首页数据（轮播图与统计）
 * GET /demand/home/list
 */
export const getHomeDataAPI = () =>
	http.get<TableDataInfo<HomeDataItem>>('/demand/home/list');
