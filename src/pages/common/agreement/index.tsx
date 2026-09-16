import { useEffect, useMemo } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, RichText } from '@tarojs/components';
import { Page, Card, Loading, Empty, Skeleton, Button } from '@/components/ui';
import { useAppConfig } from '@/hooks/useAppConfig';

export default function AgreementPage() {
	const router = useRouter();
	const type = (router.params.type as 'agreement' | 'policy') || 'agreement';

	// 获取全局系统配置
	const { data: config, isLoading, error } = useAppConfig();

	// 标题与内容计算
	const isAgreement = type === 'agreement';
	const title = isAgreement ? '用户服务协议' : '隐私保护条款';
	const rawContent = isAgreement ? config?.agreementExpert : config?.policyExpert;
	const externalUrl = isAgreement ? config?.agreementUrl : config?.policyUrl;

	// 动态同步页面标题
	useEffect(() => {
		Taro.setNavigationBarTitle({ title });
	}, [title]);

	// 富文本内容样式自适应处理
	const formattedContent = useMemo(() => {
		if (!rawContent) return '';
		return rawContent
			.replace(/<img[^>]*>/gi, (match) => {
				return match.replace(/style="[^"]*"/gi, '').replace(/style='[^']*'/gi, '');
			})
			.replace(
				/<img/gi,
				'<img style="max-width:100%;height:auto;display:block;margin:12px 0;border-radius:10px;"',
			);
	}, [rawContent]);

	// 复制外部链接
	const handleCopyUrl = () => {
		if (!externalUrl) return;
		Taro.setClipboardData({
			data: externalUrl,
			success: () => Taro.showToast({ title: '已复制链接', icon: 'success' }),
		});
	};

	if (isLoading) {
		return (
			<Page paddingX={false} className="bg-white min-h-screen">
				<View className="container-x py-6 flex flex-col gap-4">
					<Skeleton className="h-8 w-1/2" />
					<Skeleton className="h-4 w-1/3" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-4/5" />
				</View>
			</Page>
		);
	}

	if (error) {
		return (
			<Page className="bg-gray-100 min-h-screen flex items-center justify-center">
				<Empty title="内容加载失败" buttonText="返回" onButtonClick={() => Taro.navigateBack()} />
			</Page>
		);
	}

	return (
		<Page paddingX={false} className="bg-gray-100 min-h-screen pb-16">
			<View className="container-x pt-4">
				<Card className="flex flex-col p-5 bg-white shadow-2xs border-0">
					{/* 页面主标题 */}
					<Text className="text-xl font-bold text-text-title leading-snug tracking-tight">{title}</Text>

					<View className="flex items-center gap-2 mt-2 pb-3 border-b border-gray-100 text-xs text-text-muted/60">
						<Text>{config?.appName || '小程序项目'}</Text>
						<Text>·</Text>
						<Text>规范合规保障</Text>
					</View>

					{/* 协议正文内容 */}
					{formattedContent ? (
						<View className="mt-4 text-sm leading-relaxed text-text-body font-normal">
							{formattedContent.includes('<') ? (
								<RichText nodes={formattedContent} />
							) : (
								<Text className="whitespace-pre-wrap">{formattedContent}</Text>
							)}
						</View>
					) : (
						<View className="py-12 flex flex-col items-center justify-center gap-2">
							<Text className="text-sm text-text-muted">暂未配置条款正文</Text>
							{externalUrl && (
								<Button size="sm" variant="secondary" onClick={handleCopyUrl}>
									复制在线条款链接
								</Button>
							)}
						</View>
					)}

					{/* 外部协议链接提示 */}
					{externalUrl && (
						<View className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-text-muted">
							<Text className="truncate mr-2">官方原址: {externalUrl}</Text>
							<Text className="text-primary font-medium shrink-0 cursor-pointer" onClick={handleCopyUrl}>
								复制链接
							</Text>
						</View>
					)}
				</Card>

				{/* 底部版权信息 */}
				<View className="mt-6 flex flex-col items-center gap-1.5 text-center text-xs text-text-muted/50">
					{config?.copyright && <Text>{config.copyright}</Text>}
					{config?.icp && <Text>备案号: {config.icp}</Text>}
				</View>
			</View>
		</Page>
	);
}
