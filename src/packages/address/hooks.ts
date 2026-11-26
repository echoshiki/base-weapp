import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Taro from '@tarojs/taro';
import {
	createAddressAPI,
	deleteAddressAPI,
	getAddressDetailAPI,
	getAddressListAPI,
	setDefaultAddressAPI,
	updateAddressAPI,
} from './services';
import { AddressFormPayload } from './types';

/** 获取收货地址列表（默认地址置顶） */
export const useAddressList = () => {
	return useQuery({
		queryKey: ['address', 'list'],
		queryFn: async () => {
			const res = await getAddressListAPI();
			const rows = res.data || [];
			return [...rows].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
		},
	});
};

/** 获取单条地址详情 */
export const useAddressDetail = (id?: string) => {
	return useQuery({
		queryKey: ['address', 'detail', id],
		queryFn: async () => {
			if (!id) return null;
			const res = await getAddressDetailAPI(id);
			return res.data;
		},
		enabled: Boolean(id),
	});
};

/** 新增收货地址 */
export const useCreateAddress = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: AddressFormPayload) => {
			const res = await createAddressAPI(data);
			return res.data;
		},
		onSuccess: () => {
			Taro.showToast({ title: '添加成功', icon: 'success' });
			queryClient.invalidateQueries(['address', 'list']);
		},
	});
};

/** 更新收货地址 */
export const useUpdateAddress = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: AddressFormPayload }) => updateAddressAPI(id, data),
		onSuccess: (_res, vars) => {
			Taro.showToast({ title: '保存成功', icon: 'success' });
			queryClient.invalidateQueries(['address', 'list']);
			queryClient.invalidateQueries(['address', 'detail', vars.id]);
		},
	});
};

/** 删除收货地址 */
export const useDeleteAddress = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteAddressAPI(id),
		onSuccess: () => {
			Taro.showToast({ title: '已删除', icon: 'success' });
			queryClient.invalidateQueries(['address', 'list']);
		},
	});
};

/** 设为默认地址 */
export const useSetDefaultAddress = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => setDefaultAddressAPI(id),
		onSuccess: () => {
			Taro.showToast({ title: '已设为默认地址', icon: 'success' });
			queryClient.invalidateQueries(['address', 'list']);
		},
	});
};
