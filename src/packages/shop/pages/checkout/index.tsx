import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useEffect, useMemo, useState } from 'react';
import {
	Page,
	Card,
	Divider,
	DescriptionList,
	Description,
	Input,
	Price,
	Button,
	Skeleton,
	Empty,
	Icon,
} from '@/components/ui';
import { mapsTo } from '@/utils/common';
import { useCheckoutPreview, useCreateOrder, usePayOrder } from '../../hooks';
import { SHOP_ROUTES } from '../../routes';
import { CheckoutPreviewPayload, OrderAddress } from '../../types';

/** 跨模块选址约定（严禁直接 import packages/address，通过路由与事件解耦） */
const ADDRESS_SELECT_URL = '/packages/address/pages/list/index';
const ADDRESS_SELECTED_EVENT = 'address:selected';

export default function CheckoutPage() {
	const { params } = useRouter();
	const mode = params.mode === 'buy_now' ? 'buy_now' : 'cart';

	const previewParams = useMemo<CheckoutPreviewPayload>(() => {
		if (mode === 'buy_now') {
			return {
				mode: 'buy_now',
				goodsId: params.goodsId ? decodeURIComponent(params.goodsId) : undefined,
				skuId: params.skuId ? decodeURIComponent(params.skuId) : undefined,
				quantity: params.quantity ? Math.max(1, Number(params.quantity)) : 1,
			};
		}
		const cartIds = params.cartIds
			? decodeURIComponent(params.cartIds)
					.split(',')
					.filter(Boolean)
			: [];
		return { mode: 'cart', cartIds };
	}, [mode, params.goodsId, params.skuId, params.quantity, params.cartIds]);

	const { data: preview, isLoading } = useCheckoutPreview(previewParams);
	const { mutateAsync: createOrder, isLoading: isCreating } = useCreateOrder();
	const { mutateAsync: payOrder, isLoading: isPaying } = usePayOrder();

	const [pickedAddress, setPickedAddress] = useState<OrderAddress | null>(null);
	const [remark, setRemark] = useState('');

	// 监听地址模块选择模式回传的地址
	useEffect(() => {
		const handleAddressSelected = (addr: OrderAddress) => {
			if (addr) setPickedAddress(addr);
		};
		Taro.eventCenter.on(ADDRESS_SELECTED_EVENT, handleAddressSelected);
		return () => {
			Taro.eventCenter.off(ADDRESS_SELECTED_EVENT, handleAddressSelected);
		};
	}, []);

	const activeAddress = pickedAddress || preview?.address || null;

	const handleSelectAddress = () => {
		const query = activeAddress?.id
			? `?mode=select&selectedId=${encodeURIComponent(activeAddress.id)}`
			: '?mode=select';
		mapsTo(`${ADDRESS_SELECT_URL}${query}`);
	};

	const handleSubmitOrder = async () => {
		if (!activeAddress?.id) {
			Taro.showToast({ title: '请先选择收货地址', icon: 'none' });
			return;
		}
		if (!preview?.items?.length) {
			Taro.showToast({ title: '商品信息异常，请返回重试', icon: 'none' });
			return;
		}

		try {
			const orderRes = await createOrder({
				...previewParams,
				addressId: activeAddress.id,
				remark: remark.trim() || undefined,
			});
			const orderId = orderRes?.id;
			if (!orderId) return;

			// 引导支付（取消支付则仍跳转订单详情页待付款）
			try {
				await payOrder(orderId);
			} catch {
				Taro.showToast({ title: '已创建待付款订单', icon: 'none' });
			}

			setTimeout(() => {
				mapsTo(`${SHOP_ROUTES.orderDetail}?id=${encodeURIComponent(orderId)}`, 'redirectTo');
			}, 400);
		} catch (err: any) {
			Taro.showToast({ title: err?.msg || err?.message || '下单失败，请重试', icon: 'none' });
		}
	};

	const isSubmitting = isCreating || isPaying;
	const fullAddress = activeAddress
		? `${activeAddress.province}${activeAddress.city}${activeAddress.district} ${activeAddress.detail}`.trim()
		: '';

	return (
		<Page title="确认订单">
			<View className="py-3 flex flex-col gap-3 flex-1 pb-28">
				{isLoading ? (
					<>
						<Card className="gap-2.5">
							<Skeleton className="h-5 w-1/2" />
							<Skeleton className="h-4 w-full" />
						</Card>
						<Card className="gap-3">
							<Skeleton className="h-16 w-full" />
							<Skeleton className="h-16 w-full" />
						</Card>
					</>
				) : !preview || preview.items.length === 0 ? (
					<Empty title="暂无可结算商品" subTitle="请返回重新选择商品后再试" />
				) : (
					<>
						{/* 收货地址选择卡片（零耦合联动 packages/address） */}
						<Card layout="horizontal" className="items-center gap-3 py-3.5" onClick={handleSelectAddress}>
							<Icon icon="icon-[ph--map-pin-duotone]" shape="circle" size="md" theme="primary" />

							{activeAddress ? (
								<View className="flex-1 min-w-0 flex flex-col gap-1">
									<View className="flex items-center gap-2">
										<Text className="text-sm font-bold">{activeAddress.name}</Text>
										<Text className="text-xs text-zinc-500">{activeAddress.phone}</Text>
									</View>
									<Text className="text-xs text-zinc-600 leading-relaxed line-clamp-2">{fullAddress}</Text>
								</View>
							) : (
								<View className="flex-1 min-w-0">
									<Text className="text-sm font-semibold">请选择收货地址</Text>
									<Text className="text-xs text-zinc-400 block mt-0.5">点击前往地址簿选择或新建地址</Text>
								</View>
							)}

							<View className="icon-[ph--caret-right] size-4 text-zinc-400 shrink-0" />
						</Card>

						{/* 商品清单 */}
						<Card className="gap-3">
							{preview.items.map((goods, idx) => (
								<View key={`${goods.goodsId}_${goods.skuId}`}>
									{idx > 0 && <Divider className="mb-3" />}
									<View className="flex items-start gap-3">
										<Image
											src={goods.image}
											mode="aspectFill"
											className="size-18 rounded-lg bg-zinc-100 shrink-0"
										/>
										<View className="flex-1 min-w-0 flex flex-col gap-1">
											<Text className="text-sm font-semibold leading-snug line-clamp-2">{goods.title}</Text>
											{goods.specText && <Text className="text-xs text-zinc-400 truncate">{goods.specText}</Text>}
											<View className="flex items-baseline justify-between pt-1">
												<Price value={goods.price} inCent size="sm" />
												<Text className="text-xs text-zinc-400">×{goods.quantity}</Text>
											</View>
										</View>
									</View>
								</View>
							))}
						</Card>

						{/* 金额明细与备注（后续如需扩展优惠券/发票可直接在此卡片追加行） */}
						<Card className="gap-3">
							<DescriptionList divider>
								<Description
									label="商品金额"
									variant="between"
									value={<Price value={preview.goodsAmount} inCent size="sm" variant="zinc" />}
								/>
								<Description
									label="运费"
									variant="between"
									value={
										preview.freightAmount > 0 ? (
											<Price value={preview.freightAmount} inCent size="sm" variant="zinc" />
										) : (
											<Text className="text-xs text-emerald-600 font-medium">免运费</Text>
										)
									}
								/>
								{Boolean(preview.discountAmount && preview.discountAmount > 0) && (
									<Description
										label="优惠抵扣"
										variant="between"
										value={
											<View className="flex items-baseline text-rose-500">
												<Text className="text-xs mr-0.5">-</Text>
												<Price value={preview.discountAmount!} inCent size="sm" variant="rose" />
											</View>
										}
									/>
								)}
							</DescriptionList>

							<Divider />

							<View className="flex items-center gap-3">
								<Text className="text-sm text-zinc-600 shrink-0">买家备注</Text>
								<Input
									variant="ghost"
									placeholder="选填，可填写配送时间或特殊需求"
									maxlength={80}
									value={remark}
									onChange={setRemark}
									inputClassName="text-right"
								/>
							</View>
						</Card>
					</>
				)}
			</View>

			{/* 吸底提交订单栏 */}
			{preview && preview.items.length > 0 && (
				<View className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-100 px-4 py-2.5 pb-safe z-20 flex items-center justify-between gap-3">
					<View className="flex items-baseline gap-1.5">
						<Text className="text-xs text-zinc-500">实付金额</Text>
						<Price value={preview.payAmount} inCent size="xl" />
					</View>

					<Button
						size="lg"
						variant="primary"
						className="shrink-0"
						loading={isSubmitting}
						disabled={isSubmitting}
						onClick={handleSubmitOrder}
					>
						提交订单
					</Button>
				</View>
			)}
		</Page>
	);
}
