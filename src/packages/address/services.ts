import { http } from '@/utils/http';
import { BaseResponse } from '@/types/common';
import { AddressFormPayload, AddressItem } from './types';

/**
 * 获取当前用户收货地址列表
 * GET /address/list
 */
export const getAddressListAPI = () => http.get<BaseResponse<AddressItem[]>>('/address/list');

/**
 * 获取单条地址详情
 * GET /address/detail
 */
export const getAddressDetailAPI = (id: string) => http.get<BaseResponse<AddressItem>>('/address/detail', { id });

/**
 * 新增收货地址
 * POST /address/create
 */
export const createAddressAPI = (data: AddressFormPayload) =>
	http.post<BaseResponse<{ id: string }>>('/address/create', data);

/**
 * 更新收货地址
 * PUT /address/update
 */
export const updateAddressAPI = (id: string, data: AddressFormPayload) =>
	http.put<BaseResponse<null>>('/address/update', { id, ...data });

/**
 * 删除收货地址
 * DELETE /address/delete
 */
export const deleteAddressAPI = (id: string) => http.delete<BaseResponse<null>>('/address/delete', { id });

/**
 * 设为默认地址
 * PUT /address/set-default
 */
export const setDefaultAddressAPI = (id: string) => http.put<BaseResponse<null>>('/address/set-default', { id });
