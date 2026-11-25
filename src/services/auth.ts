import { http } from '@/utils/http';
import { BaseResponse, DataResponse } from '@/types/common';
import {
	AccountLoginRequest,
	LoginResponse,
	PhoneLoginRequest,
	RegisterRequest,
	SendSmsCodeData,
} from '@/types/auth';

/**
 * 账号密码登录
 * POST /login
 */
export const accountLoginAPI = (data: AccountLoginRequest) => http.post<LoginResponse>('/login', data);

/**
 * 手机号验证码登录
 * POST /login/phone
 */
export const phoneLoginAPI = (data: PhoneLoginRequest) => http.post<LoginResponse>('/login/phone', data);

/**
 * 发送短信验证码
 * POST /sms/code
 */
export const sendSmsCodeAPI = (phone: string) =>
	http.post<DataResponse<SendSmsCodeData>>(`/sms/code?phone=${encodeURIComponent(phone)}`);

/**
 * 用户注册
 * POST /register
 */
export const registerAPI = (data: RegisterRequest) => http.post<BaseResponse>('/register', data);

/**
 * 退出登录
 * POST /logout
 */
export const logoutAPI = () => http.post<BaseResponse>('/logout');
