import { PageQuery } from './common';

/** 企业荣誉数量项 (GET /demand/cn/honorList) */
export interface EnterpriseHonorItem {
	/** 搜索字段 */
	honorName: string;
	/** 数量 */
	count: number;
	/** 展示字段 */
	fixedName: string;
}

/** 企业信息列表查询参数 (GET /demand/cn/list) */
export interface EnterpriseListParams extends PageQuery {
	/** 关键词（企业名称，荣誉名称） */
	all?: string;
}

/** 企业信息实体 (GET /demand/cn/list & GET /demand/cn/{entId}) */
export interface EnterpriseItem {
	/** 企业主键 */
	entId: string;
	/** 企业名称 */
	entName: string;
	/** 行业主键 */
	industryId?: string;
	/** 行业名称 */
	industryName?: string;
	/** 联系人 */
	contPerson?: string;
	/** 联系电话 */
	contPhone?: string;
	/** 邮箱 */
	email?: string;
	/** 注册地址 */
	regAddress?: string;
	/** 经营范围 */
	business?: string;
	/** 荣誉主键 */
	honorId?: string;
	/** 荣誉名称，如高新技术企业、专精特新 */
	honorName?: string;
	/** 规模主键 */
	scaleId?: string;
	/** 企业规模 */
	scaleName?: string;
	/** 性质主键 */
	natureId?: string;
	/** 企业性质 */
	natureName?: string;
	/** 企业标签 */
	qybqName?: string;
	/** 所属边界/区域 */
	boundaryName?: string;
	/** 投资金额 */
	invAmt?: number;
	/** 营业执照或企业图片地址 */
	bsPhoto?: string;
	/** 注册资本 */
	regCap?: string;
	/** 成立日期 */
	estabDate?: string;
	/** 法人姓名 */
	legalName?: string;
	/** 企业简介 */
	comProfile?: string;
	/** 附件名称 */
	fileName?: string;
	/** 创建人 */
	createBy?: string;
	/** 创建时间 */
	createTime?: string;
	/** 更新人 */
	updateBy?: string;
	/** 更新时间 */
	updateTime?: string;
}
