import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { UserInfo } from '@/types/user';

interface AuthState {
	/** 登录成功后的正式 Token */
	token: string | null;
	/** 微信新用户待绑定手机号时的临时凭证 */
	tempToken: string | null;
	/** 通用用户信息 */
	userInfo: UserInfo | null;
	/** 角色标识列表 */
	roles: string[];
	/** 权限标识列表 */
	permissions: string[];
	/** 登录阶段状态机：UNLOGIN-未登录 | NEED_BIND_PHONE-微信新用户待绑手机 | LOGGED_IN-已登录 */
	authStage: 'UNLOGIN' | 'NEED_BIND_PHONE' | 'LOGGED_IN';

	/** 状态设置：登录成功 */
	setLoginSuccess: (token: string) => void;
	/** 状态设置：微信半登录态，需绑定手机号 */
	setNeedBindPhone: (tempToken: string) => void;
	/** 更新用户信息（含角色与权限） */
	updateUserInfo: (info: UserInfo | null, roles?: string[], permissions?: string[]) => void;
	/** 退出登录，清空状态并重置存储 */
	setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			tempToken: null,
			userInfo: null,
			roles: [],
			permissions: [],
			authStage: 'UNLOGIN',

			setLoginSuccess: (token) =>
				set({
					token,
					tempToken: null,
					authStage: 'LOGGED_IN',
				}),

			setNeedBindPhone: (tempToken) =>
				set({
					token: null,
					tempToken,
					authStage: 'NEED_BIND_PHONE',
					userInfo: null,
					roles: [],
					permissions: [],
				}),

			updateUserInfo: (userInfo, roles, permissions) =>
				set((state) => ({
					userInfo,
					roles: roles ?? state.roles,
					permissions: permissions ?? state.permissions,
				})),

			setLogout: () =>
				set({
					token: null,
					tempToken: null,
					userInfo: null,
					roles: [],
					permissions: [],
					authStage: 'UNLOGIN',
				}),
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
