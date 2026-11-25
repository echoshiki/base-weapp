import { http } from '@/utils/http';
import { BaseResponse } from '@/types/common';
import {
	AccountLoginRequest,
	LoginData,
	PhoneLoginRequest,
	RegisterRequest,
	SendSmsCodeData,
	WxBindPhoneRawData,
	WxBindPhoneRequest,
	WxLoginRawData,
} from '@/types/auth';

/**
 * 账号密码登录
 * POST /login
 */
export const accountLoginAPI = (data: AccountLoginRequest) => http.post<BaseResponse<LoginData>>('/login', data);

/**
 * 手机号验证码登录
 * POST /login/phone
 */
export const phoneLoginAPI = (data: PhoneLoginRequest) => http.post<BaseResponse<LoginData>>('/login/phone', data);

/**
 * 发送短信验证码
 * POST /sms/code
 */
export const sendSmsCodeAPI = (phone: string) => http.post<BaseResponse<SendSmsCodeData>>('/sms/code', { phone });

/**
 * 用户注册
 * POST /register
 */
export const registerAPI = (data: RegisterRequest) => http.post<BaseResponse<null>>('/register', data);

/**
 * 退出登录
 * POST /logout
 */
export const logoutAPI = () => http.post<BaseResponse<null>>('/logout');

/**
 * 微信 code 登录
 * POST /auth/wx-login
 */
export const wxLoginAPI = (code: string, silent = false) =>
	http.post<BaseResponse<WxLoginRawData>>('/auth/wx-login', { code }, { silent });

/**
 * 微信手机号授权绑定并登录
 * POST /auth/wx-bind-phone
 */
export const wxBindPhoneAPI = (data: WxBindPhoneRequest) =>
	http.post<BaseResponse<WxBindPhoneRawData>>('/auth/wx-bind-phone', data);
