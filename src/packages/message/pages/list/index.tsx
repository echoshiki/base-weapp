import { View, Text } from '@tarojs/components';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { Page, Tabs, Card, Skeleton, Empty, Button } from '@/components/ui';
import { mapsTo } from '@/utils/common';
import { useMarkAllMessagesRead, useMarkMessageRead, useMessageList, useUnreadCount } from '../../hooks';
import { MessageCard } from '../../components/MessageCard';
import { MESSAGE_ROUTES } from '../../routes';
import { MessageItem, MessageType } from '../../types';

type FilterType = '' | MessageType;

const PAGE_SIZE = 10;

const MESSAGE_TABS: { label: string; value: FilterType }[] = [
	{ label: '全部', value: '' },
	{ label: '系统公告', value: 'system' },
	{ label: '业务通知', value: 'business' },
];

export default function MessageListPage() {
	const [type, setType] = useState<FilterType>('');
	const [page, setPage] = useState(1);
	const [list, setList] = useState<MessageItem[]>([]);

	const { data, isLoading, isFetching, refetch } = useMessageList({
		page,
		pageSize: PAGE_SIZE,
		type: type || undefined,
	});
	const { data: unreadCount = 0, refetch: refetchUnread } = useUnreadCount();
	const { mutate: markRead } = useMarkMessageRead();
	const { mutate: markAllRead, isLoading: isMarkingAll } = useMarkAllMessagesRead();

	useEffect(() => {
		if (!data) return;
		const rows = data.list || [];
		setList((prev) => (page === 1 ? rows : [...prev, ...rows]));
	}, [data, page]);

	const total = data?.total ?? 0;
	const hasMore = data?.hasMore ?? list.length < total;

	const handleTypeChange = (val: FilterType) => {
		setType(val);
		setPage(1);
		setList([]);
	};

	const handleItemClick = (target: MessageItem) => {
		if (!target.isRead) {
			setList((prev) => prev.map((row) => (row.id === target.id ? { ...row, isRead: true } : row)));
			markRead(target.id);
		}
		mapsTo(`${MESSAGE_ROUTES.detail}?id=${encodeURIComponent(target.id)}`);
	};

	const handleMarkAllRead = () => {
		if (unreadCount <= 0 || isMarkingAll) return;
		markAllRead(undefined, {
			onSuccess: () => {
				setList((prev) => prev.map((row) => ({ ...row, isRead: true })));
			},
		});
	};

	usePullDownRefresh(async () => {
		setPage(1);
		await Promise.all([refetch(), refetchUnread()]);
		Taro.stopPullDownRefresh();
	});

	useReachBottom(() => {
		if (isFetching || !hasMore) return;
		setPage((prev) => prev + 1);
	});

	return (
		<Page paddingX={false} title="消息通知">
			<Tabs tabs={MESSAGE_TABS} value={type} onChange={handleTypeChange} sticky />

			<View className="container-x py-3 flex flex-col gap-3 flex-1">
				{/* 顶部状态工具条 */}
				<View className="flex items-center justify-between px-1">
					<Text className="text-xs text-zinc-500">
						{unreadCount > 0 ? `还有 ${unreadCount} 条未读消息` : '全部消息已读'}
					</Text>
					<Button
						size="xs"
						variant="zinc"
						appearance="outline"
						icon="icon-[ph--checks]"
						disabled={unreadCount <= 0}
						loading={isMarkingAll}
						onClick={handleMarkAllRead}
					>
						全部已读
					</Button>
				</View>

				{isLoading && page === 1 ? (
					Array.from({ length: 4 }).map((_, idx) => (
						<Card key={idx} layout="horizontal" className="py-3.5 items-start">
							<Skeleton className="size-10 rounded-xl shrink-0" />
							<View className="flex-1 flex flex-col gap-2">
								<View className="flex justify-between gap-2">
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-3 w-16" />
								</View>
								<Skeleton className="h-3 w-full" />
								<Skeleton className="h-3 w-2/3" />
							</View>
						</Card>
					))
				) : list.length === 0 ? (
					<Empty title="暂无消息通知" subTitle="有新的系统公告或业务提醒时会在这里展示" />
				) : (
					<>
						{list.map((item) => (
							<MessageCard key={item.id} item={item} onClick={handleItemClick} />
						))}

						<View className="py-4 flex justify-center">
							<Text className="text-xs text-zinc-400">
								{isFetching ? '加载中...' : hasMore ? '上拉加载更多' : `共 ${list.length} 条消息`}
							</Text>
						</View>
					</>
				)}
			</View>
		</Page>
	);
}
