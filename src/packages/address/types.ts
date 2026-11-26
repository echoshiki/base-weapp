/** 地址条目 */
export interface AddressItem {
	id: string;
	/** 收货人 / 联系人姓名 */
	name: string;
	/** 手机号 */
	phone: string;
	/** 省 */
	province: string;
	/** 市 */
	city: string;
	/** 区/县 */
	district: string;
	/** 详细地址（街道、楼栋、门牌号） */
	detail: string;
	/** 快捷标签（如：家、公司、学校） */
	tag?: string;
	/** 是否默认地址 */
	isDefault: boolean;
	createTime?: string;
}

/** 新增 / 编辑地址请求体 */
export interface AddressFormPayload {
	name: string;
	phone: string;
	province: string;
	city: string;
	district: string;
	detail: string;
	tag?: string;
	isDefault: boolean;
}

/** 常用地址快捷标签 */
export const ADDRESS_TAG_OPTIONS = ['家', '公司', '学校'] as const;
