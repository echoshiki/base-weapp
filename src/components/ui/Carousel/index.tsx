import { View, Image, Swiper, SwiperItem, SwiperProps } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ReactNode } from 'react';
import { cn } from '@/utils/common';

/** 轮播单项数据接口 */
export interface CarouselItemData {
	id?: number | string;
	pic: string;
	url?: string;
	[key: string]: any;
}

export interface CarouselProps<T extends CarouselItemData = CarouselItemData>
	extends Omit<SwiperProps, 'children' | 'className'> {
	/** 轮播数据数组 */
	list?: T[];
	/** 点击单项回调（未传时若存在 item.url 则自动跳转） */
	onItemClick?: (item: T, index: number) => void;
	/** 自定义单项渲染函数 */
	renderItem?: (item: T, index: number) => ReactNode;
	/** 是否为全宽度显示（无圆角与外边距），默认 false */
	isFull?: boolean;
	/** Swiper 高度类名，默认 h-44 */
	heightClass?: string;
	/** 自定义外层容器样式 */
	className?: string;
	/** 直接传入 SwiperItem 子节点时的自定义模式 */
	children?: ReactNode;
}

/**
 * Carousel 轮播图组件
 * 支持数据驱动 (list + 可选 renderItem) 与原生 SwiperItem children 透传
 */
export function Carousel<T extends CarouselItemData = CarouselItemData>({
	list,
	onItemClick,
	renderItem,
	isFull = false,
	autoplay = true,
	circular = true,
	indicatorDots = true,
	indicatorColor = 'rgba(255, 255, 255, 0.45)',
	indicatorActiveColor = '#ffffff',
	heightClass = 'h-44',
	className,
	children,
	...swiperProps
}: CarouselProps<T>) {
	if (list && list.length === 0) {
		return null;
	}

	return (
		<View className={cn('w-full overflow-hidden', isFull ? 'rounded-none' : 'rounded-card', className)}>
			<Swiper
				className={cn('w-full', heightClass)}
				indicatorDots={indicatorDots}
				autoplay={autoplay}
				circular={circular}
				indicatorColor={indicatorColor}
				indicatorActiveColor={indicatorActiveColor}
				{...swiperProps}
			>
				{list
					? list.map((item, index) => (
							<SwiperItem
								key={item.id ?? index}
								onClick={() => {
									if (onItemClick) {
										onItemClick(item, index);
									} else if (item.url) {
										Taro.navigateTo({ url: item.url });
									}
								}}
							>
								{renderItem ? (
									renderItem(item, index)
								) : (
									<Image className="size-full" src={item.pic} mode="aspectFill" />
								)}
							</SwiperItem>
						))
					: children}
			</Swiper>
		</View>
	);
}
