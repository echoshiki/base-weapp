import { http } from '@/utils/http';
import { UserInfo } from '@/types/user';
import { Gender } from '@/types/common';

/**
 * 获取用户信息接口
 */
export const getUserInfoAPI = () => http.get<UserInfo>('/wx/getInfo');

export interface UpdatesUserInfoRequest {
	/** 昵称 */
	name: string;
	/** 头像 URL */
	avatar: string;
	/** 性别，0=男, 1=女, 2=未知 */
	gender: Gender;
	/** 详细地址 */
	address: string;
}

/**
 * 更新用户个人资料
 * @param data UserProfileRequest
 */
export const updateUserInfoAPI = (data: UpdatesUserInfoRequest) => http.put('/wx/edit', data);
