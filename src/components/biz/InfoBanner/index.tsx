import Taro from '@tarojs/taro';
import { View, Text, Video, RichText } from '@tarojs/components';
import { Card, Carousel } from '@/components/ui';
import { SjcsPageInfoItem } from '@/types/common';
import { formatRichHtml, resolveResourcePhotoUrl } from '@/hooks/useResource';

export interface InfoBannerProps {
	info?: SjcsPageInfoItem[];
	className?: string;
}

/**
 * 内页头部下方的多媒体信息展示区块（多图轮播 + 单个视频 + 描述文字）
 */
export function InfoBanner({ info, className }: InfoBannerProps) {
	if (!Array.isArray(info) || info.length === 0) {
		return null;
	}

	const validBlocks = info.filter((item) => {
		const hasImages = Array.isArray(item.imagePath) && item.imagePath.some((p) => Boolean(p?.trim()));
		const hasVideo = Boolean(item.videoPath?.trim());
		const hasDetail = Boolean(item.detail?.trim());
		return hasImages || hasVideo || hasDetail;
	});

	if (validBlocks.length === 0) {
		return null;
	}

	return (
		<View className={className || 'px-4 pt-3 flex flex-col gap-3'}>
			{validBlocks.map((block, blockIdx) => {
				const carouselList = (block.imagePath || [])
					.map((path, idx) => ({
						id: idx,
						pic: resolveResourcePhotoUrl(path),
					}))
					.filter((item) => Boolean(item.pic));

				const videoUrl = resolveResourcePhotoUrl(block.videoPath);
				const detail = block.detail?.trim() || '';
				const hasHtml = /<[a-z][\s\S]*>/i.test(detail);

				return (
					<View key={blockIdx} className="flex flex-col gap-3">
						{/* 1. 图片轮播区 */}
						{carouselList.length > 0 && (
							<View className="rounded-xl overflow-hidden shadow-xs border border-slate-100 bg-white">
								<Carousel
									list={carouselList}
									isFull
									heightClass="h-44"
									onItemClick={(item) => {
										Taro.previewImage({
											current: item.pic,
											urls: carouselList.map((c) => c.pic),
										});
									}}
								/>
							</View>
						)}

						{/* 2. 视频展示 */}
						{videoUrl && (
							<View className="rounded-xl overflow-hidden shadow-xs border border-slate-100 bg-black">
								<Video src={videoUrl} controls showFullscreenBtn className="w-full h-48 block" />
							</View>
						)}

						{/* 3. 描述文字 */}
						{detail && (
							<Card className="p-3.5">
								{hasHtml ? (
									<View className="text-xs text-slate-600 leading-relaxed overflow-hidden">
										<RichText nodes={formatRichHtml(detail)} />
									</View>
								) : (
									<Text className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
										{detail}
									</Text>
								)}
							</Card>
						)}
					</View>
				);
			})}
		</View>
	);
}
