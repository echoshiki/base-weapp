import { View, Text, Input, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { Page, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useAppConfig } from '@/hooks/useAppConfig';
import { mapsTo, cn } from '@/utils/common';
import defaultCover from '@/assets/images/default-cover.svg';

const AccountLoginPage = () => {
	const { data: config } = useAppConfig();
	const { onAccountLogin } = useAuth();

	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	// 统一回退/跳转逻辑
	const handleNavigationBack = () => {
		const instance = Taro.getCurrentInstance();
		const queryBackUrl = instance.router?.params?.back_url;

		if (queryBackUrl) {
			const target = decodeURIComponent(queryBackUrl);
			if (!target.includes('/pages/login/')) {
				return mapsTo(target, 'redirectTo');
			}
		}

		const pages = Taro.getCurrentPages();
		if (pages.length > 1) {
			const prevPage = pages[pages.length - 2];
			if (prevPage && prevPage.route) {
				const prevRoute = `/${prevPage.route}`;
				if (!prevRoute.includes('/pages/login/')) {
					return Taro.navigateBack({ delta: 1 });
				}
			}
		}

		// 兜底回首页
		mapsTo('/pages/home/index', 'reLaunch');
	};

	// 执行账号密码登录
	const handleLogin = async () => {
		if (!userName.trim()) {
			return Taro.showToast({ title: '请输入分配的管理账户', icon: 'none' });
		}
		if (!password.trim()) {
			return Taro.showToast({ title: '请输入登录密码', icon: 'none' });
		}

		setLoading(true);
		try {
			const res = await onAccountLogin({
				userName: userName.trim(),
				password: password.trim(),
			});

			if (res.success) {
				setTimeout(() => {
					handleNavigationBack();
				}, 400);
			}
		} finally {
			setLoading(false);
		}
	};

	const logoSrc = config?.appLogo || defaultCover;

	return (
		<Page paddingX={false} className="min-h-screen bg-slate-50 flex flex-col justify-between">
			<View className="flex-1 flex flex-col px-7 pt-12">
				{/* 顶部系统徽章与标题 */}
				<View className="flex flex-col items-center text-center mb-8">
					<Text className="text-xl font-bold text-slate-900 tracking-tight">{config?.appName}</Text>
					<Text className="text-xs text-slate-400 mt-1">{config?.appDescription}</Text>
				</View>

				{/* 登录表单卡片 */}
				<View className="bg-white rounded p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
					<Text className="font-bold text-slate-800 mb-1">账号密码登录</Text>

					{/* 账号输入框 */}
					<View className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
						<View className="icon-[ph--user] size-5 text-slate-400 shrink-0" />
						<Input
							value={userName}
							onInput={(e) => setUserName(e.detail.value)}
							placeholder="请输入管理账户"
							placeholderClass="text-slate-400 text-xs"
							className="flex-1 text-sm text-slate-800"
						/>
					</View>

					{/* 密码输入框 */}
					<View className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
						<View className="icon-[ph--lock-key] size-5 text-slate-400 shrink-0" />
						<Input
							value={password}
							password={!showPassword}
							onInput={(e) => setPassword(e.detail.value)}
							placeholder="请输入登录密码"
							placeholderClass="text-slate-400 text-xs"
							className="flex-1 text-sm text-slate-800"
						/>
						<View
							onClick={() => setShowPassword(!showPassword)}
							className={cn(
								'size-5 text-slate-400 shrink-0 cursor-pointer',
								showPassword ? 'icon-[ph--eye-bold]' : 'icon-[ph--eye-slash-bold]',
							)}
						/>
					</View>

					{/* 登录提交按钮 */}
					<Button
						size="xl"
						variant="primary"
						loading={loading}
						onClick={handleLogin}
						className="w-full h-12 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl border-none shadow-md shadow-blue-500/25 mt-2 active:scale-98 transition-all"
					>
						立即登录
					</Button>

					{/* 提示说明 */}
					<View className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2.5 mt-1 text-xs text-amber-800 leading-relaxed">
						<Text>注：账号密码由应急管理部门在后台统一开通分配，初次登录请及时修改初始密码。</Text>
					</View>
				</View>
			</View>
		</Page>
	);
};

export default AccountLoginPage;
