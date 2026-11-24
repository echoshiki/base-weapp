import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import {
	logoutAPI,
	accountLoginAPI,
	sendSmsCodeAPI,
	enterpriseLoginAPI,
	enterpriseRegisterAPI,
	getEnterpriseUserInfoAPI,
} from '@/services/auth';
import { getUserInfoAPI } from '@/services/user';
import {
	AccountLoginRequest,
	EnterpriseLoginRequest,
	EnterpriseRegisterRequest,
	EnterpriseUserInfo,
	LoginRoleType,
} from '@/types/auth';
import { toLogin, mapsTo, maskPhone } from '@/utils/common';

/**
 * 从 /enterprise/getInfo 响应中提取企业信息对象（兼容 data 包裹或平铺结构）
 */
export const extractEnterpriseInfo = (res: any): EnterpriseUserInfo | null => {
	const raw = res?.data && typeof res.data === 'object' ? res.data : res;
	if (!raw || (!raw.entId && !raw.entName && !raw.user)) return null;
	return raw as EnterpriseUserInfo;
};

/**
 * 将企业端详情映射为通用的 UserInfo 供基础展示组件使用（账户信息取 user[0]）
 */
export const mapEnterpriseToUserInfo = (ent: EnterpriseUserInfo) => {
	const primaryUser = Array.isArray(ent.user) ? ent.user[0] : (ent.user as any);
	const phone = primaryUser?.phone || ent.contPhone || '';
	const firstPhoto = ent.bsPhoto?.split(',')[0]?.trim() || '';
	return {
		nickName: primaryUser?.name || ent.contPerson || ent.entName || '',
		userName: ent.entName || primaryUser?.name || '',
		phonenumber: phone,
		maskedPhone: maskPhone(phone),
		email: ent.email,
		avatar: firstPhoto,
	};
};

/**
 * 应用级 Auth 用户认证与授权 Hook
 */
export const useAuth = () => {
	const { token, authStage, loginType, roles, setLoginSuccess, updateUserInfo, updateEnterpriseInfo, setLogout } =
		useAuthStore();
	const isLoggedIn = authStage === 'LOGGED_IN' && !!token;
	const isAdmin =
		isLoggedIn &&
		(loginType === 'admin' || roles.includes('common') || roles.some((r) => r.toLowerCase().includes('admin')));
	const isEnterprise = isLoggedIn && (loginType === 'enterprise' || roles.includes('enterpriseUser'));

	/**
	 * 拉取并同步最新用户信息、角色与权限
	 */
	const syncUserInfo = async (targetType?: LoginRoleType) => {
		const activeType = targetType ?? useAuthStore.getState().loginType ?? 'admin';
		if (activeType === 'enterprise') {
			const res = await getEnterpriseUserInfoAPI();
			const entData = extractEnterpriseInfo(res);
			if (entData) {
				updateEnterpriseInfo(entData);
				updateUserInfo(
					mapEnterpriseToUserInfo(entData),
					entData.roles?.length ? entData.roles : ['enterpriseUser'],
					[],
				);
			}
			return res;
		}

		const res = await getUserInfoAPI();
		if (res.user) {
			updateEnterpriseInfo(null);
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

	/**
	 * 统一处理登录成功的副作用
	 * @description 同步登陆状态、拉取用户信息
	 */
	const handleLoginEffect = async (newToken: string, type: LoginRoleType) => {
		setLoginSuccess(newToken, type);
		try {
			await syncUserInfo(type);
		} catch (e) {
			console.error('获取用户信息失败，请检查 token 有效性', e);
		}
	};

	/**
	 * 传统账号/密码登录方式 (适用于管理员端)
	 * @param params { username, password, code?, uuid? }
	 */
	const onAccountLogin = async (params: AccountLoginRequest) => {
		Taro.showLoading({ title: '登录中...', mask: true });
		try {
			const res = await accountLoginAPI(params);
			Taro.hideLoading();
			if (res.token) {
				await handleLoginEffect(res.token, 'admin');
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

	/**
	 * 发送企业登录短信验证码（不锁全屏，发送成功后直接进入倒计时）
	 */
	const onSendSmsCode = async (phone: string) => {
		try {
			const res = await sendSmsCodeAPI(phone);
			return { success: true, data: res.data };
		} catch (err: any) {
			Taro.showToast({ title: err?.msg || err?.message || '验证码发送失败', icon: 'none' });
			return { success: false, error: err };
		}
	};

	/**
	 * 企业端手机号验证码登录
	 */
	const onEnterpriseLogin = async (params: EnterpriseLoginRequest) => {
		Taro.showLoading({ title: '登录中...', mask: true });
		try {
			const res = await enterpriseLoginAPI(params);
			Taro.hideLoading();
			if (res.token) {
				await handleLoginEffect(res.token, 'enterprise');
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

	/**
	 * 企业用户注册
	 */
	const onEnterpriseRegister = async (params: EnterpriseRegisterRequest) => {
		Taro.showLoading({ title: '提交中...', mask: true });
		try {
			const res = await enterpriseRegisterAPI(params);
			Taro.hideLoading();
			await Taro.showModal({
				title: '提交成功',
				content: '请耐心等待后台审核短信通知，通过之后方能登录本系统。',
				showCancel: false,
				confirmText: '我知道了',
			});
			return { success: true, data: res };
		} catch (err: any) {
			Taro.hideLoading();
			Taro.showToast({ title: err?.msg || err?.message || '注册提交失败，请稍后重试', icon: 'none' });
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

	/**
	 * 鉴权执行器 (Auth Guarded Executor)
	 * 逻辑：在需要登录的操作前调用 (如点击收藏/关注/下单)，自动处理登录流程
	 */
	const runWithAuth = (action: () => void, targetUrl?: string) => {
		if (isLoggedIn) {
			action();
		} else {
			toLogin(targetUrl, 'navigateTo');
		}
	};

	/**
	 * 页面内验证守卫 (In-page Check)
	 * 逻辑：未登录时替换重定向到登录页
	 */
	const checkLogin = (targetUrl?: string): boolean => {
		if (!isLoggedIn) toLogin(targetUrl, 'redirectTo');
		return isLoggedIn;
	};

	/** 跳转前验证 */
	const navigateWithAuth = (targetUrl: string) => runWithAuth(() => mapsTo(targetUrl));

	/**
	 * 冷启动初始化鉴权状态
	 */
	const initAuth = async (_mode: 'account' | 'wechat' = 'account') => {
		// 检查本地是否有历史 Token
		if (token) {
			try {
				await syncUserInfo();
			} catch (e) {
				console.warn('冷启动校验 Token 异常', e);
			}
		}
	};

	return {
		// 状态
		token,
		authStage,
		loginType,
		isLoggedIn,
		isAdmin,
		isEnterprise,

		// 登录与注册方法
		onAccountLogin,
		onSendSmsCode,
		onEnterpriseLogin,
		onEnterpriseRegister,

		// 通用方法
		syncUserInfo,
		onLogout,
		toLogin,
		runWithAuth,
		checkLogin,
		navigateWithAuth,
		initAuth,
	};
};
