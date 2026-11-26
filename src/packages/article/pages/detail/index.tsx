import { View, Text, Image, RichText } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Page, Card, Badge, Divider, Skeleton, Empty } from '@/components/ui';
import { useArticleDetail } from '../../hooks';

export default function ArticleDetailPage() {
	const instance = Taro.getCurrentInstance();
	const articleId = instance.router?.params?.id ? decodeURIComponent(instance.router.params.id) : '';

	const { data: detail, isLoading } = useArticleDetail(articleId);

	if (isLoading) {
		return (
			<Page>
				<Card className="my-4 gap-3">
					<Skeleton className="h-6 w-4/5" />
					<Skeleton className="h-3.5 w-1/2" />
					<Skeleton className="h-44 w-full rounded-card mt-1" />
					<Skeleton className="h-3.5 w-full" />
					<Skeleton className="h-3.5 w-full" />
					<Skeleton className="h-3.5 w-3/4" />
				</Card>
			</Page>
		);
	}

	if (!detail) {
		return (
			<Page>
				<Empty title="文章不存在或已下架" subTitle="请返回文章列表查看其他内容" />
			</Page>
		);
	}

	const isHtml = detail.content?.includes('<');

	return (
		<Page>
			<Card className="my-4 gap-3">
				{/* 标题 */}
				<Text className="text-lg font-bold leading-snug tracking-tight">{detail.title}</Text>

				{/* 元信息 */}
				<View className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
					{detail.categoryName && <Badge variant="primary">{detail.categoryName}</Badge>}
					{detail.author && <Text>{detail.author}</Text>}
					{detail.publishTime && <Text>{detail.publishTime}</Text>}
					{detail.views !== undefined && (
						<View className="flex items-center gap-0.5 ml-auto">
							<View className="icon-[ph--eye] size-3.5" />
							<Text>{detail.views}</Text>
						</View>
					)}
				</View>

				<Divider className="my-1" />

				{/* 封面图 */}
				{detail.cover && (
					<Image
						src={detail.cover}
						mode="widthFix"
						className="w-full rounded-card bg-zinc-100"
					/>
				)}

				{/* 正文内容 */}
				<View className="text-sm leading-relaxed text-zinc-800">
					{isHtml ? (
						<RichText nodes={detail.content} />
					) : (
						<Text className="whitespace-pre-wrap">{detail.content || '暂无正文内容'}</Text>
					)}
				</View>
			</Card>
		</Page>
	);
}
