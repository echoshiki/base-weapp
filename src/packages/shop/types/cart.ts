/** 购物车条目（金额单位：分） */
export interface CartItem {
	id: string;
	goodsId: string;
	skuId: string;
	title: string;
	image: string;
	/** 规格描述，如「云白 / 标准版」 */
	specText?: string;
	/** 单价（分） */
	price: number;
	/** 划线原价（分） */
	originalPrice?: number;
	/** 购买数量 */
	quantity: number;
	/** 当前 SKU 库存 */
	stock: number;
	/** 是否已勾选 */
	selected: boolean;
	/** 是否已失效（下架或无货） */
	invalid?: boolean;
}

/** 加入购物车请求体 */
export interface AddCartPayload {
	goodsId: string;
	skuId: string;
	quantity: number;
}

/** 更新购物车单项请求体 */
export interface UpdateCartPayload {
	id: string;
	quantity?: number;
	selected?: boolean;
}
