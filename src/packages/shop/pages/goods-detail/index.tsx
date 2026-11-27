import { View, Text, Image, Button as TaroButton } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useState } from 'react';
import {
	Page,
	Card,
	Carousel,
	Price,
	Badge,
	Heading,
	Divider,
	Skeleton,
	Empty,
	Button,
	ImagePreview,
} from '@/components/ui';
import { mapsTo } from '@/utils/common';
import { useAddCart, useCartList, useGoodsDetail } from '../../hooks';
import { SkuActionMode, SkuConfirmPayload, SkuPicker } from '../../components/SkuPicker';
import { SHOP_ROUTES } from '../../routes';
import { GoodsSku } from '../../types';

export default function GoodsDetailPage() {
	const { params } = useRouter();
	const id = params.id ? decodeURIComponent(params.id) : '';
	const { data: detail, isLoading } = useGoodsDetail(id);
	const { totalCount: cartCount } = useCartList();
	const { mutate: addCart } = useAddCart();

	const [swiperIndex, setSwiperIndex] = useState(0);
	const [skuOpen, setSkuOpen] = useState(false);
	const [skuActionMode, setSkuActionMode] = useState<SkuActionMode>('all');
	const [selectedSku, setSelectedSku] = useState<GoodsSku | null>(null);
	const [selectedQty, setSelectedQty] = useState(1);

	const openSkuPicker = (mode: SkuActionMode) => {
		setSkuActionMode(mode);
		setSkuOpen(true);
	};

	const handleSkuConfirm = ({ sku, quantity, action }: SkuConfirmPayload) => {
		setSelectedSku(sku);
		setSelectedQty(quantity);
		if (action === 'cart') {
			if (!detail) return;
			addCart({ goodsId: detail.id, skuId: sku.id, quantity });
		} else {
			if (!detail) return;
			mapsTo(
				`${SHOP_ROUTES.checkout}?mode=buy_now&goodsId=${encodeURIComponent(detail.id)}&skuId=${encodeURIComponent(sku.id)}&quantity=${quantity}`,
			);
		}
	};

	const galleryImages = detail?.images?.length ? detail.images : detail?.cover ? [detail.cover] : [];
	const selectedSpecLabel = selectedSku
		? `${Object.values(selectedSku.specs || {}).join(' / ') || '默认规格'} × ${selectedQty}`
		: detail?.specs?.length
			? `请选择 ${detail.specs.map((s) => s.name).join(' / ')}`
			: '默认规格';

	return (
		<Page paddingX={false} title="商品详情">
			{isLoading ? (
				<View className="flex flex-col gap-3">
					<Skeleton className="w-full h-92 rounded-none" />
					<View className="container-x flex flex-col gap-3">
						<Card className="gap-2.5">
							<Skeleton className="h-7 w-1/3" />
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-4 w-2/3" />
						</Card>
						<Card className="gap-2.5">
							<Skeleton className="h-5 w-1/2" />
							<Skeleton className="h-5 w-2/3" />
						</Card>
					</View>
				</View>
			) : !detail ? (
				<View className="container-x py-6">
					<Empty title="商品不存在或已下架" subTitle="请返回商品列表挑选其他好物" />
				</View>
			) : (
				<>
					<View className="flex flex-col gap-3 pb-28">
						{/* 顶部商品轮播 */}
						<View className="relative bg-zinc-100">
							<Carousel
								isFull
								autoplay={false}
								indicatorDots={false}
								heightClass="h-92"
								list={galleryImages.map((pic, idx) => ({ id: idx, pic }))}
								onChange={(e) => setSwiperIndex(e.detail.current)}
								onItemClick={(_item, idx) => ImagePreview.show({ urls: galleryImages, current: idx })}
							/>
							{galleryImages.length > 1 && (
								<View className="absolute right-3 bottom-3 px-2.5 py-0.5 rounded-full bg-zinc-900/60 text-white text-xs tabular-nums">
									<Text>
										{swiperIndex + 1}/{galleryImages.length}
									</Text>
								</View>
							)}
						</View>

						<View className="container-x flex flex-col gap-3">
							{/* 价格与标题 */}
							<Card className="gap-2">
								<View className="flex items-baseline justify-between gap-2">
									<Price
										value={selectedSku?.price ?? detail.price}
										originalPrice={selectedSku?.originalPrice ?? detail.originalPrice}
										inCent
										size="xl"
									/>
									<Text className="text-xs text-zinc-400">已售 {detail.sales} 件</Text>
								</View>

								<Text className="text-base font-bold leading-snug">{detail.title}</Text>

								{detail.subtitle && <Text className="text-xs text-zinc-500 leading-relaxed">{detail.subtitle}</Text>}

								{detail.tags && detail.tags.length > 0 && (
									<View className="flex items-center flex-wrap gap-1.5 pt-1">
										{detail.tags.map((tag) => (
											<Badge key={tag} variant="primary">
												{tag}
											</Badge>
										))}
									</View>
								)}
							</Card>

							{/* 规格与服务 */}
							<Card className="gap-3">
								<View
									className="flex items-center justify-between gap-3 cursor-pointer active:opacity-70"
									onClick={() => openSkuPicker('all')}
								>
									<View className="flex items-center gap-3 min-w-0 flex-1">
										<Text className="text-xs text-zinc-400 shrink-0">规格</Text>
										<Text className="text-sm font-medium truncate">{selectedSpecLabel}</Text>
									</View>
									<View className="icon-[ph--caret-right] size-4 text-zinc-400 shrink-0" />
								</View>

								{detail.services && detail.services.length > 0 && (
									<>
										<Divider />
										<View className="flex items-start gap-3">
											<Text className="text-xs text-zinc-400 shrink-0 mt-0.5">保障</Text>
											<View className="flex flex-wrap gap-x-3 gap-y-1.5 flex-1">
												{detail.services.map((srv) => (
													<View key={srv} className="flex items-center gap-1 text-xs text-zinc-600">
														<View className="icon-[ph--check-circle] size-3.5 text-emerald-500 shrink-0" />
														<Text>{srv}</Text>
													</View>
												))}
											</View>
										</View>
									</>
								)}
							</Card>

							{/* 商品图文详情 */}
							<Card className="gap-3">
								<Heading title="商品详情" size="sm" />
								{detail.description && (
									<Text className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
										{detail.description}
									</Text>
								)}
								{detail.detailImages && detail.detailImages.length > 0 && (
									<View className="flex flex-col gap-2">
										{detail.detailImages.map((img, idx) => (
											<Image
												key={img + idx}
												src={img}
												mode="widthFix"
												lazyLoad
												className="w-full rounded-lg bg-zinc-100"
												onClick={() => ImagePreview.show({ urls: detail.detailImages!, current: idx })}
											/>
										))}
									</View>
								)}
							</Card>
						</View>
					</View>

					{/* 吸底购买操作栏 */}
					<View className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-100 px-4 py-2.5 pb-safe z-20 flex items-center gap-3">
						<View className="flex items-center gap-4 shrink-0 px-1">
							<TaroButton
								openType="contact"
								className="inline-flex w-fit flex-col items-center justify-center gap-0.5 m-0 p-0 bg-transparent text-zinc-600 leading-none after:border-0 active:opacity-70"
							>
								<View className="icon-[ph--headset] size-5" />
								<Text className="text-xs">客服</Text>
							</TaroButton>

							<View
								className="relative flex flex-col items-center justify-center gap-0.5 text-zinc-600 leading-none cursor-pointer active:opacity-70"
								onClick={() => mapsTo(SHOP_ROUTES.cart)}
							>
								<View className="icon-[ph--shopping-cart-simple] size-5" />
								<Text className="text-xs">购物车</Text>
								{cartCount > 0 && (
									<View className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-xs font-semibold flex items-center justify-center leading-none">
										<Text>{cartCount > 99 ? '99+' : cartCount}</Text>
									</View>
								)}
							</View>
						</View>

						<View className="flex-1 min-w-0 flex items-center gap-2">
							<View className="flex-1 min-w-0">
								<Button
									block
									size="md"
									variant="primary"
									appearance="soft"
									disabled={detail.stock <= 0}
									onClick={() => openSkuPicker('cart')}
								>
									加入购物车
								</Button>
							</View>
							<View className="flex-1 min-w-0">
								<Button
									block
									size="md"
									variant="primary"
									disabled={detail.stock <= 0}
									onClick={() => openSkuPicker('buy')}
								>
									{detail.stock <= 0 ? '暂时缺货' : '立即购买'}
								</Button>
							</View>
						</View>
					</View>

					{/* 多规格 SKU 选择弹窗 */}
					<SkuPicker
						open={skuOpen}
						onOpenChange={setSkuOpen}
						goods={detail}
						actionMode={skuActionMode}
						initialSkuId={selectedSku?.id}
						onConfirm={handleSkuConfirm}
					/>
				</>
			)}
		</Page>
	);
}
