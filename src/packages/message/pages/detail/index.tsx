import { View, Text } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { useEffect, useRef } from 'react';
import { Page, Card, Badge, Divider, Skeleton, Empty, Button, Icon } from '@/components/ui';
import { mapsTo } from '@/utils/common';
import { useMarkMessageRead, useMessageDetail } from '../../hooks';
import { MESSAGE_TYPE_META } from '../../types';

export default function MessageDetailPage() {
	const { params } = useRouter();
	const id = params.id ? decodeURIComponent(params.id) : '';
	const { data: detail, isLoading } = useMessageDetail(id);
	const { mutate: markRead } = useMarkMessageRead();
	const markedRef = useRef(false);

	// 进入详情页自动将未读消息标为已读
	useEffect(() => {
		if (!detail || detail.isRead || markedRef.current) return;
		markedRef.current = true;
		markRead(detail.id);
	}, [detail, markRead]);

	const meta = detail ? MESSAGE_TYPE_META[detail.type] || MESSAGE_TYPE_META.business : null;

	return (
		<Page title="消息详情" className="gap-4">
			{isLoading ? (
				<Card className="gap-3">
					<View className="flex items-center gap-2">
						<Skeleton className="h-5 w-16" />
						<Skeleton className="h-4 w-28" />
					</View>
					<Skeleton className="h-6 w-3/4" />
					<Divider />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</Card>
			) : !detail || !meta ? (
				<Empty title="消息不存在或已删除" subTitle="请返回消息列表查看其他通知" />
			) : (
				<View className="flex flex-col gap-5">
					<Card className="gap-3">
						<View className="flex items-center justify-between gap-2">
							<View className="flex items-center gap-2">
								<Icon icon={meta.icon} shape="square" size="sm" theme={meta.theme} />
								<Badge variant={meta.theme}>{meta.label}</Badge>
							</View>
							<Text className="text-xs text-zinc-400">{detail.createTime}</Text>
						</View>

						<Text className="text-lg font-bold leading-snug">{detail.title}</Text>

						<Divider />

						<Text className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
							{detail.content}
						</Text>
					</Card>

					{detail.targetUrl && (
						<Button
							size="lg"
							block
							variant="primary"
							icon="icon-[ph--arrow-square-out]"
							onClick={() => mapsTo(detail.targetUrl!)}
						>
							查看关联详情
						</Button>
					)}
				</View>
			)}
		</Page>
	);
}
