import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import {
	Page,
	Card,
	Alert,
	Badge,
	Heading,
	DescriptionList,
	Description,
	ImageUploader,
	Skeleton,
	Empty,
} from '@/components/ui';
import { useFeedbackDetail } from '../../hooks';
import { FEEDBACK_STATUS_META, FEEDBACK_TYPE_OPTIONS } from '../../types';

export default function FeedbackDetailPage() {
	const instance = Taro.getCurrentInstance();
	const feedbackId = instance.router?.params?.id ? decodeURIComponent(instance.router.params.id) : '';

	const { data: detail, isLoading } = useFeedbackDetail(feedbackId);

	if (isLoading) {
		return (
			<Page>
				<Card className="my-4 gap-3">
					<Skeleton className="h-12 w-full rounded-card" />
					<Skeleton className="h-4 w-2/3" />
					<Skeleton className="h-20 w-full" />
				</Card>
			</Page>
		);
	}

	if (!detail) {
		return (
			<Page>
				<Empty title="未找到反馈记录" subTitle="该记录可能已被删除" />
			</Page>
		);
	}

	const statusMeta = FEEDBACK_STATUS_META[detail.status] || FEEDBACK_STATUS_META.pending;
	const typeLabel =
		detail.typeLabel || FEEDBACK_TYPE_OPTIONS.find((opt) => opt.value === detail.type)?.label || '其他问题';

	const alertVariant =
		detail.status === 'replied' ? 'success' : detail.status === 'processing' ? 'info' : 'warning';

	return (
		<Page>
			<View className="py-4 flex flex-col gap-4">
				{/* 状态横幅 */}
				<Alert variant={alertVariant} title={`当前状态：${statusMeta.label}`}>
					{detail.status === 'replied'
						? '工作人员已回复您的反馈，请查看下方处理结果。'
						: detail.status === 'processing'
							? '您的反馈正在加紧核实处理中，请耐心等待。'
							: '我们已收到您的反馈，将按提交顺序尽快受理。'}
				</Alert>

				{/* 反馈基本信息 */}
				<Card className="gap-3">
					<Heading title="反馈内容" size="sm" extra={<Badge variant={statusMeta.variant} dot>{statusMeta.label}</Badge>} />

					<DescriptionList divider>
						<Description label="反馈编号" value={detail.id} variant="between" />
						<Description label="反馈类型" value={typeLabel} variant="between" />
						<Description label="提交时间" value={detail.createTime} variant="between" />
						{detail.contact && <Description label="联系方式" value={detail.contact} variant="between" />}
					</DescriptionList>

					<View className="pt-2 border-t border-zinc-100">
						<Text className="text-sm leading-relaxed whitespace-pre-wrap">{detail.content}</Text>
					</View>

					{detail.images && detail.images.length > 0 && (
						<View className="pt-1">
							<ImageUploader readonly value={detail.images} />
						</View>
					)}
				</Card>

				{/* 官方回复卡片 */}
				{detail.reply && (
					<Card className="gap-2">
						<Heading
							title="官方回复"
							size="sm"
							icon="icon-[ph--chat-circle-dots-duotone]"
							extra={detail.replyTime ? <Text className="text-xs text-zinc-400">{detail.replyTime}</Text> : undefined}
						/>
						<Text className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">{detail.reply}</Text>
					</Card>
				)}
			</View>
		</Page>
	);
}
