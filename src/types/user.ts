import { Gender } from './common';

/**
 * 登录阶段状态机
 */
export type AuthStage =
	| 'UNLOGIN' // 未登录
	| 'NEED_BIND_PHONE' // 需要绑定手机号
	| 'LOGGED_IN'; // 已登录

/** 用户信息 */
export interface UserInfo {
	/** 用户ID */
	id: number;
	/** 用户昵称 */
	name?: string;
	/** 联系电话 */
	phone?: string;
	/** 脱敏手机号 */
	maskedPhone?: string;
	/** 用户头像 URL */
	avatar?: string;
	/** 性别 */
	gender?: Gender;
	/** 地址 */
	address?: string;
	/** 客户类型 */
	customerType?: string;
	/** 累计当金 */
	accumulatedAccount?: number;
	/** 在当笔数 */
	currentTicket?: number;
	/** 注册天数 */
	registeredDays?: number;
}
