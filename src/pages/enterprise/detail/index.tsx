import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import {
	Card,
	DescriptionList,
	Description,
	Empty,
	Skeleton,
	Heading,
	Asset,
	Divider,
	Badge,
} from '@/components/ui';
import { BizPage } from '@/components/biz';
import { useEnterpriseDetail } from '@/hooks/useEnterprise';

const splitTags = (raw?: string) => {
	if (!raw) return [];
	return raw
		.split(/[,，、;；]/)
		.map((s) => s.trim())
		.filter(Boolean);
};

const resolveImageUrl = (path?: string) => {
	if (!path) return '';
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	const baseUrl = process.env.TARO_APP_API || '';
	return `${baseUrl}${path}`;
};

export default function EnterpriseDetailPage() {
	const instance = Taro.getCurrentInstance();
	const entId = instance.router?.params?.entId;

	const { data: detail, isLoading } = useEnterpriseDetail(entId);

	const handlePreviewPhoto = () => {
		const url = resolveImageUrl(detail?.bsPhoto);
		if (!url) return;
		Taro.previewImage({
			current: url,
			urls: [url],
		});
	};

	if (isLoading) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen p-4 flex flex-col gap-3">
				<Card className="p-4 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-1/2" />
					<Skeleton className="h-36 w-full rounded-xl" />
				</Card>
				<Card className="p-4 rounded-2xl flex flex-col gap-3">
					<Skeleton className="h-5 w-1/3" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</Card>
			</BizPage>
		);
	}

	if (!detail) {
		return (
			<BizPage paddingX={false} className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
				<Empty title="未找到企业详情" subTitle="该企业档案可能已删除或不存在" />
			</BizPage>
		);
	}

	const honorTags = splitTags(detail.honorName);
	const customTags = splitTags(detail.qybqName);
	const photoUrl = resolveImageUrl(detail.bsPhoto);

	return (
		<BizPage paddingX={false} className="pb-10">
			<View className="p-4 flex flex-col gap-3.5">
				<Card>
					<View className="flex justify-between items-center gap-2">
						<Text className="text-lg font-bold text-slate-900 leading-snug flex-1">{detail.entName}</Text>
						{detail.boundaryName && (
							<View className="flex items-center gap-1 shrink-0">
								<View className="icon-[ph--map-pin-line-duotone] size-4" />
								<Text className="text-xs font-medium text-slate-600">{detail.boundaryName}</Text>
							</View>
						)}
					</View>

					<Divider />

					{(detail.industryName || detail.scaleName || detail.natureName) && (
						<View className="flex flex-wrap items-center gap-1.5">
							{detail.industryName && <Badge variant="primary">{detail.industryName}</Badge>}
							{detail.scaleName && <Badge variant="rose">{detail.scaleName}</Badge>}
							{detail.natureName && <Badge variant="slate">{detail.natureName}</Badge>}
						</View>
					)}

					{(honorTags.length > 0 || customTags.length > 0) && (
						<View className="flex flex-wrap items-center gap-1.5 mt-3">
							{honorTags.map((tag) => (
								<Badge key={`honor-${tag}`} variant="amber">
									{tag}
								</Badge>
							))}
							{customTags.map((tag) => (
								<Badge key={`qybq-${tag}`} variant="emerald">
									{tag}
								</Badge>
							))}
						</View>
					)}
				</Card>

				<Heading size="md" title="工商与经营信息" className="border-l-10 border-primary pl-3 mt-3" />

				<Card>
					<DescriptionList divider>
						<Description label="企业名称" value={detail.entName || '-'} />
						<Description label="法人姓名" value={detail.legalName || '-'} />
						<Description label="成立日期" value={detail.estabDate || '-'} />
						<Description label="注册资本" value={detail.regCap || '-'} />
						<Description
							label="投资金额"
							value={detail.invAmt !== undefined && detail.invAmt !== null ? `${detail.invAmt}` : '-'}
						/>
						<Description label="注册地址" value={detail.regAddress || '-'} align="start" />
						<Description label="经营范围" value={detail.business || '-'} align="start" />
					</DescriptionList>
				</Card>

				<Heading size="md" title="联系方式" className="border-l-10 border-primary pl-3 mt-3" />

				<Card>
					<DescriptionList divider>
						<Description label="联系人" value={detail.contPerson || '-'} />
						<Description label="联系电话" value={detail.contPhone || '-'} />
						<Description label="电子邮箱" value={detail.email || '-'} />
					</DescriptionList>
				</Card>

				{(detail.comProfile || detail.fileName) && (
					<>
						<Heading size="md" title="企业简介" className="border-l-10 border-primary pl-3 mt-3" />
						<Card>
							{detail.comProfile && (
								<Text className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
									{detail.comProfile}
								</Text>
							)}

							{detail.fileName && (
								<View className="flex items-center gap-2 bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2.5">
									<View className="icon-[ph--paperclip] size-4 text-slate-500 shrink-0" />
									<Text className="text-xs text-slate-700 break-all">{detail.fileName}</Text>
								</View>
							)}
						</Card>
					</>
				)}
			</View>
		</BizPage>
	);
}
