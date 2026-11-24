import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Card, DescriptionList, Description, Empty, Skeleton, Loading, Badge, Heading } from '@/components/ui';
import { BizPage } from '@/components/biz';
import {
	TRACKING_STATUS_META,
	getAppealTagColor,
	resolveAppealTypeTags,
	useAppealTrackingDetail,
	useAppealTrackingRecords,
	useAppealTypeList,
} from '@/hooks/useDemand';
import { cn, formatDateToDay } from '@/utils/common';

export default function TrackingDetailPage() {
	const instance = Taro.getCurrentInstance();
	const statusId = instance.router?.params?.statusId;
	const paramRequId = instance.router?.params?.requId;

	const { typeMap } = useAppealTypeList();
	const { data: detail, isLoading } = useAppealTrackingDetail(statusId);

	// 优先使用详情接口返回的 requId，若还在加载中可用路由传参提前并发拉取进度记录
	const activeRequId = detail?.requId || paramRequId;
	const { data: records = [], isLoading: isLoadingRecords } = useAppealTrackingRecords(activeRequId);

	if (isLoading) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen p-4 flex flex-col gap-3">
				<Card className="p-4 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-5 w-24 rounded-full" />
				</Card>
				<Card className="p-4 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-5 w-1/3" />
					<Skeleton className="h-20 w-full" />
				</Card>
				<Card className="p-4 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-5 w-1/3" />
					<Skeleton className="h-28 w-full" />
				</Card>
			</BizPage>
		);
	}

	if (!detail) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
				<Empty title="未找到跟踪详情" subTitle="该诉求跟踪记录可能已删除或不存在" />
			</BizPage>
		);
	}

	const statusMeta = TRACKING_STATUS_META[detail.status] || TRACKING_STATUS_META[0];
	const typeTags = resolveAppealTypeTags(detail.typeName, detail.typeId, typeMap);

	return (
		<BizPage paddingX={false} className="pb-10">
			<View className="p-4 flex flex-col gap-3.5">
				<Card className="gap-3">
					<View className="flex items-start justify-between gap-3">
						<Text className="text-lg font-bold text-slate-900 leading-snug flex-1">{detail.title}</Text>
						<Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
					</View>

					<View className="flex flex-wrap items-center gap-1.5">
						{detail.entName && (
							<Badge variant="blue" icon="icon-[ph--buildings] ">
								{detail.entName}
							</Badge>
						)}
						{typeTags.map((tag, idx) => (
							<Badge key={tag} variant={getAppealTagColor(idx)}>
								{tag}
							</Badge>
						))}
					</View>
				</Card>

				<Heading size="md" title="办理信息" className="border-l-10 border-primary pl-3 mt-3" />

				<Card>
					<DescriptionList divider>
						<Description label="归属企业" value={detail.entName || '-'} labelWidth="w-20" />
						<Description
							label="诉求类别"
							value={typeTags.length > 0 ? typeTags.join('、') : '-'}
							labelWidth="w-20"
						/>
						<Description label="负责人" value={detail.userName || '-'} labelWidth="w-20" />
						<Description
							label="创建时间"
							value={formatDateToDay(detail.createTime) || '-'}
							labelWidth="w-20"
						/>
						{detail.detail && (
							<Description label="诉求描述" value={detail.detail} align="start" labelWidth="w-20" />
						)}
						<Description
							label="处理描述"
							value={detail.description || '暂无最新处理说明'}
							align="start"
							labelWidth="w-20"
						/>
					</DescriptionList>
				</Card>

				<Heading
					size="md"
					title="跟踪进度"
					extra={
						records.length > 0 && <Text className="text-sm text-slate-400">共 {records.length} 条记录</Text>
					}
					className="border-l-10 border-primary pl-3 mt-3"
				/>

				<Card className="gap-3.5">
					{isLoadingRecords ? (
						<View className="py-6">
							<Loading title="正在加载跟踪进度..." />
						</View>
					) : records.length === 0 ? (
						<View className="py-6">
							<Empty
								icon="icon-[ph--clock-countdown-duotone]"
								title="暂无跟踪进度记录"
								subTitle="诉求处理过程中产生的节点动态将在此按时间顺序展示"
							/>
						</View>
					) : (
						<View className="flex flex-col pl-1">
							{records.map((record, index) => {
								const isFirst = index === 0;
								const isLast = index === records.length - 1;

								return (
									<View key={record.recordId || index} className="relative flex gap-3 pb-5 last:pb-0">
										{/* 左侧时间轴竖线与节点圆点 */}
										{!isLast && (
											<View className="absolute left-1.75 top-4 bottom-0 w-0.5 bg-slate-200" />
										)}
										<View className="relative z-10 mt-0.5 shrink-0">
											{isFirst ? (
												<View className="size-4 rounded-full bg-blue-100 flex items-center justify-center">
													<View className="size-2 rounded-full bg-primary" />
												</View>
											) : (
												<View className="size-4 rounded-full bg-slate-100 flex items-center justify-center">
													<View className="size-2 rounded-full bg-slate-400" />
												</View>
											)}
										</View>

										{/* 右侧进度内容 */}
										<View className="flex-1 min-w-0 flex flex-col gap-2">
											<View className="flex items-center justify-between gap-2">
												<Text
													className={cn(
														'text-sm font-bold truncate',
														isFirst ? 'text-primary' : 'text-slate-800',
													)}
												>
													{record.handler || '系统记录'}
												</Text>
												{record.hTime && (
													<Text className="text-xs text-slate-600 font-mono shrink-0">
														{record.hTime}
													</Text>
												)}
											</View>

											<View
												className={cn(
													'rounded px-4 py-2 mt-2',
													isFirst ? 'bg-blue-50 ' : 'bg-slate-50 ',
												)}
											>
												<Text className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
													{record.hDescription || '-'}
												</Text>
											</View>
										</View>
									</View>
								);
							})}
						</View>
					)}
				</Card>
			</View>
		</BizPage>
	);
}
