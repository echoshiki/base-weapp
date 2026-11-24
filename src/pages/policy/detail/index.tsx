import { useEffect, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, RichText } from '@tarojs/components';
import { Card, Empty, Skeleton, Button, Badge, Divider } from '@/components/ui';
import { BizPage } from '@/components/biz';
import { formatRichHtml, parsePolicyCategories, usePolicyDetail } from '@/hooks/useResource';

export default function PolicyDetailPage() {
	const instance = Taro.getCurrentInstance();
	const id = instance.router?.params?.id;

	const { data: detail, isLoading } = usePolicyDetail(id);

	useEffect(() => {
		if (detail?.bbTitle) {
			Taro.setNavigationBarTitle({
				title: detail.bbTitle.length > 12 ? `${detail.bbTitle.slice(0, 12)}...` : detail.bbTitle,
			});
		}
	}, [detail?.bbTitle]);

	const formattedHtml = useMemo(() => formatRichHtml(detail?.nrb3), [detail?.nrb3]);
	const externalLink = detail?.phoneUrl || detail?.bbUrl || detail?.bbcUrl;

	const handleCopyLink = () => {
		if (!externalLink) return;
		Taro.setClipboardData({
			data: externalLink,
			success: () => {
				Taro.showToast({ title: '链接已复制，可在浏览器打开', icon: 'none' });
			},
		});
	};

	if (isLoading) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen p-4 flex flex-col gap-3">
				<Card className="p-5 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-6 w-4/5" />
					<Skeleton className="h-4 w-1/2" />
					<Skeleton className="h-44 w-full rounded-xl" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</Card>
			</BizPage>
		);
	}

	if (!detail) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
				<Empty title="未找到政策文件" subTitle="该文件可能已下架或不存在" />
			</BizPage>
		);
	}

	return (
		<BizPage paddingX={false} className="bg-slate-50 min-h-screen pb-12">
			<View className="p-4 flex flex-col gap-3.5">
				<Card className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-3">
					{/* 标题 */}
					<Text className="text-lg font-bold text-slate-900 leading-snug">{detail.bbTitle}</Text>

					{/* 元信息 */}
					<View className="flex flex-wrap items-center gap-1">
						{parsePolicyCategories(detail.category).map((cat) => (
							<Badge key={cat} variant="blue">
								{cat}
							</Badge>
						))}
					</View>

					<View className="flex items-center justify-between text-xs text-slate-600">
						{detail.issueCode && <Text>{detail.issueCode}</Text>}
						{detail.publicdata && (
							<View className="flex items-center gap-1">
								<View className="icon-[ph--calendar-blank] size-3.5" />
								<Text>{detail.publicdata}</Text>
							</View>
						)}
					</View>

					<Divider />

					{/* 正文 HTML */}
					{formattedHtml ? (
						<View className="text-sm text-slate-700 leading-relaxed overflow-hidden">
							<RichText nodes={formattedHtml} />
						</View>
					) : (
						<View className="py-8 flex flex-col items-center gap-3 text-center">
							<Text className="text-xs text-slate-400">暂无正文内容</Text>
							{externalLink && (
								<Button appearance="outline" size="sm" onClick={handleCopyLink}>
									复制原文链接查看
								</Button>
							)}
						</View>
					)}
				</Card>

				{/* 原文外链补充卡片（当正文存在且同时提供了原文链接时） */}
				{formattedHtml && externalLink && (
					<Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between gap-3">
						<View className="flex items-center gap-2 min-w-0 flex-1">
							<View className="icon-[ph--link-simple] size-4 text-primary shrink-0" />
							<Text className="text-xs text-slate-600 truncate">原文网页链接</Text>
						</View>
						<Text
							onClick={handleCopyLink}
							className="text-xs font-semibold text-primary shrink-0 cursor-pointer active:opacity-70"
						>
							复制链接
						</Text>
					</Card>
				)}
			</View>
		</BizPage>
	);
}
