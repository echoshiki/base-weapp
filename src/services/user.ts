import { http } from '@/utils/http';
import { BaseResponse } from '@/types/common';
import { UpdateUserProfileRequest, UpdateUserPwdRequest, UserProfileData } from '@/types/user';

/**
 * 获取当前登录用户信息
 * GET /user/info
 */
export const getUserInfoAPI = (silent = false) =>
	http.get<BaseResponse<UserProfileData>>('/user/info', undefined, { silent });

/**
 * 修改个人信息
 * PUT /user/profile
 */
export const updateUserProfileAPI = (data: UpdateUserProfileRequest) =>
	http.put<BaseResponse<null>>('/user/profile', data);

/**
 * 修改登录密码
 * PUT /user/password
 */
export const updateUserPwdAPI = (data: UpdateUserPwdRequest) => http.put<BaseResponse<null>>('/user/password', data);
