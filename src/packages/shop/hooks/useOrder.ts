import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Taro from '@tarojs/taro';
import {
	cancelOrderAPI,
	confirmReceiveAPI,
	createOrderAPI,
	getCheckoutPreviewAPI,
	getOrderDetailAPI,
	getOrderListAPI,
	payOrderAPI,
} from '../services';
import { CheckoutPreviewPayload, CreateOrderPayload, OrderListQuery } from '../types';

/** 获取结算页预览数据 */
export const useCheckoutPreview = (params: CheckoutPreviewPayload, enabled = true) => {
	return useQuery({
		queryKey: ['shop', 'order', 'preview', params],
		queryFn: async () => {
			const res = await getCheckoutPreviewAPI(params);
			return res.data;
		},
		enabled,
	});
};

/** 创建订单 */
export const useCreateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: CreateOrderPayload) => {
			const res = await createOrderAPI(payload);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['shop', 'cart', 'list']);
			queryClient.invalidateQueries(['shop', 'order', 'list']);
		},
	});
};

/** 获取订单分页列表 */
export const useOrderList = (params: OrderListQuery) => {
	return useQuery({
		queryKey: ['shop', 'order', 'list', params],
		queryFn: async () => {
			const res = await getOrderListAPI(params);
			return res.data;
		},
		keepPreviousData: true,
	});
};

/** 获取订单详情 */
export const useOrderDetail = (id?: string) => {
	return useQuery({
		queryKey: ['shop', 'order', 'detail', id],
		queryFn: async () => {
			if (!id) return null;
			const res = await getOrderDetailAPI(id);
			return res.data;
		},
		enabled: Boolean(id),
	});
};

/**
 * 可插拔支付 Hook
 * 小程序端返回原生支付参数时调起 Taro.requestPayment；H5/Mock 环境平滑走模拟支付成功
 */
export const usePayOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await payOrderAPI(id);
			const payParams = res.data?.payParams;
			if (process.env.TARO_ENV === 'weapp' && payParams?.timeStamp && payParams?.paySign) {
				await Taro.requestPayment({
					timeStamp: payParams.timeStamp,
					nonceStr: payParams.nonceStr,
					package: payParams.package,
					signType: payParams.signType || 'MD5',
					paySign: payParams.paySign,
				});
			}
			return res.data;
		},
		onSuccess: (_res, id) => {
			Taro.showToast({ title: '支付成功', icon: 'success' });
			queryClient.invalidateQueries(['shop', 'order', 'list']);
			queryClient.invalidateQueries(['shop', 'order', 'detail', id]);
		},
	});
};

/** 取消订单 */
export const useCancelOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => cancelOrderAPI(id),
		onSuccess: (_res, id) => {
			Taro.showToast({ title: '订单已取消', icon: 'success' });
			queryClient.invalidateQueries(['shop', 'order', 'list']);
			queryClient.invalidateQueries(['shop', 'order', 'detail', id]);
		},
	});
};

/** 确认收货 */
export const useConfirmReceive = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => confirmReceiveAPI(id),
		onSuccess: (_res, id) => {
			Taro.showToast({ title: '已确认收货', icon: 'success' });
			queryClient.invalidateQueries(['shop', 'order', 'list']);
			queryClient.invalidateQueries(['shop', 'order', 'detail', id]);
		},
	});
};
