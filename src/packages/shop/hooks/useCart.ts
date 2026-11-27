import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Taro from '@tarojs/taro';
import { useMemo } from 'react';
import {
	addCartAPI,
	getCartListAPI,
	removeCartItemsAPI,
	toggleAllCartAPI,
	updateCartItemAPI,
} from '../services';
import { AddCartPayload, CartItem, UpdateCartPayload } from '../types';

const CART_QUERY_KEY = ['shop', 'cart', 'list'] as const;

/** 获取购物车列表及实时汇总指标 */
export const useCartList = (enabled = true) => {
	const query = useQuery({
		queryKey: CART_QUERY_KEY,
		queryFn: async () => {
			const res = await getCartListAPI();
			return res.data || [];
		},
		enabled,
	});

	const items = query.data || [];

	const summary = useMemo(() => {
		const validItems = items.filter((item) => !item.invalid && item.stock > 0);
		const invalidItems = items.filter((item) => item.invalid || item.stock <= 0);
		const selectedItems = validItems.filter((item) => item.selected);
		const totalCount = validItems.reduce((acc, item) => acc + item.quantity, 0);
		const selectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
		const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
		const isAllSelected = validItems.length > 0 && selectedItems.length === validItems.length;

		return {
			items,
			validItems,
			invalidItems,
			selectedItems,
			totalCount,
			selectedCount,
			totalPrice,
			isAllSelected,
		};
	}, [items]);

	return { ...query, ...summary };
};

/** 加入购物车 */
export const useAddCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: AddCartPayload) => addCartAPI(payload),
		onSuccess: () => {
			Taro.showToast({ title: '已加入购物车', icon: 'success' });
			queryClient.invalidateQueries(CART_QUERY_KEY);
		},
	});
};

/** 更新购物车单项（数量/勾选，支持乐观更新） */
export const useUpdateCartItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateCartPayload) => updateCartItemAPI(payload),
		onMutate: async (payload) => {
			await queryClient.cancelQueries(CART_QUERY_KEY);
			const previous = queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY);
			if (previous) {
				queryClient.setQueryData<CartItem[]>(
					CART_QUERY_KEY,
					previous.map((item) => (item.id === payload.id ? { ...item, ...payload } : item)),
				);
			}
			return { previous };
		},
		onError: (_err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(CART_QUERY_KEY, context.previous);
			}
		},
	});
};

/** 全选 / 取消全选（支持乐观更新） */
export const useToggleAllCart = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (selected: boolean) => toggleAllCartAPI(selected),
		onMutate: async (selected) => {
			await queryClient.cancelQueries(CART_QUERY_KEY);
			const previous = queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY);
			if (previous) {
				queryClient.setQueryData<CartItem[]>(
					CART_QUERY_KEY,
					previous.map((item) =>
						item.invalid || item.stock <= 0 ? item : { ...item, selected },
					),
				);
			}
			return { previous };
		},
		onError: (_err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(CART_QUERY_KEY, context.previous);
			}
		},
	});
};

/** 批量删除购物车商品 */
export const useRemoveCartItems = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => removeCartItemsAPI(ids),
		onSuccess: () => {
			Taro.showToast({ title: '已移出购物车', icon: 'success' });
			queryClient.invalidateQueries(CART_QUERY_KEY);
		},
	});
};
