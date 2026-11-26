import { http } from '@/utils/http';
import { BaseResponse, PageData } from '@/types/common';
import { MessageItem, MessageListQuery, UnreadCountData } from './types';

/**
 * 获取消息分页列表
 * GET /message/list
 */
export const getMessageListAPI = (params?: MessageListQuery) =>
	http.get<BaseResponse<PageData<MessageItem>>>('/message/list', params);

/**
 * 获取消息详情
 * GET /message/detail
 */
export const getMessageDetailAPI = (id: string) => http.get<BaseResponse<MessageItem>>('/message/detail', { id });

/**
 * 获取未读消息数（静默请求，不打扰用户）
 * GET /message/unread-count
 */
export const getUnreadCountAPI = () =>
	http.get<BaseResponse<UnreadCountData>>('/message/unread-count', undefined, { silent: true });

/**
 * 标记单条消息已读
 * PUT /message/read
 */
export const markMessageReadAPI = (id: string) => http.put<BaseResponse<null>>('/message/read', { id }, { silent: true });

/**
 * 一键全部已读
 * PUT /message/read-all
 */
export const markAllMessagesReadAPI = () => http.put<BaseResponse<null>>('/message/read-all');
