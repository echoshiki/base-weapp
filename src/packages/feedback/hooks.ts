import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFeedbackDetailAPI, getFeedbackListAPI, submitFeedbackAPI } from './services';
import { CreateFeedbackRequest, FeedbackListQuery } from './types';

/** 提交意见反馈 */
export const useSubmitFeedback = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateFeedbackRequest) => {
			const res = await submitFeedbackAPI(data);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['feedback', 'list']);
		},
	});
};

/** 获取我的反馈分页列表 */
export const useFeedbackList = (params: FeedbackListQuery) => {
	return useQuery({
		queryKey: ['feedback', 'list', params],
		queryFn: async () => {
			const res = await getFeedbackListAPI(params);
			return res.data;
		},
		keepPreviousData: true,
	});
};

/** 获取反馈详情 */
export const useFeedbackDetail = (id?: string) => {
	return useQuery({
		queryKey: ['feedback', 'detail', id],
		queryFn: async () => {
			if (!id) return null;
			const res = await getFeedbackDetailAPI(id);
			return res.data;
		},
		enabled: Boolean(id),
	});
};
