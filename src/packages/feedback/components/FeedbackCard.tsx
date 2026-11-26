import { View, Text, Image } from '@tarojs/components';
import { Card, Badge } from '@/components/ui';
import { FEEDBACK_STATUS_META, FEEDBACK_TYPE_OPTIONS, FeedbackItem } from '../types';

export interface FeedbackCardProps {
	item: FeedbackItem;
	onClick?: (item: FeedbackItem) => void;
}

const getTypeLabel = (item: FeedbackItem) => {
	if (item.typeLabel) return item.typeLabel;
	return FEEDBACK_TYPE_OPTIONS.find((opt) => opt.value === item.type)?.label || '其他问题';
};

/**
 * 反馈记录卡片组件
 */
export function FeedbackCard({ item, onClick }: FeedbackCardProps) {
	const statusMeta = FEEDBACK_STATUS_META[item.status] || FEEDBACK_STATUS_META.pending;

	return (
		<Card className="py-4 gap-2.5" onClick={() => onClick?.(item)}>
			{/* 头部：类型与处理状态 */}
			<View className="flex items-center justify-between gap-2">
				<Badge variant="zinc">{getTypeLabel(item)}</Badge>
				<Badge variant={statusMeta.variant} dot>
					{statusMeta.label}
				</Badge>
			</View>

			{/* 正文摘要 */}
			<Text className="text-sm leading-relaxed line-clamp-2">{item.content}</Text>

			{/* 附带图片缩略图 */}
			{item.images && item.images.length > 0 && (
				<View className="flex items-center gap-2">
					{item.images.slice(0, 3).map((url, idx) => (
						<Image
							key={`${url}-${idx}`}
							src={url}
							mode="aspectFill"
							className="size-16 rounded-lg bg-zinc-100 shrink-0"
						/>
					))}
					{item.images.length > 3 && (
						<Text className="text-xs text-zinc-400">+{item.images.length - 3}</Text>
					)}
				</View>
			)}

			{/* 底部时间与回复摘要 */}
			<View className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs text-zinc-400">
				<Text>{item.createTime}</Text>
				<View className="flex items-center gap-1">
					<Text>{item.reply ? '已收到回复' : '查看进度'}</Text>
					<View className="icon-[ph--caret-right] size-3.5" />
				</View>
			</View>
		</Card>
	);
}
