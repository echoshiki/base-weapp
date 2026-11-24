import { http } from '@/utils/http';
import { BaseResponse } from '@/types/common';
import { GetInfoResponse, UpdateUserProfileRequest, UpdateUserPwdParams } from '@/types/user';

/**
 * 获取当前登录用户信息
 * GET /getInfo
 */
export const getUserInfoAPI = () => http.get<GetInfoResponse>('/getInfo');

/**
 * 修改个人信息
 * PUT /system/user/profile/app
 */
export const updateUserProfileAPI = (data: UpdateUserProfileRequest) =>
	http.put<BaseResponse>('/system/user/profile/app', data);

/**
 * 修改登录密码（Query 传参）
 * PUT /system/user/profile/updatePwd
 */
export const updateUserPwdAPI = ({ oldPassword, newPassword }: UpdateUserPwdParams) =>
	http.put<BaseResponse>(
		`/system/user/profile/updatePwd?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`,
	);
