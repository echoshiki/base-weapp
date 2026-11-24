import { http } from '@/utils/http';
import { BaseResponse, DataResponse, TableDataInfo } from '@/types/common';
import {
	AddAppealRequest,
	AppealItem,
	AppealListParams,
	AppealTrackingItem,
	AppealTrackingListParams,
	AppealTrackingRecord,
	AppealTypeItem,
	UpdateAppealRequest,
} from '@/types/demand';

/**
 * 查询企业诉求列表
 * GET /demand/qysq/list
 */
export const getAppealListAPI = (params?: AppealListParams) =>
	http.get<TableDataInfo<AppealItem>>('/demand/qysq/list', params);

/**
 * 查询企业诉求详情
 * GET /demand/qysq/{requId}
 */
export const getAppealDetailAPI = (requId: string) =>
	http.get<DataResponse<AppealItem>>(`/demand/qysq/${requId}`);

/**
 * 查询诉求类别列表（不分页）
 * GET /demand/sqlb/list1
 */
export const getAppealTypeListAPI = () =>
	http.get<TableDataInfo<AppealTypeItem>>('/demand/sqlb/list1');

/**
 * 新增企业诉求
 * POST /enterprise/addAppeal
 */
export const addAppealAPI = (data: AddAppealRequest) =>
	http.post<BaseResponse>('/enterprise/addAppeal', data);

/**
 * 修改企业诉求
 * PUT /enterprise/uploadAppeal
 */
export const updateAppealAPI = (data: UpdateAppealRequest) =>
	http.put<BaseResponse>('/enterprise/uploadAppeal', data);

/**
 * 删除企业诉求
 * DELETE /enterprise/{requId}
 */
export const deleteAppealAPI = (requId: string) =>
	http.delete<BaseResponse>(`/enterprise/${requId}`);

/**
 * 查询诉求跟踪列表
 * GET /demand/sqgz/listQySqgzVO
 */
export const getAppealTrackingListAPI = (params?: AppealTrackingListParams) =>
	http.get<TableDataInfo<AppealTrackingItem>>('/demand/sqgz/listQySqgzVO', params);

/**
 * 查询诉求跟踪详情
 * GET /demand/sqgz/{statusId}
 */
export const getAppealTrackingDetailAPI = (statusId: string) =>
	http.get<DataResponse<AppealTrackingItem>>(`/demand/sqgz/${statusId}`);

/**
 * 查询诉求跟踪记录列表
 * GET /sqgzjl/sqgzjl/list
 */
export const getAppealTrackingRecordsAPI = (requId: string) =>
	http.get<DataResponse<AppealTrackingRecord[]>>('/sqgzjl/sqgzjl/list', { requId });
