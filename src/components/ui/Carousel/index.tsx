import { View, Image, Swiper, SwiperItem, SwiperProps } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/utils/common';

/** 传统数据驱动模式下的单项数据接口 */
export interface CarouselItemData {
	id?: number | string;
	pic: string;
	url?: string;
	[key: string]: any;
}

export interface CarouselProps {
	/** 传统模式：轮播数据数组 */
	list?: CarouselItemData[];
	/** 传统模式：点击单项的回调 */
	onItemClick?: (item: CarouselItemData, index: number) => void;
	/** 是否为全屏/全宽度显示（无外边距） */
	isFull?: boolean;
	/** 是否自动播放，默认 true */
	autoplay?: boolean;
	/** 是否循环播放，默认 true */
	circular?: boolean;
	/** 是否显示指示点，默认 true */
	indicatorDots?: boolean;
	/** 指示点未激活颜色 */
	indicatorColor?: string;
	/** 指示点激活颜色 */
	indicatorActiveColor?: string;
	/** Swiper 高度 Class */
	heightClass?: string;
	/** 自定义外层样式 */
	className?: string;
	/** 复合组件模式下的子节点 (<CarouselContent />) */
	children?: ReactNode;
}

/**
 * Carousel 根组件
 * 支持两种模式：
 * 1. 经典数据驱动：<Carousel list={data} onItemClick={...} />
 * 2. shadcn 复合组件：<Carousel><CarouselContent><CarouselItem>...</CarouselItem></CarouselContent></Carousel>
 */
export function Carousel({
	list,
	onItemClick,
	isFull = false,
	autoplay = true,
	circular = true,
	indicatorDots = true,
	indicatorColor = 'rgba(212, 175, 55, 0.3)',
	indicatorActiveColor = '#D4AF37',
	heightClass = 'h-48',
	className,
	children,
}: CarouselProps) {
	// 如果传入了 list 数据，走经典简化数据渲染模式
	if (list) {
		if (!list.length) return <View className="swiper-placeholder" />;

		return (
			<View className={cn(isFull ? 'p-0' : 'px-2 pt-3', className)}>
				<Swiper
					className={cn('w-full', heightClass)}
					indicatorDots={indicatorDots}
					autoplay={autoplay}
					circular={circular}
					indicatorColor={indicatorColor}
					indicatorActiveColor={indicatorActiveColor}
				>
					{list.map((item, index) => (
						<SwiperItem
							key={item.id || index}
							onClick={() => {
								if (onItemClick) {
									onItemClick(item, index);
								} else if (item.url) {
									Taro.navigateTo({ url: item.url });
								}
							}}
						>
							<View
								className={cn(
									'w-full h-full overflow-hidden bg-card shadow-xs',
									isFull ? 'rounded-none' : 'rounded-card',
								)}
							>
								<Image className="w-full h-full" src={item.pic} mode="aspectFill" />
							</View>
						</SwiperItem>
					))}
				</Swiper>
			</View>
		);
	}

	// 否则走复合组件模式 (Children)
	return <View className={cn(isFull ? 'p-0' : 'px-2 pt-3', className)}>{children}</View>;
}

export interface CarouselContentProps extends Omit<SwiperProps, 'children'> {
	heightClass?: string;
	className?: string;
	children?: ReactNode;
}

/**
 * CarouselContent - 轮播图内容轨道（封装 Taro 原生 Swiper）
 */
export function CarouselContent({
	autoplay = true,
	circular = true,
	indicatorDots = true,
	indicatorColor = 'rgba(212, 175, 55, 0.3)',
	indicatorActiveColor = '#D4AF37',
	heightClass = 'h-48',
	className,
	children,
	...props
}: CarouselContentProps) {
	return (
		<Swiper
			className={cn('w-full', heightClass, className)}
			autoplay={autoplay}
			circular={circular}
			indicatorDots={indicatorDots}
			indicatorColor={indicatorColor}
			indicatorActiveColor={indicatorActiveColor}
			{...props}
		>
			{children}
		</Swiper>
	);
}

export interface CarouselItemProps extends React.ComponentProps<typeof View> {
	className?: string;
	children?: ReactNode;
	onClick?: () => void;
}

/**
 * CarouselItem - 单个轮播卡片（封装 Taro 原生 SwiperItem）
 */
export function CarouselItem({ className, children, onClick, ...props }: CarouselItemProps) {
	return (
		<SwiperItem onClick={onClick}>
			<View className={cn('w-full h-full overflow-hidden', className)} {...props}>
				{children}
			</View>
		</SwiperItem>
	);
}
