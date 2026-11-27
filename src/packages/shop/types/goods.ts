import { PageQuery } from '@/types/common';

/** 商品分类 */
export interface GoodsCategory {
	id: string;
	name: string;
}

/** 列表排序方式 */
export type GoodsSort = 'default' | 'sales' | 'price_asc' | 'price_desc';

/** 规格维度定义（如 颜色: ['云白', '炭黑']） */
export interface GoodsSpecGroup {
	name: string;
	values: string[];
}

/** 具体 SKU 组合条目（金额单位：分） */
export interface GoodsSku {
	id: string;
	/** 规格键值对，如 { 颜色: '云白', 容量: '256G' } */
	specs: Record<string, string>;
	/** 售价（分） */
	price: number;
	/** 划线原价（分） */
	originalPrice?: number;
	/** 当前规格库存 */
	stock: number;
	/** 规格缩略图（缺省时回退商品主图） */
	image?: string;
}

/** 商品列表条目（金额单位：分） */
export interface GoodsItem {
	id: string;
	title: string;
	subtitle?: string;
	cover: string;
	/** 展示最低价（分） */
	price: number;
	/** 划线原价（分） */
	originalPrice?: number;
	/** 累计销量 */
	sales: number;
	categoryId?: string;
	tags?: string[];
}

/** 商品详情完整模型 */
export interface GoodsDetail extends GoodsItem {
	/** 顶部主图轮播数组 */
	images: string[];
	/** 总库存 */
	stock: number;
	/** 规格维度定义（为空数组时代表单规格商品） */
	specs: GoodsSpecGroup[];
	/** 规格组合矩阵 */
	skus: GoodsSku[];
	/** 详情图文长图列表 */
	detailImages?: string[];
	/** 商品文字介绍 */
	description?: string;
	/** 服务保障标签（如 48小时发货、7天无理由） */
	services?: string[];
}

/** 商品列表查询参数 */
export interface GoodsListQuery extends PageQuery {
	keyword?: string;
	categoryId?: string;
	sort?: GoodsSort;
}
