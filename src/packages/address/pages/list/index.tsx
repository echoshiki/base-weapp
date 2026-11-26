import { View } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh, useRouter } from '@tarojs/taro';
import { useEffect } from 'react';
import { Page, Card, Skeleton, Empty, Button } from '@/components/ui';
import { mapsTo } from '@/utils/common';
import { useAddressList, useCreateAddress, useDeleteAddress, useSetDefaultAddress } from '../../hooks';
import { AddressCard } from '../../components/AddressCard';
import { ADDRESS_EVENTS, ADDRESS_ROUTES } from '../../routes';
import { AddressItem } from '../../types';

const isWeapp = process.env.TARO_ENV === 'weapp';

export default function AddressListPage() {
	const { params } = useRouter();
	const isSelectMode = params.mode === 'select';
	const selectedId = params.selectedId ? decodeURIComponent(params.selectedId) : '';

	const { data: list = [], isLoading, refetch } = useAddressList();
	const { mutate: deleteAddress } = useDeleteAddress();
	const { mutate: setDefaultAddress } = useSetDefaultAddress();
	const { mutateAsync: createAddress, isLoading: isImporting } = useCreateAddress();

	useEffect(() => {
		if (isSelectMode) {
			Taro.setNavigationBarTitle({ title: '选择收货地址' }).catch(() => {});
		}
	}, [isSelectMode]);

	useDidShow(() => {
		refetch().catch(() => {});
	});

	usePullDownRefresh(async () => {
		await refetch();
		Taro.stopPullDownRefresh();
	});

	const handleSelect = (item: AddressItem) => {
		Taro.eventCenter.trigger(ADDRESS_EVENTS.selected, item);
		Taro.navigateBack();
	};

	const handleEdit = (item: AddressItem) => {
		mapsTo(`${ADDRESS_ROUTES.form}?id=${encodeURIComponent(item.id)}`);
	};

	const handleDelete = (item: AddressItem) => {
		Taro.showModal({
			title: '删除地址',
			content: `确定删除「${item.name}」的收货地址吗？`,
			confirmColor: '#f43f5e',
			success: (res) => {
				if (res.confirm) {
					deleteAddress(item.id);
				}
			},
		});
	};

	/** 微信小程序端一键导入微信收货地址 */
	const handleWechatImport = async () => {
		try {
			const res = await Taro.chooseAddress();
			await createAddress({
				name: res.userName,
				phone: res.telNumber,
				province: res.provinceName,
				city: res.cityName,
				district: res.countyName,
				detail: res.detailInfo,
				isDefault: list.length === 0,
			});
		} catch (err: any) {
			if (err?.errMsg?.includes('cancel')) return;
			Taro.showToast({ title: '导入微信地址失败', icon: 'none' });
		}
	};

	return (
		<Page title={isSelectMode ? '选择收货地址' : '收货地址'}>
			<View className="py-3 flex flex-col gap-3 flex-1 pb-28">
				{isLoading ? (
					Array.from({ length: 3 }).map((_, idx) => (
						<Card key={idx} className="gap-2.5">
							<View className="flex items-center gap-2">
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-4 w-28" />
							</View>
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
						</Card>
					))
				) : list.length === 0 ? (
					<Empty
						title="暂无收货地址"
						subTitle="添加一个常用地址，下单或预约时可直接选用"
						buttonText="新增收货地址"
						onButtonClick={() => mapsTo(ADDRESS_ROUTES.form)}
					/>
				) : (
					list.map((item) => (
						<AddressCard
							key={item.id}
							item={item}
							selectable={isSelectMode}
							selected={isSelectMode && item.id === selectedId}
							onSelect={handleSelect}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onSetDefault={(target) => setDefaultAddress(target.id)}
						/>
					))
				)}
			</View>

			{/* 吸底操作栏 */}
			<View className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-100 px-4 py-3 pb-safe z-20 flex items-center gap-3">
				{isWeapp && (
					<Button
						size="lg"
						variant="emerald"
						appearance="soft"
						icon="icon-[ph--arrow-square-in-bold]"
						className="shrink-0"
						loading={isImporting}
						onClick={handleWechatImport}
					>
						微信导入
					</Button>
				)}
				<View className="flex-1 min-w-0">
					<Button
						size="lg"
						block
						variant="primary"
						icon="icon-[ph--plus-bold]"
						onClick={() => mapsTo(ADDRESS_ROUTES.form)}
					>
						新增收货地址
					</Button>
				</View>
			</View>
		</Page>
	);
}
