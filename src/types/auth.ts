import { BaseResponse, PageQuery } from './common';

/** 登录角色类型：admin-管理员（common），enterprise-企业端（enterpriseUser） */
export type LoginRoleType = 'admin' | 'enterprise';

/** 管理员账号密码登录请求 (POST /login) */
export interface AccountLoginRequest {
	/** 账号（<= 30 字符） */
	username: string;
	/** 密码（<= 20 字符） */
	password: string;
	/** 图形验证码，验证码关闭时可空 */
	code?: string;
	/** 验证码唯一标识，来自 /captchaImage */
	uuid?: string;
}

/** 管理员账号密码登录响应 (POST /login) */
export interface AccountLoginResponse extends BaseResponse {
	/** 访问令牌 */
	token: string;
}

/** 获取短信验证码响应 data */
export interface SendSmsCodeData {
	/** 五位数字验证码 */
	code: number;
}

/** 企业手机号验证码登录请求 (POST /enterprise/login) */
export interface EnterpriseLoginRequest {
	/** 手机号 */
	phone: string;
	/** 验证码 */
	verificationCode: number;
}

/** 企业手机号验证码登录响应 (POST /enterprise/login) */
export interface EnterpriseLoginResponse extends BaseResponse {
	/** 访问令牌 */
	token: string;
}

/** 企业用户注册请求 (POST /enterprise/register) */
export interface EnterpriseRegisterRequest {
	/** 企业 id */
	entId?: string;
	/** 企业名称 */
	entName?: string;
	/** 登录手机号 */
	phone: string;
	/** 员工姓名 */
	name: string;
	/** 职位 */
	position: string;
}

/** 动态获取企业列表查询参数 (GET /enterprise/cnList) */
export interface EnterpriseOptionParams extends PageQuery {
	pageNum: number;
	pageSize: number;
	/** 企业名称 */
	entName?: string;
}

/** 企业下拉选项 */
export interface EnterpriseOptionItem {
	/** 企业 id */
	entId: string;
	/** 企业名称 */
	entName: string;
}

/** 企业登录关联的员工账号信息 */
export interface EnterpriseEmployeeItem {
	/** 名称 */
	name: string;
	/** 职位 */
	position: string;
	/** 电话 */
	phone: string;
}

/** 获取企业用户登录信息 (GET /enterprise/getInfo) */
export interface EnterpriseUserInfo {
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
	/** 企业登录用户信息列表 */
	user: EnterpriseEmployeeItem[];
	/** 企业登录用户角色标识（enterpriseUser） */
	roles: string[];
}
