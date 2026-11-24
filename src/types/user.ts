import { BaseResponse } from './common';

/** 性别：0 男，1 女 */
export type UserSex = '0' | '1';

/** 用户信息（GET /getInfo 返回的 user 对象） */
export interface UserInfo {
	/** 用户主键 */
	userId?: number;
	/** 登录账号 */
	userName?: string;
	/** 用户昵称 */
	nickName?: string;
	/** 邮箱 */
	email?: string;
	/** 手机号 */
	phonenumber?: string;
	/** 脱敏手机号（前端派生展示用） */
	maskedPhone?: string;
	/** 性别：0 男，1 女 */
	sex?: UserSex;
	/** 头像相对路径 */
	avatar?: string;
	/** 创建时间 */
	createTime?: string;
}

/** 获取当前用户信息响应（GET /getInfo） */
export interface GetInfoResponse extends BaseResponse {
	/** 当前用户信息 */
	user?: UserInfo;
	/** 角色标识 */
	roles?: string[];
	/** 权限标识 */
	permissions?: string[];
}

/** 修改个人信息请求（PUT /system/user/profile/app） */
export interface UpdateUserProfileRequest {
	/** 用户昵称 */
	nickName: string;
	/** 手机号 */
	phonenumber: string;
	/** 邮箱 */
	email: string;
	/** 性别：0 男，1 女 */
	sex?: UserSex;
	/** 头像相对路径 */
	avatar?: string;
}

/** 修改登录密码参数（PUT /system/user/profile/updatePwd） */
export interface UpdateUserPwdParams {
	/** 旧密码 */
	oldPassword: string;
	/** 新密码（6-20 字符） */
	newPassword: string;
}
