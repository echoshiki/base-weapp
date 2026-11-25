/** 账号密码登录请求 (POST /login) */
export interface AccountLoginRequest {
	/** 账号（<= 30 字符） */
	username: string;
	/** 密码（<= 20 字符） */
	password: string;
	/** 图形验证码（可选） */
	code?: string;
	/** 验证码唯一标识（可选） */
	uuid?: string;
}

/** 手机号验证码登录请求 (POST /login/phone) */
export interface PhoneLoginRequest {
	/** 手机号 */
	phone: string;
	/** 短信验证码 */
	code: string;
}

/** 通用登录返回数据体（包裹在 BaseResponse<LoginData> 中） */
export interface LoginData {
	/** 访问令牌 */
	token: string;
}

/** 获取短信验证码响应 data */
export interface SendSmsCodeData {
	code?: string | number;
}

/** 用户注册请求 (POST /register) */
export interface RegisterRequest {
	/** 手机号 */
	phone: string;
	/** 短信验证码 */
	code: string;
	/** 登录密码 */
	password: string;
	/** 昵称（可选） */
	nickName?: string;
}

// ---------------------------------------------------------
// 微信小程序登录（统一前端模型 + 后端原始响应定义）
// ---------------------------------------------------------

/**
 * 微信登录前端标准结果模型（所有页面与 Hook 仅依赖此类型，与后端字段解耦）
 */
export type WxLoginResult =
	| { status: 'logged_in'; token: string }
	| { status: 'need_bind_phone'; tempToken: string };

/** 后端 POST /auth/wx-login 原始响应 data */
export interface WxLoginRawData {
	/** 是否需要绑定手机号（false=老用户直通，true=新用户待绑手机） */
	needBindPhone: boolean;
	/** 老用户直通时返回的正式 token */
	token?: string | null;
	/** 新用户待绑手机时返回的临时凭证 */
	tempToken?: string | null;
}

/** 后端 POST /auth/wx-bind-phone 请求参数 */
export interface WxBindPhoneRequest {
	/** 微信 getPhoneNumber 回调返回的 e.detail.code */
	phoneCode: string;
	/** /auth/wx-login 返回的临时凭证 */
	tempToken: string;
}

/** 后端 POST /auth/wx-bind-phone 原始响应 data */
export interface WxBindPhoneRawData {
	token: string;
}
