import { http } from '@/utils/http';
import { BaseResponse, PageData } from '@/types/common';
import { GoodsCategory, GoodsDetail, GoodsItem, GoodsListQuery } from '../types';

/**
 * 获取商品分类列表
 * GET /shop/categories
 */
export const getGoodsCategoriesAPI = () => http.get<BaseResponse<GoodsCategory[]>>('/shop/categories');

/**
 * 获取商品分页列表
 * GET /shop/goods/list
 */
export const getGoodsListAPI = (params?: GoodsListQuery) =>
	http.get<BaseResponse<PageData<GoodsItem>>>('/shop/goods/list', params);

/**
 * 获取商品详情（含多规格 SKU 矩阵）
 * GET /shop/goods/detail
 */
export const getGoodsDetailAPI = (id: string) => http.get<BaseResponse<GoodsDetail>>('/shop/goods/detail', { id });
