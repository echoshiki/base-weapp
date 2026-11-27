import { View, Text, Image } from '@tarojs/components';
import { AspectRatio, Badge, Card, Price } from '@/components/ui';
import { GoodsItem } from '../types';

export interface GoodsCardProps {
	item: GoodsItem;
	onClick?: (item: GoodsItem) => void;
}

/**
 * 商品双列卡片组件
 */
export function GoodsCard({ item, onClick }: GoodsCardProps) {
	return (
		<Card noPadding className="overflow-hidden" onClick={() => onClick?.(item)}>
			<AspectRatio ratio={1} className="bg-zinc-100">
				<Image src={item.cover} mode="aspectFill" className="size-full" lazyLoad />
			</AspectRatio>

			<View className="p-2.5 flex flex-col gap-1.5 flex-1 justify-between">
				<View className="flex flex-col gap-1">
					<Text className="text-sm font-semibold leading-snug line-clamp-2">{item.title}</Text>

					{item.tags && item.tags.length > 0 && (
						<View className="flex items-center flex-wrap gap-1">
							{item.tags.slice(0, 2).map((tag) => (
								<Badge key={tag} variant="zinc">
									{tag}
								</Badge>
							))}
						</View>
					)}
				</View>

				<View className="flex items-end justify-between gap-1 pt-1">
					<Price value={item.price} originalPrice={item.originalPrice} inCent size="md" />
					<Text className="text-xs text-zinc-400 shrink-0">已售 {item.sales}</Text>
				</View>
			</View>
		</Card>
	);
}
