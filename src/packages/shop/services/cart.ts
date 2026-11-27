import { http } from '@/utils/http';
import { BaseResponse } from '@/types/common';
import { AddCartPayload, CartItem, UpdateCartPayload } from '../types';

/**
 * 获取购物车列表
 * GET /shop/cart/list
 */
export const getCartListAPI = () => http.get<BaseResponse<CartItem[]>>('/shop/cart/list', undefined, { silent: true });

/**
 * 加入购物车
 * POST /shop/cart/add
 */
export const addCartAPI = (data: AddCartPayload) => http.post<BaseResponse<{ id: string }>>('/shop/cart/add', data);

/**
 * 更新购物车单项（数量或勾选状态）
 * PUT /shop/cart/update
 */
export const updateCartItemAPI = (data: UpdateCartPayload) =>
	http.put<BaseResponse<null>>('/shop/cart/update', data, { silent: true });

/**
 * 全选 / 取消全选购物车
 * PUT /shop/cart/toggle-all
 */
export const toggleAllCartAPI = (selected: boolean) =>
	http.put<BaseResponse<null>>('/shop/cart/toggle-all', { selected }, { silent: true });

/**
 * 批量删除购物车商品
 * POST /shop/cart/remove
 */
export const removeCartItemsAPI = (ids: string[]) => http.post<BaseResponse<null>>('/shop/cart/remove', { ids });
