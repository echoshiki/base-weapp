import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import { accountLoginAPI, logoutAPI, phoneLoginAPI, registerAPI, sendSmsCodeAPI } from '@/services/auth';
import { getUserInfoAPI } from '@/services/user';
import { AccountLoginRequest, PhoneLoginRequest, RegisterRequest } from '@/types/auth';
import { toLogin, mapsTo, maskPhone } from '@/utils/common';

/**
 * 应用级 Auth 用户认证与授权 Hook
 */
export const useAuth = () => {
	const { token, authStage, setLoginSuccess, updateUserInfo, setLogout } = useAuthStore();
	const isLoggedIn = authStage === 'LOGGED_IN' && !!token;

	/** 拉取并同步最新用户信息、角色与权限 */
	const syncUserInfo = async () => {
		const res = await getUserInfoAPI();
		if (res.user) {
			updateUserInfo(
				{
					...res.user,
					maskedPhone: maskPhone(res.user.phonenumber),
				},
				res.roles || [],
				res.permissions || [],
			);
		}
		return res;
	};

	/** 登录成功后的统一副作用 */
	const handleLoginEffect = async (newToken: string) => {
		setLoginSuccess(newToken);
		try {
			await syncUserInfo();
		} catch (e) {
			console.error('获取用户信息失败，请检查 token 有效性', e);
		}
	};

	/** 账号密码登录 */
	const onAccountLogin = async (params: AccountLoginRequest) => {
		Taro.showLoading({ title: '登录中...', mask: true });
		try {
			const res = await accountLoginAPI(params);
			Taro.hideLoading();
			if (res.token) {
				await handleLoginEffect(res.token);
				Taro.showToast({ title: '登录成功', icon: 'success' });
				return { success: true, token: res.token };
			}
			Taro.showToast({ title: res.msg || '未获取到有效凭证', icon: 'none' });
			return { success: false, message: '未获取到有效凭证' };
		} catch (err: any) {
			Taro.hideLoading();
			Taro.showToast({ title: err?.msg || err?.message || '账号或密码错误', icon: 'none' });
			return { success: false, error: err };
		}
	};

	/** 发送短信验证码 */
	const onSendSmsCode = async (phone: string) => {
		try {
			const res = await sendSmsCodeAPI(phone);
			Taro.showToast({ title: '验证码已发送', icon: 'none' });
			return { success: true, data: res.data };
		} catch (err: any) {
			Taro.showToast({ title: err?.msg || err?.message || '验证码发送失败', icon: 'none' });
			return { success: false, error: err };
		}
	};

	/** 手机号验证码登录 */
	const onPhoneLogin = async (params: PhoneLoginRequest) => {
		Taro.showLoading({ title: '登录中...', mask: true });
		try {
			const res = await phoneLoginAPI(params);
			Taro.hideLoading();
			if (res.token) {
				await handleLoginEffect(res.token);
				Taro.showToast({ title: '登录成功', icon: 'success' });
				return { success: true, token: res.token };
			}
			Taro.showToast({ title: res.msg || '未获取到有效凭证', icon: 'none' });
			return { success: false, message: '未获取到有效凭证' };
		} catch (err: any) {
			Taro.hideLoading();
			Taro.showToast({ title: err?.msg || err?.message || '登录失败，请检查手机号或验证码', icon: 'none' });
			return { success: false, error: err };
		}
	};

	/** 用户注册 */
	const onRegister = async (params: RegisterRequest) => {
		Taro.showLoading({ title: '注册中...', mask: true });
		try {
			const res = await registerAPI(params);
			Taro.hideLoading();
			Taro.showToast({ title: '注册成功，请登录', icon: 'success' });
			return { success: true, data: res };
		} catch (err: any) {
			Taro.hideLoading();
			Taro.showToast({ title: err?.msg || err?.message || '注册失败，请稍后重试', icon: 'none' });
			return { success: false, error: err };
		}
	};

	/** 注销登录 */
	const onLogout = async () => {
		try {
			await logoutAPI();
		} catch (err) {
			console.warn('登出接口调用异常，已本地退出', err);
		} finally {
			setLogout();
			Taro.reLaunch({ url: '/pages/home/index' });
		}
	};

	/** 鉴权执行器：未登录时自动跳转登录页 */
	const runWithAuth = (action: () => void, targetUrl?: string) => {
		if (isLoggedIn) {
			action();
		} else {
			toLogin(targetUrl, 'navigateTo');
		}
	};

	/** 页面内验证守卫 */
	const checkLogin = (targetUrl?: string): boolean => {
		if (!isLoggedIn) toLogin(targetUrl, 'redirectTo');
		return isLoggedIn;
	};

	/** 跳转前验证 */
	const navigateWithAuth = (targetUrl: string) => runWithAuth(() => mapsTo(targetUrl));

	/** 冷启动初始化鉴权状态 */
	const initAuth = async (_mode: 'account' | 'wechat' = 'account') => {
		if (token) {
			try {
				await syncUserInfo();
			} catch (e) {
				console.warn('冷启动校验 Token 异常', e);
			}
		}
	};

	return {
		token,
		authStage,
		isLoggedIn,
		onAccountLogin,
		onSendSmsCode,
		onPhoneLogin,
		onRegister,
		syncUserInfo,
		onLogout,
		toLogin,
		runWithAuth,
		checkLogin,
		navigateWithAuth,
		initAuth,
	};
};
