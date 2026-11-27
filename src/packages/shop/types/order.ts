import { PageQuery } from '@/types/common';
import { UiColor } from '@/components/ui';

/** 订单标准 5 态 */
export type OrderStatus = 'pending_pay' | 'pending_ship' | 'pending_receive' | 'completed' | 'cancelled';

/** 订单状态元数据 */
export const ORDER_STATUS_META: Record<
	OrderStatus,
	{ label: string; desc: string; theme: UiColor; icon: string }
> = {
	pending_pay: {
		label: '待付款',
		desc: '请尽快完成支付，超时订单将自动关闭',
		theme: 'amber',
		icon: 'icon-[ph--clock-countdown-duotone]',
	},
	pending_ship: {
		label: '待发货',
		desc: '商家正在为您备货，请耐心等待',
		theme: 'blue',
		icon: 'icon-[ph--package-duotone]',
	},
	pending_receive: {
		label: '待收货',
		desc: '包裹正在配送中，请注意查收',
		theme: 'primary',
		icon: 'icon-[ph--truck-duotone]',
	},
	completed: {
		label: '已完成',
		desc: '交易已完成，感谢您的支持',
		theme: 'emerald',
		icon: 'icon-[ph--check-circle-duotone]',
	},
	cancelled: {
		label: '已取消',
		desc: '订单已取消，如需购买请重新下单',
		theme: 'zinc',
		icon: 'icon-[ph--x-circle-duotone]',
	},
};

/** 订单收货地址快照（独立声明，避免跨分包直接 import packages/address） */
export interface OrderAddress {
	id?: string;
	name: string;
	phone: string;
	province: string;
	city: string;
	district: string;
	detail: string;
}

/** 订单内商品条目（金额单位：分） */
export interface OrderGoodsItem {
	goodsId: string;
	skuId: string;
	title: string;
	image: string;
	specText?: string;
	/** 单价（分） */
	price: number;
	quantity: number;
}

/** 订单完整模型（金额单位：分） */
export interface OrderItem {
	id: string;
	orderNo: string;
	status: OrderStatus;
	items: OrderGoodsItem[];
	address: OrderAddress;
	/** 商品总价（分） */
	goodsAmount: number;
	/** 运费（分） */
	freightAmount: number;
	/** 优惠抵扣（分） */
	discountAmount?: number;
	/** 实付金额（分） */
	payAmount: number;
	/** 买家备注 */
	remark?: string;
	/** 物流公司 */
	expressCompany?: string;
	/** 物流单号 */
	expressNo?: string;
	createTime: string;
	payTime?: string;
}

/** 结算预览查询参数 */
export interface CheckoutPreviewPayload {
	mode: 'cart' | 'buy_now';
	cartIds?: string[];
	goodsId?: string;
	skuId?: string;
	quantity?: number;
}

/** 结算预览响应体 */
export interface CheckoutPreviewData {
	address?: OrderAddress | null;
	items: OrderGoodsItem[];
	goodsAmount: number;
	freightAmount: number;
	discountAmount?: number;
	payAmount: number;
}

/** 提交订单请求体 */
export interface CreateOrderPayload extends CheckoutPreviewPayload {
	addressId: string;
	remark?: string;
}

/** 订单支付响应体（兼容微信原生支付参数或 Mock 支付） */
export interface PayOrderResult {
	paid?: boolean;
	payParams?: {
		timeStamp: string;
		nonceStr: string;
		package: string;
		signType?: 'MD5' | 'HMAC-SHA256' | 'RSA';
		paySign: string;
	};
}

/** 订单分页列表查询参数 */
export interface OrderListQuery extends PageQuery {
	status?: OrderStatus;
}
