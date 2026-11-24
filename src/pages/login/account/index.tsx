import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { Page, Button, Alert } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { mapsTo, cn } from '@/utils/common';

const AccountLoginPage = () => {
	const { onAccountLogin } = useAuth();

	const [username, setUsername] = useState('');
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
		const trimmedUsername = username.trim();
		const trimmedPassword = password.trim();
		if (!trimmedUsername) {
			return Taro.showToast({ title: '请输入分配的管理账户', icon: 'none' });
		}
		if (trimmedUsername.length > 30) {
			return Taro.showToast({ title: '账号长度不能超过30个字符', icon: 'none' });
		}
		if (!trimmedPassword) {
			return Taro.showToast({ title: '请输入登录密码', icon: 'none' });
		}
		if (trimmedPassword.length > 20) {
			return Taro.showToast({ title: '密码长度不能超过20个字符', icon: 'none' });
		}

		setLoading(true);
		try {
			const res = await onAccountLogin({
				username: trimmedUsername,
				password: trimmedPassword,
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

	return (
		<Page paddingX={false} showQuickMenu={false}>
			<View className="flex-1 flex flex-col px-5 pt-28">
				{/* 登录表单卡片 */}
				<View className="bg-white rounded p-6 py-8 shadow-sm border border-slate-100 flex flex-col gap-4">
					<View className="flex flex-col justify-center items-center gap-1">
						<Text className="font-bold text-slate-800 text-xl">管理人员登录</Text>
						<Text className="font-light text-sm text-slate-500">MANAGER LOGIN</Text>
					</View>

					{/* 账号输入框 */}
					<View className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
						<View className="icon-[ph--user] size-5 shrink-0" />
						<Input
							value={username}
							maxlength={30}
							onInput={(e) => setUsername(e.detail.value)}
							placeholder="请输入管理账户"
							className="flex-1 text-sm text-slate-800 flex items-center"
						/>
					</View>

					{/* 密码输入框 */}
					<View className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
						<View className="icon-[ph--lock-key] size-5 shrink-0" />
						<Input
							value={password}
							maxlength={20}
							password={!showPassword}
							onInput={(e) => setPassword(e.detail.value)}
							placeholder="请输入登录密码"
							className="flex-1 text-slate-800 text-sm flex items-center"
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
					<Button size="xl" block variant="primary" loading={loading} onClick={handleLogin}>
						立即登录
					</Button>

					{/* 提示说明 */}
					<Alert variant="warning" hideIcon>
						注：账号密码由应急管理部门在后台统一开通分配，初次登录请及时修改初始密码。
					</Alert>
				</View>
			</View>
		</Page>
	);
};

export default AccountLoginPage;
