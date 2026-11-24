import { useEffect, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, RichText } from '@tarojs/components';
import { Card, Empty, Skeleton, Badge, Divider } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { formatRichHtml, useKnowledgeDetail } from '@/hooks/useResource';

export default function KnowledgeDetailPage() {
	const instance = Taro.getCurrentInstance();
	const articleId = instance.router?.params?.articleId;

	const { data: detail, isLoading } = useKnowledgeDetail(articleId);

	useEffect(() => {
		if (detail?.title) {
			Taro.setNavigationBarTitle({
				title: detail.title.length > 12 ? `${detail.title.slice(0, 12)}...` : detail.title,
			});
		}
	}, [detail?.title]);

	const hasHtmlTag = /<[a-z][\s\S]*>/i.test(detail?.content || '');
	const formattedHtml = useMemo(() => formatRichHtml(detail?.content), [detail?.content]);

	if (isLoading) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen p-4 flex flex-col gap-3">
				<Card className="p-5 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-6 w-4/5" />
					<Skeleton className="h-4 w-1/3" />
					<Skeleton className="h-44 w-full rounded-xl" />
					<Skeleton className="h-4 w-full" />
				</Card>
			</BizPage>
		);
	}

	if (!detail) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
				<Empty title="未找到知识科普" subTitle="该科普内容可能已下架或不存在" />
			</BizPage>
		);
	}

	return (
		<BizPage paddingX={false} className="bg-slate-50 min-h-screen pb-12">
			<View className="p-4">
				<Card className="p-6">
					<View className="flex flex-col gap-2">
						{/* 标题 */}
						<Text className="text-lg font-bold text-slate-900 leading-snug">{detail.title}</Text>

						{/* 版本号 */}
						{detail.verNum && (
							<View className="flex items-center gap-1 text-xs">
								版本号：
								<Badge variant="blue">
									{detail.verNum}
								</Badge>
							</View>
						)}
					</View>
					<Divider />

					{/* 正文内容 */}
					{!detail.content ? (
						<Text className="text-xs text-slate-400 py-6 text-center">暂无正文内容</Text>
					) : hasHtmlTag ? (
						<View className="text-sm text-slate-700 leading-relaxed overflow-hidden">
							<RichText nodes={formattedHtml} />
						</View>
					) : (
						<Text className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
							{detail.content}
						</Text>
					)}
				</Card>
			</View>
		</BizPage>
	);
}
