import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import {
	accountLoginAPI,
	logoutAPI,
	phoneLoginAPI,
	registerAPI,
	sendSmsCodeAPI,
	wxBindPhoneAPI,
	wxLoginAPI,
} from '@/services/auth';
import { getUserInfoAPI } from '@/services/user';
import { AccountLoginRequest, PhoneLoginRequest, RegisterRequest, WxLoginRawData, WxLoginResult } from '@/types/auth';
import { BaseResponse } from '@/types/common';
import { toLogin, mapsTo, maskPhone } from '@/utils/common';

/**
 * 将后端 wx-login 原始响应翻译为前端标准登录态（新项目对接不同后端时只需改此处字段映射）
 */
const normalizeWxLoginResponse = (res: BaseResponse<WxLoginRawData>): WxLoginResult => {
	const data = res.data;

	if (data?.needBindPhone) {
		if (!data.tempToken) {
			throw new Error(res.msg || '未获取到绑定手机号临时凭证 (tempToken)');
		}
		return { status: 'need_bind_phone', tempToken: data.tempToken };
	}

	const token = data?.token;
	if (!token) {
		throw new Error(res.msg || '未获取到有效登录凭证 (token)');
	}

	return { status: 'logged_in', token };
};

/**
 * 应用级 Auth 用户认证与授权 Hook
 */
export const useAuth = () => {
	const { token, tempToken, authStage, setLoginSuccess, setNeedBindPhone, updateUserInfo, setLogout } =
		useAuthStore();
	const isLoggedIn = authStage === 'LOGGED_IN' && !!token;
	const isNeedBindPhone = authStage === 'NEED_BIND_PHONE' && !!tempToken;

	/** 拉取并同步最新用户信息、角色与权限 */
	const syncUserInfo = async (silent = false) => {
		const res = await getUserInfoAPI(silent);
		const profile = res.data;
		if (profile?.user) {
			updateUserInfo(
				{
					...profile.user,
					maskedPhone: maskPhone(profile.user.phonenumber),
				},
				profile.roles || [],
				profile.permissions || [],
			);
		}
		return res;
	};

	/** 登录成功后的统一副作用 */
	const handleLoginEffect = async (newToken: string) => {
		setLoginSuccess(newToken);
		try {
			await syncUserInfo(true);
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
			const newToken = res.data?.token;
			if (newToken) {
				await handleLoginEffect(newToken);
				Taro.showToast({ title: '登录成功', icon: 'success' });
				return { success: true, token: newToken };
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
			const newToken = res.data?.token;
			if (newToken) {
				await handleLoginEffect(newToken);
				Taro.showToast({ title: '登录成功', icon: 'success' });
				return { success: true, token: newToken };
			}
			Taro.showToast({ title: res.msg || '未获取到有效凭证', icon: 'none' });
			return { success: false, message: '未获取到有效凭证' };
		} catch (err: any) {
			Taro.hideLoading();
			Taro.showToast({ title: err?.msg || err?.message || '登录失败，请检查手机号或验证码', icon: 'none' });
			return { success: false, error: err };
		}
	};

	/**
	 * 微信小程序 code 登录
	 * @param options.silent 静默模式（冷启动时使用，不弹 Loading 与 Toast）
	 */
	const onWxLogin = async (options?: { silent?: boolean }) => {
		const silent = options?.silent ?? false;

		if (process.env.TARO_ENV === 'h5') {
			if (!silent) Taro.showToast({ title: '请在微信小程序中使用微信登录', icon: 'none' });
			return { success: false as const, status: 'unsupported' as const };
		}

		if (!silent) Taro.showLoading({ title: '微信登录中...', mask: true });
		try {
			const loginRes = await Taro.login();
			if (!loginRes.code) {
				throw new Error('获取微信登录凭证失败');
			}

			const rawRes = await wxLoginAPI(loginRes.code, silent);
			const result = normalizeWxLoginResponse(rawRes);
			if (!silent) Taro.hideLoading();

			if (result.status === 'logged_in') {
				await handleLoginEffect(result.token);
				if (!silent) Taro.showToast({ title: '登录成功', icon: 'success' });
				return { success: true as const, status: 'logged_in' as const, token: result.token };
			}

			setNeedBindPhone(result.tempToken);
			return { success: true as const, status: 'need_bind_phone' as const, tempToken: result.tempToken };
		} catch (err: any) {
			if (!silent) {
				Taro.hideLoading();
				Taro.showToast({ title: err?.msg || err?.message || '微信登录失败，请重试', icon: 'none' });
			} else {
				console.warn('微信静默登录失败:', err);
			}
			return { success: false as const, status: 'error' as const, error: err };
		}
	};

	/**
	 * 微信小程序绑定手机号并完成登录
	 * @param phoneCode <Button openType="getPhoneNumber"> 回调中的 e.detail.code
	 */
	const onWxBindPhone = async (phoneCode: string) => {
		if (!phoneCode) {
			Taro.showToast({ title: '未获取到手机号授权凭证', icon: 'none' });
			return { success: false as const };
		}

		let currentTempToken = useAuthStore.getState().tempToken;

		Taro.showLoading({ title: '绑定登录中...', mask: true });
		try {
			if (!currentTempToken) {
				const loginRes = await Taro.login();
				if (!loginRes.code) throw new Error('获取微信登录凭证失败');
				const wxRes = normalizeWxLoginResponse(await wxLoginAPI(loginRes.code));
				if (wxRes.status === 'logged_in') {
					Taro.hideLoading();
					await handleLoginEffect(wxRes.token);
					Taro.showToast({ title: '登录成功', icon: 'success' });
					return { success: true as const, token: wxRes.token };
				}
				currentTempToken = wxRes.tempToken;
				setNeedBindPhone(currentTempToken);
			}

			const bindRes = await wxBindPhoneAPI({
				phoneCode,
				tempToken: currentTempToken,
			});
			const newToken = bindRes.data?.token;
			if (!newToken) {
				throw new Error(bindRes.msg || '手机号绑定失败，未获取到有效凭证');
			}

			Taro.hideLoading();
			await handleLoginEffect(newToken);
			Taro.showToast({ title: '登录成功', icon: 'success' });
			return { success: true as const, token: newToken };
		} catch (err: any) {
			Taro.hideLoading();
			Taro.showToast({ title: err?.msg || err?.message || '手机号绑定失败，请重试', icon: 'none' });
			return { success: false as const, error: err };
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

	/**
	 * 冷启动初始化鉴权状态
	 * - 已有 token：静默校验并刷新用户信息
	 * - 无 token 且 mode='wechat'（小程序端）：执行静默微信登录
	 */
	const initAuth = async (mode: 'account' | 'wechat' = 'account') => {
		if (token) {
			try {
				await syncUserInfo(true);
			} catch (e) {
				console.warn('冷启动校验 Token 异常', e);
			}
			return;
		}

		if (mode === 'wechat' && process.env.TARO_ENV !== 'h5') {
			await onWxLogin({ silent: true });
		}
	};

	return {
		token,
		tempToken,
		authStage,
		isLoggedIn,
		isNeedBindPhone,
		onAccountLogin,
		onSendSmsCode,
		onPhoneLogin,
		onWxLogin,
		onWxBindPhone,
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
