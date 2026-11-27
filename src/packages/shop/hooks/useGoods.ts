import { useQuery } from '@tanstack/react-query';
import { getGoodsCategoriesAPI, getGoodsDetailAPI, getGoodsListAPI } from '../services';
import { GoodsListQuery } from '../types';

/** 获取商品分类 */
export const useGoodsCategories = () => {
	return useQuery({
		queryKey: ['shop', 'categories'],
		queryFn: async () => {
			const res = await getGoodsCategoriesAPI();
			return res.data || [];
		},
		staleTime: 5 * 60 * 1000,
	});
};

/** 获取商品分页列表 */
export const useGoodsList = (params: GoodsListQuery) => {
	return useQuery({
		queryKey: ['shop', 'goods', 'list', params],
		queryFn: async () => {
			const res = await getGoodsListAPI(params);
			return res.data;
		},
		keepPreviousData: true,
	});
};

/** 获取商品详情 */
export const useGoodsDetail = (id?: string) => {
	return useQuery({
		queryKey: ['shop', 'goods', 'detail', id],
		queryFn: async () => {
			if (!id) return null;
			const res = await getGoodsDetailAPI(id);
			return res.data;
		},
		enabled: Boolean(id),
	});
};
