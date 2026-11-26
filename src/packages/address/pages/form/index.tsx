import { View, Switch } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { Page, Card, FormItem, Input, Textarea, Select, Button, Skeleton } from '@/components/ui';
import { useAddressDetail, useCreateAddress, useDeleteAddress, useUpdateAddress } from '../../hooks';
import { ADDRESS_TAG_OPTIONS } from '../../types';

const PHONE_REG = /^1[3-9]\d{9}$/;

export default function AddressFormPage() {
	const { params } = useRouter();
	const id = params.id ? decodeURIComponent(params.id) : '';
	const isEdit = Boolean(id);

	const { data: detail, isLoading: isLoadingDetail } = useAddressDetail(id);
	const { mutateAsync: createAddress, isLoading: isCreating } = useCreateAddress();
	const { mutateAsync: updateAddress, isLoading: isUpdating } = useUpdateAddress();
	const { mutateAsync: deleteAddress, isLoading: isDeleting } = useDeleteAddress();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [province, setProvince] = useState('');
	const [city, setCity] = useState('');
	const [district, setDistrict] = useState('');
	const [detailText, setDetailText] = useState('');
	const [tag, setTag] = useState('');
	const [isDefault, setIsDefault] = useState(false);

	const [errors, setErrors] = useState<{
		name?: string;
		phone?: string;
		region?: string;
		detail?: string;
	}>({});

	useEffect(() => {
		if (isEdit) {
			Taro.setNavigationBarTitle({ title: '编辑收货地址' }).catch(() => {});
		}
	}, [isEdit]);

	// 编辑态自动回填表单
	useEffect(() => {
		if (!detail) return;
		setName(detail.name || '');
		setPhone(detail.phone || '');
		setProvince(detail.province || '');
		setCity(detail.city || '');
		setDistrict(detail.district || '');
		setDetailText(detail.detail || '');
		setTag(detail.tag || '');
		setIsDefault(Boolean(detail.isDefault));
	}, [detail]);

	const clearFieldError = (key: keyof typeof errors) => {
		if (errors[key]) {
			setErrors((prev) => ({ ...prev, [key]: undefined }));
		}
	};

	const validate = () => {
		const nextErrors: typeof errors = {};
		if (!name.trim()) nextErrors.name = '请输入收货人姓名';
		if (!PHONE_REG.test(phone.trim())) nextErrors.phone = '请输入正确的 11 位手机号';
		if (!province.trim() || !city.trim() || !district.trim()) {
			nextErrors.region = '请选择所在省 / 市 / 区';
		}
		if (detailText.trim().length < 3) nextErrors.detail = '请输入详细的街道、楼栋或门牌号';

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		const payload = {
			name: name.trim(),
			phone: phone.trim(),
			province: province.trim(),
			city: city.trim(),
			district: district.trim(),
			detail: detailText.trim(),
			tag: tag || undefined,
			isDefault,
		};

		try {
			if (isEdit) {
				await updateAddress({ id, data: payload });
			} else {
				await createAddress(payload);
			}
			setTimeout(() => {
				Taro.navigateBack();
			}, 400);
		} catch (err: any) {
			Taro.showToast({ title: err?.msg || err?.message || '保存失败，请重试', icon: 'none' });
		}
	};

	const handleDelete = () => {
		Taro.showModal({
			title: '删除地址',
			content: '确定要删除这条收货地址吗？',
			confirmColor: '#f43f5e',
			success: async (res) => {
				if (!res.confirm) return;
				try {
					await deleteAddress(id);
					setTimeout(() => {
						Taro.navigateBack();
					}, 400);
				} catch (err: any) {
					Taro.showToast({ title: err?.msg || '删除失败', icon: 'none' });
				}
			},
		});
	};

	const isSaving = isCreating || isUpdating;

	return (
		<Page title={isEdit ? '编辑收货地址' : '新增收货地址'}>
			<View className="py-4 flex flex-col gap-4 pb-10">
				{isEdit && isLoadingDetail ? (
					<Card className="gap-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-20 w-full" />
					</Card>
				) : (
					<>
						<Card className="gap-1">
							<FormItem layout="column" label="收货人" required error={errors.name}>
								<Input
									variant="filled"
									maxlength={20}
									placeholder="请输入收货人姓名"
									value={name}
									onChange={(val) => {
										setName(val);
										clearFieldError('name');
									}}
									error={Boolean(errors.name)}
									clearable
								/>
							</FormItem>

							<FormItem layout="column" label="手机号码" required error={errors.phone}>
								<Input
									variant="filled"
									type="number"
									maxlength={11}
									placeholder="请输入 11 位手机号码"
									value={phone}
									onChange={(val) => {
										setPhone(val);
										clearFieldError('phone');
									}}
									error={Boolean(errors.phone)}
									clearable
								/>
							</FormItem>

							<FormItem layout="column" label="所在地区" required error={errors.region}>
								<Select
									mode="region"
									placeholder="请选择省 / 市 / 区"
									value={province && city && district ? [province, city, district] : []}
									onChange={(res) => {
										setProvince(res.province.name);
										setCity(res.city.name);
										setDistrict(res.district.name);
										clearFieldError('region');
									}}
								/>
							</FormItem>

							<FormItem layout="column" label="详细地址" required error={errors.detail}>
								<Textarea
									variant="filled"
									placeholder="街道、小区、楼栋号、门牌号等"
									value={detailText}
									onChange={(val) => {
										setDetailText(val);
										clearFieldError('detail');
									}}
									maxlength={100}
									showCount
									error={Boolean(errors.detail)}
									textareaClassName="h-20"
								/>
							</FormItem>
						</Card>

						<Card className="py-1">
							<FormItem label="地址标签" border>
								<View className="flex items-center gap-2">
									{ADDRESS_TAG_OPTIONS.map((item) => {
										const active = tag === item;
										return (
											<Button
												key={item}
												size="xs"
												appearance={active ? 'soft' : 'outline'}
												variant={active ? 'primary' : 'zinc'}
												onClick={() => setTag(active ? '' : item)}
											>
												{item}
											</Button>
										);
									})}
								</View>
							</FormItem>

							<FormItem label="设为默认地址" border={false}>
								<Switch
									checked={isDefault}
									color="#155dfc"
									onChange={(e) => setIsDefault(Boolean(e.detail.value))}
								/>
							</FormItem>
						</Card>

						<View className="flex flex-col gap-3 mt-1">
							<Button
								size="xl"
								block
								variant="primary"
								loading={isSaving}
								disabled={isSaving || isDeleting}
								onClick={handleSubmit}
							>
								保存收货地址
							</Button>

							{isEdit && (
								<Button
									size="lg"
									block
									variant="rose"
									appearance="outline"
									loading={isDeleting}
									disabled={isSaving || isDeleting}
									onClick={handleDelete}
								>
									删除该地址
								</Button>
							)}
						</View>
					</>
				)}
			</View>
		</Page>
	);
}
