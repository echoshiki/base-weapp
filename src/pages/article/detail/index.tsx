import { useEffect, useMemo } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, RichText } from '@tarojs/components';
import { Page, Card, Empty, Skeleton, Button } from '@/components/ui';
import { useArticleDetail } from '@/hooks/useArticle';
import { formatDateToDay } from '@/utils/common';

export default function ArticleDetailPage() {
	const router = useRouter();
	const articleId = router.params.id ? Number(router.params.id) : undefined;

	// 获取文章详情
	const { data, isLoading, error } = useArticleDetail(articleId);

	// 动态设置顶部标题
	useEffect(() => {
		if (data?.title) {
			Taro.setNavigationBarTitle({
				title: data.title.length > 12 ? `${data.title.slice(0, 12)}...` : data.title,
			});
		}
	}, [data?.title]);

	// 富文本内容样式自适应处理 (保证图片不撑破屏幕)
	const formattedContent = useMemo(() => {
		if (!data?.content) return '';
		// 替换图片样式为 100% 宽度自适应
		return data.content
			.replace(/<img[^>]*>/gi, (match) => {
				return match.replace(/style="[^"]*"/gi, '').replace(/style='[^']*'/gi, '');
			})
			.replace(
				/<img/gi,
				'<img style="max-width:100%;height:auto;display:block;margin:12px 0;border-radius:10px;"',
			);
	}, [data?.content]);

	if (isLoading) {
		return (
			<Page paddingX={false} className="bg-white min-h-screen">
				<View className="container-x py-6 flex flex-col gap-4">
					<Skeleton className="h-8 w-4/5" />
					<Skeleton className="h-4 w-1/3" />
					<Skeleton className="h-44 w-full rounded-xl" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</View>
			</Page>
		);
	}

	if (!data || error) {
		return (
			<Page className="bg-gray-100 min-h-screen flex items-center justify-center">
				<Empty title="文章不存在或已被移除" buttonText="返回列表" onButtonClick={() => Taro.navigateBack()} />
			</Page>
		);
	}

	return (
		<Page paddingX={false} className="bg-gray-100 min-h-screen pb-16">
			{/* 文章正文主卡片 */}
			<View className="container-x pt-4">
				<Card className="flex flex-col p-5 bg-white shadow-2xs border-0">
					{/* 文章大标题 */}
					<Text className="text-xl font-bold text-text-title leading-snug tracking-tight">{data.title}</Text>

					{/* 作者与发布时间 */}
					<View className="flex items-center gap-3 mt-3 pb-3 border-b border-gray-100 text-xs text-text-muted/70">
						{data.author && (
							<View className="flex items-center gap-1">
								<View className="icon-[ph--user-circle-bold] size-3.5 text-primary" />
								<Text className="text-text-body font-medium">{data.author}</Text>
							</View>
						)}
						{data.createTime && (
							<View className="flex items-center gap-1">
								<View className="icon-[ph--calendar-blank] size-3.5" />
								<Text className="font-mono">{formatDateToDay(data.createTime)}</Text>
							</View>
						)}
					</View>

					{/* 正文内容 (支持 HTML 富文本与换行纯文本) */}
					<View className="mt-5 text-sm leading-loose text-text-title font-normal tracking-wide">
						{formattedContent.includes('<') ? (
							<RichText nodes={formattedContent} className="rich-text-content" />
						) : (
							<Text className="whitespace-pre-wrap">{data.content}</Text>
						)}
					</View>
				</Card>

				{/* 底部引导与返回 */}
				<View className="mt-6 flex flex-col items-center gap-3">
					<Button
						variant="outline"
						size="md"
						className="px-6 rounded-full"
						onClick={() => Taro.navigateBack()}
					>
						返回文章列表
					</Button>
				</View>
			</View>
		</Page>
	);
}
