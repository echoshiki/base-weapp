import { PageQuery } from '@/types/common';

/** 反馈类型 */
export type FeedbackType = 'bug' | 'suggestion' | 'complaint' | 'other';

/** 反馈处理状态 */
export type FeedbackStatus = 'pending' | 'processing' | 'replied';

/** 提交反馈请求 */
export interface CreateFeedbackRequest {
	/** 反馈类型 */
	type: FeedbackType;
	/** 反馈详细内容 */
	content: string;
	/** 凭证图片 URL 列表 */
	images?: string[];
	/** 联系方式（手机号或微信号，选填） */
	contact?: string;
}

/** 反馈记录条目 */
export interface FeedbackItem {
	id: string;
	type: FeedbackType;
	typeLabel?: string;
	status: FeedbackStatus;
	content: string;
	images?: string[];
	contact?: string;
	/** 官方处理回复 */
	reply?: string;
	/** 回复时间 */
	replyTime?: string;
	/** 提交时间 */
	createTime: string;
}

/** 反馈列表查询参数 */
export interface FeedbackListQuery extends PageQuery {
	status?: FeedbackStatus;
}

export const FEEDBACK_TYPE_OPTIONS: { label: string; value: FeedbackType }[] = [
	{ label: '功能建议', value: 'suggestion' },
	{ label: '异常报错', value: 'bug' },
	{ label: '服务投诉', value: 'complaint' },
	{ label: '其他问题', value: 'other' },
];

export const FEEDBACK_STATUS_META: Record<
	FeedbackStatus,
	{ label: string; variant: 'amber' | 'blue' | 'emerald' }
> = {
	pending: { label: '待处理', variant: 'amber' },
	processing: { label: '处理中', variant: 'blue' },
	replied: { label: '已回复', variant: 'emerald' },
};
