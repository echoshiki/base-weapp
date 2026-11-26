import { View, Text } from '@tarojs/components';
import { Card, Icon, Badge } from '@/components/ui';
import { cn } from '@/utils/common';
import { MESSAGE_TYPE_META, MessageItem } from '../types';

export interface MessageCardProps {
	item: MessageItem;
	onClick?: (item: MessageItem) => void;
}

/**
 * 消息通知卡片组件（区分未读红点与已读弱化态）
 */
export function MessageCard({ item, onClick }: MessageCardProps) {
	const meta = MESSAGE_TYPE_META[item.type] || MESSAGE_TYPE_META.business;

	return (
		<Card
			layout="horizontal"
			className={cn('py-3.5 items-start', item.isRead && 'opacity-70')}
			onClick={() => onClick?.(item)}
		>
			{/* 左侧类型图标 + 未读红点 */}
			<View className="relative shrink-0">
				<Icon icon={meta.icon} shape="square" size="md" theme={meta.theme} />
				{!item.isRead && (
					<View className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-rose-500 border-2 border-white" />
				)}
			</View>

			{/* 右侧消息主体 */}
			<View className="flex-1 min-w-0 flex flex-col gap-1.5">
				<View className="flex items-center justify-between gap-2">
					<Text className={cn('text-sm truncate flex-1', item.isRead ? 'font-medium' : 'font-bold')}>
						{item.title}
					</Text>
				</View>

				<Text className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
					{item.summary || item.content}
				</Text>

				<View className="flex items-center justify-between pt-0.5">
					<View className="flex items-center gap-2">
						<Badge variant={meta.theme}>{meta.label}</Badge>
						{!item.isRead && <Text className="text-xs text-primary font-medium">未读</Text>}
					</View>
					<Text className="text-xs text-zinc-400 shrink-0">{item.createTime.slice(5, 16)}</Text>
				</View>
			</View>
		</Card>
	);
}
