import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { UserInfo } from '@/types/user';
import { EnterpriseUserInfo, LoginRoleType } from '@/types/auth';

interface AuthState {
	/** 登录成功后的 Token 值 */
	token: string | null;
	/** 临时的 UUID 值，用于用户注册时绑定手机号 */
	uuid: string | null;
	/** 当前登录方式/角色类型：admin-管理员, enterprise-企业端 */
	loginType: LoginRoleType | null;
	/** 通用用户信息（管理员直接来自 /getInfo，企业端由 /enterprise/getInfo 派生同步） */
	userInfo: UserInfo | null;
	/** 企业端详细档案信息（来自 GET /enterprise/getInfo） */
	enterpriseInfo: EnterpriseUserInfo | null;
	/** 角色标识列表 */
	roles: string[];
	/** 权限标识列表 */
	permissions: string[];
	/** 登陆阶段状态机：UNLOGIN-未登录, NEED_BIND_PHONE-需绑定手机, LOGGED_IN-已登录 */
	authStage: 'UNLOGIN' | 'NEED_BIND_PHONE' | 'LOGGED_IN';

	/** 状态设置：登录成功 */
	setLoginSuccess: (token: string, loginType?: LoginRoleType) => void;
	/** 状态设置：需要绑定手机号 */
	setNeedBind: (uuid: string) => void;
	/** 更新用户信息（含角色与权限） */
	updateUserInfo: (info: UserInfo | null, roles?: string[], permissions?: string[]) => void;
	/** 更新企业端详细信息 */
	updateEnterpriseInfo: (info: EnterpriseUserInfo | null) => void;
	/** 退出登录，清空状态并重置存储 */
	setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			uuid: null,
			loginType: null,
			userInfo: null,
			enterpriseInfo: null,
			roles: [],
			permissions: [],
			authStage: 'UNLOGIN',

			// 状态 A：直接登录成功
			setLoginSuccess: (token, loginType = 'admin') =>
				set({
					token,
					loginType,
					authStage: 'LOGGED_IN',
					uuid: null,
				}),

			// 状态 B：半登录，需补全手机号
			setNeedBind: (uuid) =>
				set({
					uuid: uuid,
					authStage: 'NEED_BIND_PHONE',
					token: null,
					loginType: null,
					userInfo: null,
					enterpriseInfo: null,
					roles: [],
					permissions: [],
				}),

			updateUserInfo: (userInfo, roles, permissions) =>
				set((state) => ({
					userInfo,
					roles: roles ?? state.roles,
					permissions: permissions ?? state.permissions,
				})),

			updateEnterpriseInfo: (enterpriseInfo) =>
				set({
					enterpriseInfo,
				}),

			setLogout: () => {
				set({
					token: null,
					uuid: null,
					loginType: null,
					userInfo: null,
					enterpriseInfo: null,
					roles: [],
					permissions: [],
					authStage: 'UNLOGIN',
				});
			},
		}),
		{
			name: 'auth_store',
			storage: createJSONStorage(() => ({
				getItem: Taro.getStorageSync,
				setItem: Taro.setStorageSync,
				removeItem: Taro.removeStorageSync,
			})),
		},
	),
);
