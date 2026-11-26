import { View, Text, Image } from '@tarojs/components';
import { Card, Badge } from '@/components/ui';
import { ArticleItem } from '../types';

export interface ArticleCardProps {
	item: ArticleItem;
	onClick?: (item: ArticleItem) => void;
}

/**
 * 文章模块私有卡片组件（自动适配有封面图/无封面图两种形态）
 */
export function ArticleCard({ item, onClick }: ArticleCardProps) {
	const hasCover = Boolean(item.cover);

	return (
		<Card
			layout={hasCover ? 'horizontal' : 'vertical'}
			className={hasCover ? 'py-3.5' : 'py-4 gap-2'}
			onClick={() => onClick?.(item)}
		>
			{hasCover && (
				<Image src={item.cover!} mode="aspectFill" className="w-26 h-20 rounded-lg bg-zinc-100 shrink-0" />
			)}

			<View className="flex-1 min-w-0 flex flex-col justify-between gap-2">
				<View className="flex flex-col gap-1">
					<Text className="text-sm font-semibold leading-snug line-clamp-2">{item.title}</Text>
					{!hasCover && item.summary && (
						<Text className="text-xs opacity-60 leading-relaxed line-clamp-2">{item.summary}</Text>
					)}
				</View>

				<View className="flex items-center justify-between gap-2">
					<View className="flex items-center gap-1.5 min-w-0">
						{item.categoryName && <Badge variant="zinc">{item.categoryName}</Badge>}
					</View>

					<View className="flex items-center gap-2 shrink-0 text-xs text-zinc-400">
						{item.views !== undefined && (
							<View className="flex items-center gap-0.5">
								<View className="icon-[ph--eye] size-3.5" />
								<Text>{item.views}</Text>
							</View>
						)}
						{item.publishTime && <Text>{item.publishTime.slice(0, 10)}</Text>}
					</View>
				</View>
			</View>
		</Card>
	);
}
