import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import { UserInfo } from '@/types/user';

interface AuthState {
	/** 登录成功后的 Token 值 */
	token: string | null;
	/** 通用用户信息 */
	userInfo: UserInfo | null;
	/** 角色标识列表 */
	roles: string[];
	/** 权限标识列表 */
	permissions: string[];
	/** 登录阶段状态机 */
	authStage: 'UNLOGIN' | 'LOGGED_IN';

	/** 状态设置：登录成功 */
	setLoginSuccess: (token: string) => void;
	/** 更新用户信息（含角色与权限） */
	updateUserInfo: (info: UserInfo | null, roles?: string[], permissions?: string[]) => void;
	/** 退出登录，清空状态并重置存储 */
	setLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			userInfo: null,
			roles: [],
			permissions: [],
			authStage: 'UNLOGIN',

			setLoginSuccess: (token) =>
				set({
					token,
					authStage: 'LOGGED_IN',
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
