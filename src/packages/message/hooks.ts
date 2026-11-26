import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Taro from '@tarojs/taro';
import {
	getMessageDetailAPI,
	getMessageListAPI,
	getUnreadCountAPI,
	markAllMessagesReadAPI,
	markMessageReadAPI,
} from './services';
import { MessageListQuery } from './types';

/** 获取消息分页列表 */
export const useMessageList = (params: MessageListQuery) => {
	return useQuery({
		queryKey: ['message', 'list', params],
		queryFn: async () => {
			const res = await getMessageListAPI(params);
			return res.data;
		},
		keepPreviousData: true,
	});
};

/** 获取消息详情 */
export const useMessageDetail = (id?: string) => {
	return useQuery({
		queryKey: ['message', 'detail', id],
		queryFn: async () => {
			if (!id) return null;
			const res = await getMessageDetailAPI(id);
			return res.data;
		},
		enabled: Boolean(id),
	});
};

/** 获取未读消息数 */
export const useUnreadCount = (enabled = true) => {
	return useQuery({
		queryKey: ['message', 'unreadCount'],
		queryFn: async () => {
			const res = await getUnreadCountAPI();
			return res.data?.count ?? 0;
		},
		enabled,
		staleTime: 30 * 1000,
	});
};

/** 标记单条消息已读 */
export const useMarkMessageRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => markMessageReadAPI(id),
		onSuccess: () => {
			queryClient.invalidateQueries(['message', 'list']);
			queryClient.invalidateQueries(['message', 'unreadCount']);
		},
	});
};

/** 一键全部已读 */
export const useMarkAllMessagesRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => markAllMessagesReadAPI(),
		onSuccess: () => {
			Taro.showToast({ title: '已全部标为已读', icon: 'success' });
			queryClient.invalidateQueries(['message', 'list']);
			queryClient.invalidateQueries(['message', 'unreadCount']);
		},
	});
};
