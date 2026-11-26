import { http } from '@/utils/http';
import { BaseResponse, PageData } from '@/types/common';
import { CreateFeedbackRequest, FeedbackItem, FeedbackListQuery } from './types';

/**
 * 提交意见反馈
 * POST /feedback/submit
 */
export const submitFeedbackAPI = (data: CreateFeedbackRequest) =>
	http.post<BaseResponse<{ id: string }>>('/feedback/submit', data);

/**
 * 获取我的反馈列表
 * GET /feedback/list
 */
export const getFeedbackListAPI = (params?: FeedbackListQuery) =>
	http.get<BaseResponse<PageData<FeedbackItem>>>('/feedback/list', params);

/**
 * 获取反馈详情
 * GET /feedback/detail
 */
export const getFeedbackDetailAPI = (id: string) => http.get<BaseResponse<FeedbackItem>>('/feedback/detail', { id });
