import Taro from '@tarojs/taro';
import { useAuthStore } from '@/store/auth';
import { checkWxCodeAPI, bindPhoneAPI, logoutAPI } from '@/services/auth';
import { getUserInfoAPI } from '@/services/user';
import { toLogin, mapsTo } from '@/utils/common';

/**
 * 应用级 Auth 用户认证与授权 Hook
 */
export const useAuth = () => {
	const { token, authStage, uuid, setLoginSuccess, setNeedBind, updateUserInfo, setLogout } = useAuthStore();
	const isLoggedIn = authStage === 'LOGGED_IN' && !!token;

	/**
	 * 统一处理登录成功的副作用
	 * @description 同步登陆状态、拉取用户信息
	 */
	const handleLoginEffect = async (newToken: string) => {
		setLoginSuccess(newToken);
		try {
			const raw = await getUserInfoAPI();
			updateUserInfo(raw);
		} catch (e) {
			console.error('获取用户信息失败，请检查 token 有效性', e);
		}
	};

	/**
	 * 执行微信登录并进行静默预检
	 * @param isManual 是否由用户手动触发（决定是否显示 Loading）
	 * @returns 返回当前登录所处的最新阶段状态，供页面层进行路由流转
	 */
	const execWxLogin = async (isManual = false) => {
		if (isManual) Taro.showLoading({ title: '登录中...', mask: true });
		try {
			const { code } = await Taro.login();
			const res = await checkWxCodeAPI(code);
			if (res.token) {
				await handleLoginEffect(res.token);
				return { success: true, stage: 'LOGGED_IN' as const };
			} else if (res.uuid) {
				setNeedBind(res.uuid);
				return { success: true, stage: 'NEED_BIND_PHONE' as const };
			}
			return { success: false };
		} catch (e) {
			if (isManual) Taro.showToast({ title: '登录服务异常', icon: 'none' });
			return { success: false };
		} finally {
			if (isManual) Taro.hideLoading();
		}
	};

	/** 静默启动登录 (App.tsx 调用) */
	const onSilentLogin = () => execWxLogin(false);

	/** 手动登录 (登录页调用) */
	const onManualLogin = () => execWxLogin(true);

	/** 手机号一键绑定 (微信 getPhoneNumber 回调) */
	const onBindPhone = async (e: { detail: { code?: string; errMsg?: string } }) => {
		if (!e.detail.code || !uuid) {
			if (e.detail.errMsg?.includes('deny') || e.detail.errMsg?.includes('cancel')) {
				Taro.showToast({ title: '已取消授权', icon: 'none' });
			}
			return null;
		}
		Taro.showLoading({ title: '安全校验中...', mask: true });
		try {
			const res = await bindPhoneAPI({
				uuid: uuid,
				code: e.detail.code,
			});
			if (res.token) {
				await handleLoginEffect(res.token);
				Taro.showToast({ title: '登录成功', icon: 'success' });
				return res.token;
			}
		} catch (err) {
			console.error('手机号绑定失败', err);
		} finally {
			Taro.hideLoading();
		}
		return null;
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

	return {
		// 状态
		token,
		authStage,
		isLoggedIn,

		// 动作
		onSilentLogin,
		onManualLogin,
		onBindPhone,
		onLogout,
		toLogin,
		runWithAuth,
		checkLogin,
		navigateWithAuth,
	};
};
