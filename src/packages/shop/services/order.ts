import { http } from '@/utils/http';
import { BaseResponse, PageData } from '@/types/common';
import {
	CheckoutPreviewData,
	CheckoutPreviewPayload,
	CreateOrderPayload,
	OrderItem,
	OrderListQuery,
	PayOrderResult,
} from '../types';

/**
 * 获取结算预览（地址、商品清单、运费与实付金额）
 * POST /shop/order/preview
 */
export const getCheckoutPreviewAPI = (data: CheckoutPreviewPayload) =>
	http.post<BaseResponse<CheckoutPreviewData>>('/shop/order/preview', data);

/**
 * 提交创建订单
 * POST /shop/order/create
 */
export const createOrderAPI = (data: CreateOrderPayload) =>
	http.post<BaseResponse<{ id: string; orderNo: string }>>('/shop/order/create', data);

/**
 * 获取订单分页列表
 * GET /shop/order/list
 */
export const getOrderListAPI = (params?: OrderListQuery) =>
	http.get<BaseResponse<PageData<OrderItem>>>('/shop/order/list', params);

/**
 * 获取订单详情
 * GET /shop/order/detail
 */
export const getOrderDetailAPI = (id: string) => http.get<BaseResponse<OrderItem>>('/shop/order/detail', { id });

/**
 * 发起订单支付
 * POST /shop/order/pay
 */
export const payOrderAPI = (id: string) => http.post<BaseResponse<PayOrderResult>>('/shop/order/pay', { id });

/**
 * 取消订单
 * PUT /shop/order/cancel
 */
export const cancelOrderAPI = (id: string) => http.put<BaseResponse<null>>('/shop/order/cancel', { id });

/**
 * 确认收货
 * PUT /shop/order/confirm-receive
 */
export const confirmReceiveAPI = (id: string) => http.put<BaseResponse<null>>('/shop/order/confirm-receive', { id });
