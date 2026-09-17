import { http } from '@/utils/http';

export interface CheckWxCodeResponse {
	/** 是否已注册 (true:直接登录, false:需绑定手机号) */
	isWxCode?: boolean;
	/** 用户 token (isWxCode 为 true 时返回) */
	token?: string;
	/** 用户临时登录凭证 (isWxCode 为 false 时返回，存入 Redis) */
	uuid?: string;
}

/**
 * 微信静默登陆接口 (预检)
 * @description 传 wx.login 的 code，判断是否已注册
 * @param code wx.login 获取的微信 code
 */
export const checkWxCodeAPI = (code: string) => http.post<CheckWxCodeResponse>(`/wx/isWxCode?code=${code}`);

export interface BindPhoneRequest {
	/** 微信 getPhoneNumber 获取的手机号 code (code2) */
	code: string;
	/** 第一步获取的临时凭证 (authKey) */
	uuid: string;
}

export interface BindPhoneResponse {
	/** 用户 token 凭证 */
	token?: string;
}

/**
 * 绑定手机号接口 (正式注册/登录)
 * @description 传手机号 code + uuid 换取 token
 * @param data 包含 uuid 和手机号凭证的对象
 */
export const bindPhoneAPI = (data: BindPhoneRequest) => http.post<BindPhoneResponse>(`/wx/login`, data);

/**
 * 用户登出
 */
export const logoutAPI = () => http.get('/logout');

export interface AccountLoginRequest {
	/** 用户名 */
	userName: string;
	/** 密码 */
	password: string;
}

export interface AccountLoginResponse {
	/** 用户 token 凭证 */
	token?: string;
}

/**
 * 账户/密码登录方式
 */
export const accountLoginAPI = (data: AccountLoginRequest) => http.post<AccountLoginResponse>(`/wx/login`, data);
