import { BaseResponse } from './common';

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

/** 通用登录响应 */
export interface LoginResponse extends BaseResponse {
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
