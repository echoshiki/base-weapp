import { http } from '@/utils/http';
import { DataResponse, TableDataInfo } from '@/types/common';
import { EnterpriseHonorItem, EnterpriseItem, EnterpriseListParams } from '@/types/enterprise';

/**
 * 查询企业荣誉数量列表
 * GET /demand/cn/honorList
 */
export const getEnterpriseHonorListAPI = () =>
	http.get<TableDataInfo<EnterpriseHonorItem>>('/demand/cn/honorList');

/**
 * 查询企业信息列表
 * GET /demand/cn/list
 */
export const getEnterpriseListAPI = (params?: EnterpriseListParams) =>
	http.get<TableDataInfo<EnterpriseItem>>('/demand/cn/list', params);

/**
 * 查询企业信息详情
 * GET /demand/cn/{entId}
 */
export const getEnterpriseDetailAPI = (entId: string) =>
	http.get<DataResponse<EnterpriseItem>>(`/demand/cn/${entId}`);
