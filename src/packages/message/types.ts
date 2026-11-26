import { PageQuery } from '@/types/common';
import { UiColor } from '@/components/ui';

/** 消息分类：system-系统公告，business-业务通知 */
export type MessageType = 'system' | 'business';

/** 消息条目 */
export interface MessageItem {
	id: string;
	type: MessageType;
	title: string;
	summary?: string;
	content: string;
	/** 是否已读 */
	isRead: boolean;
	/** 可选关联业务跳转路由（如详情页路径） */
	targetUrl?: string;
	createTime: string;
}

/** 消息列表查询参数 */
export interface MessageListQuery extends PageQuery {
	type?: MessageType;
	unreadOnly?: boolean;
}

/** 未读消息数响应体 */
export interface UnreadCountData {
	count: number;
}

export const MESSAGE_TYPE_META: Record<MessageType, { label: string; icon: string; theme: UiColor }> = {
	system: {
		label: '系统公告',
		icon: 'icon-[ph--megaphone-duotone]',
		theme: 'amber',
	},
	business: {
		label: '业务通知',
		icon: 'icon-[ph--bell-ringing-duotone]',
		theme: 'primary',
	},
};
