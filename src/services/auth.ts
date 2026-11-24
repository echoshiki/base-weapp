import { http } from '@/utils/http';
import { BaseResponse, DataResponse, TableDataInfo } from '@/types/common';
import {
	AccountLoginRequest,
	AccountLoginResponse,
	EnterpriseLoginRequest,
	EnterpriseLoginResponse,
	EnterpriseOptionItem,
	EnterpriseOptionParams,
	EnterpriseRegisterRequest,
	EnterpriseUserInfo,
	SendSmsCodeData,
} from '@/types/auth';

/**
 * 管理员账号密码登录
 * POST /login
 */
export const accountLoginAPI = (data: AccountLoginRequest) =>
	http.post<AccountLoginResponse>('/login', data);

/**
 * 退出登录
 * POST /logout
 */
export const logoutAPI = () => http.post<BaseResponse>('/logout');

/**
 * 获取企业登录短信验证码
 * POST /enterprise/code
 */
export const sendSmsCodeAPI = (phone: string) =>
	http.post<DataResponse<SendSmsCodeData>>(`/enterprise/code?phone=${encodeURIComponent(phone)}`);

/**
 * 企业手机号验证码登录
 * POST /enterprise/login
 */
export const enterpriseLoginAPI = (data: EnterpriseLoginRequest) =>
	http.post<EnterpriseLoginResponse>('/enterprise/login', data);

/**
 * 企业用户注册
 * POST /enterprise/register
 */
export const enterpriseRegisterAPI = (data: EnterpriseRegisterRequest) =>
	http.post<BaseResponse>('/enterprise/register', data);

/**
 * 动态获取企业列表（注册选择企业）
 * GET /enterprise/cnList
 */
export const getEnterpriseOptionsAPI = (params: EnterpriseOptionParams) =>
	http.get<TableDataInfo<EnterpriseOptionItem>>('/enterprise/cnList', params);

/**
 * 获取企业用户登录信息
 * GET /enterprise/getInfo
 */
export const getEnterpriseUserInfoAPI = () =>
	http.get<DataResponse<EnterpriseUserInfo>>('/enterprise/getInfo');
