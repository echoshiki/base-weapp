import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useMemo, useState } from 'react';
import { Button, Divider, Drawer, ImagePreview, Price, Stepper } from '@/components/ui';
import { cn } from '@/utils/common';
import { GoodsDetail, GoodsSku } from '../types';

export type SkuActionMode = 'all' | 'cart' | 'buy';

export interface SkuConfirmPayload {
	sku: GoodsSku;
	quantity: number;
	action: 'cart' | 'buy';
}

export interface SkuPickerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	goods: GoodsDetail;
	/** 弹窗底部按钮模式：all(双按钮) | cart(加入购物车) | buy(立即购买) */
	actionMode?: SkuActionMode;
	/** 外部受控的初始选中 SKU ID */
	initialSkuId?: string;
	onConfirm?: (payload: SkuConfirmPayload) => void;
}

/**
 * 商品多规格 SKU 选择弹窗
 * 支持多维度规格联动、无货组合自动置灰、图片预览、价格/库存实时切换与数量步进
 */
export function SkuPicker({
	open,
	onOpenChange,
	goods,
	actionMode = 'all',
	initialSkuId,
	onConfirm,
}: SkuPickerProps) {
	const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
	const [quantity, setQuantity] = useState(1);

	const specGroups = goods.specs || [];
	const skus = goods.skus || [];
	const hasMultiSpecs = specGroups.length > 0 && skus.length > 0;

	// 打开弹窗时初始化默认选中有库存的 SKU
	useEffect(() => {
		if (!open) return;
		setQuantity(1);
		if (!hasMultiSpecs) {
			setSelectedSpecs({});
			return;
		}
		const targetSku =
			skus.find((s) => s.id === initialSkuId && s.stock > 0) ||
			skus.find((s) => s.stock > 0) ||
			skus[0];
		setSelectedSpecs(targetSku ? { ...targetSku.specs } : {});
	}, [open, goods.id, initialSkuId]);

	// 匹配当前已完整选中的 SKU
	const activeSku = useMemo<GoodsSku | null>(() => {
		if (!hasMultiSpecs) {
			return (
				skus[0] || {
					id: goods.id,
					specs: {},
					price: goods.price,
					originalPrice: goods.originalPrice,
					stock: goods.stock,
					image: goods.cover,
				}
			);
		}
		const isComplete = specGroups.every((g) => Boolean(selectedSpecs[g.name]));
		if (!isComplete) return null;
		return (
			skus.find((sku) => specGroups.every((g) => sku.specs[g.name] === selectedSpecs[g.name])) || null
		);
	}, [hasMultiSpecs, skus, specGroups, selectedSpecs, goods]);

	// 判断某个规格选项在当前已选其他维度的条件下是否存在有货 SKU
	const isOptionAvailable = (groupName: string, value: string) => {
		return skus.some((sku) => {
			if (sku.stock <= 0) return false;
			if (sku.specs[groupName] !== value) return false;
			return Object.entries(selectedSpecs).every(([k, v]) => {
				if (k === groupName || !v) return true;
				return sku.specs[k] === v;
			});
		});
	};

	const handleSelectOption = (groupName: string, value: string, available: boolean) => {
		if (!available) return;
		setSelectedSpecs((prev) => {
			if (prev[groupName] === value) {
				const next = { ...prev };
				delete next[groupName];
				return next;
			}
			return { ...prev, [groupName]: value };
		});
		setQuantity(1);
	};

	const displayImage = activeSku?.image || goods.cover;
	const displayPrice = activeSku?.price ?? goods.price;
	const displayOriginalPrice = activeSku?.originalPrice ?? goods.originalPrice;
	const displayStock = activeSku?.stock ?? goods.stock;

	const selectedSummary = useMemo(() => {
		if (!hasMultiSpecs) return '默认规格';
		const missing = specGroups.filter((g) => !selectedSpecs[g.name]).map((g) => g.name);
		if (missing.length > 0) return `请选择 ${missing.join(' / ')}`;
		return `已选：${specGroups.map((g) => selectedSpecs[g.name]).join(' / ')}`;
	}, [hasMultiSpecs, specGroups, selectedSpecs]);

	const handleAction = (action: 'cart' | 'buy') => {
		if (!activeSku) {
			const missing = specGroups.find((g) => !selectedSpecs[g.name]);
			Taro.showToast({ title: `请选择${missing?.name || '商品规格'}`, icon: 'none' });
			return;
		}
		if (activeSku.stock <= 0) {
			Taro.showToast({ title: '该规格暂时缺货', icon: 'none' });
			return;
		}
		onConfirm?.({ sku: activeSku, quantity, action });
		onOpenChange(false);
	};

	const isSoldOut = displayStock <= 0;

	return (
		<Drawer
			open={open}
			onOpenChange={onOpenChange}
			position="bottom"
			footer={
				<View className="flex items-center gap-3">
					{(actionMode === 'all' || actionMode === 'cart') && (
						<View className="flex-1 min-w-0">
							<Button
								block
								size="lg"
								variant="primary"
								appearance={actionMode === 'all' ? 'soft' : 'solid'}
								disabled={isSoldOut}
								onClick={() => handleAction('cart')}
							>
								加入购物车
							</Button>
						</View>
					)}
					{(actionMode === 'all' || actionMode === 'buy') && (
						<View className="flex-1 min-w-0">
							<Button
								block
								size="lg"
								variant="primary"
								disabled={isSoldOut}
								onClick={() => handleAction('buy')}
							>
								{isSoldOut ? '暂时缺货' : '立即购买'}
							</Button>
						</View>
					)}
				</View>
			}
		>
			<View className="p-4 flex flex-col gap-4">
				{/* 头部 SKU 预览区 */}
				<View className="flex items-end gap-3 pr-6">
					<Image
						src={displayImage}
						mode="aspectFill"
						className="size-22 rounded-card bg-zinc-100 shrink-0 cursor-pointer"
						onClick={() => ImagePreview.show({ urls: [displayImage], current: 0 })}
					/>
					<View className="flex-1 min-w-0 flex flex-col gap-1">
						<Price value={displayPrice} originalPrice={displayOriginalPrice} inCent size="xl" />
						<Text className="text-xs text-zinc-500">库存 {displayStock} 件</Text>
						<Text className="text-xs text-zinc-600 truncate">{selectedSummary}</Text>
					</View>
				</View>

				<Divider />

				{/* 多维度规格选择 */}
				{hasMultiSpecs && (
					<View className="flex flex-col gap-4">
						{specGroups.map((group) => (
							<View key={group.name} className="flex flex-col gap-2">
								<Text className="text-sm font-semibold">{group.name}</Text>
								<View className="flex flex-wrap gap-2">
									{group.values.map((val) => {
										const active = selectedSpecs[group.name] === val;
										const available = isOptionAvailable(group.name, val);
										return (
											<View
												key={val}
												onClick={() => handleSelectOption(group.name, val, available)}
												className={cn(
													'px-3.5 py-1.5 rounded-lg border text-xs transition-colors',
													active
														? 'border-primary bg-primary/10 text-primary font-semibold'
														: available
															? 'border-zinc-200 bg-zinc-50 text-zinc-700 active:bg-zinc-100 cursor-pointer'
															: 'border-zinc-100 bg-zinc-50 text-zinc-300 line-through',
												)}
											>
												<Text>{val}</Text>
											</View>
										);
									})}
								</View>
							</View>
						))}
						<Divider />
					</View>
				)}

				{/* 购买数量 */}
				<View className="flex items-center justify-between py-1">
					<Text className="text-sm font-semibold">购买数量</Text>
					<Stepper
						value={quantity}
						onChange={setQuantity}
						min={1}
						max={Math.max(1, displayStock)}
						disabled={isSoldOut}
					/>
				</View>
			</View>
		</Drawer>
	);
}
