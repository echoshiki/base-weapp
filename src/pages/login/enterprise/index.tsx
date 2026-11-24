import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useRef, useState } from 'react';
import { Page, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { mapsTo, cn } from '@/utils/common';

const PHONE_REGEX = /^1\d{10}$/;
const COUNTDOWN_SECONDS = 60;

/**
 * 企业用户登录页（手机号 + 短信验证码登录，预留企业注册入口）
 */
const EnterpriseLoginPage = () => {
	const { onSendSmsCode, onEnterpriseLogin } = useAuth();

	const instance = Taro.getCurrentInstance();
	const initialPhone = instance.router?.params?.phone ? decodeURIComponent(instance.router.params.phone) : '';

	const [phone, setPhone] = useState(initialPhone);
	const [verificationCode, setVerificationCode] = useState<string>('');
	const [countdown, setCountdown] = useState(0);
	const [sendingCode, setSendingCode] = useState(false);
	const [loading, setLoading] = useState(false);

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

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

		mapsTo('/pages/home/index', 'reLaunch');
	};

	const startCountdown = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		setCountdown(COUNTDOWN_SECONDS);
		timerRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					if (timerRef.current) {
						clearInterval(timerRef.current);
						timerRef.current = null;
					}
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	// 获取短信验证码
	const handleGetCode = async () => {
		if (countdown > 0 || sendingCode) return;

		const trimmedPhone = phone.trim();
		if (!PHONE_REGEX.test(trimmedPhone)) {
			return Taro.showToast({ title: '请输入正确的11位手机号', icon: 'none' });
		}

		setSendingCode(true);
		try {
			const res = await onSendSmsCode(trimmedPhone);
			if (res.success) {
				startCountdown();
			}
		} finally {
			setSendingCode(false);
		}
	};

	// 执行企业端手机号验证码登录
	const handleLogin = async () => {
		const trimmedPhone = phone.trim();
		const trimmedCode = verificationCode.trim();

		if (!PHONE_REGEX.test(trimmedPhone)) {
			return Taro.showToast({ title: '请输入正确的11位手机号', icon: 'none' });
		}
		if (!/^\d+$/.test(trimmedCode)) {
			return Taro.showToast({ title: '请输入数字短信验证码', icon: 'none' });
		}

		setLoading(true);
		try {
			const res = await onEnterpriseLogin({
				phone: trimmedPhone,
				verificationCode: Number(trimmedCode),
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

	// 跳转企业用户注册页
	const handleGoRegister = () => {
		const backUrl = instance.router?.params?.back_url;
		const params: string[] = [];
		if (phone.trim()) params.push(`phone=${encodeURIComponent(phone.trim())}`);
		if (backUrl) params.push(`back_url=${encodeURIComponent(decodeURIComponent(backUrl))}`);
		const query = params.length > 0 ? `?${params.join('&')}` : '';
		mapsTo(`/pages/login/register/index${query}`);
	};

	// 切换至管理员登录页
	const handleSwitchAdmin = () => {
		const instance = Taro.getCurrentInstance();
		const backUrl = instance.router?.params?.back_url;
		const target = backUrl
			? `/pages/login/account/index?back_url=${encodeURIComponent(decodeURIComponent(backUrl))}`
			: '/pages/login/account/index';
		mapsTo(target, 'redirectTo');
	};

	const canSendCode = countdown === 0 && !sendingCode && PHONE_REGEX.test(phone.trim());

	return (
		<Page paddingX={false} showQuickMenu={false}>
			<View className="flex-1 flex flex-col px-5 pt-20">
				{/* 顶部标题 */}
				<View className="flex flex-col items-center text-center mb-8">
					<Text className="text-xl font-bold text-slate-900 tracking-tight">新城企业服务直通车</Text>
					<Text className="text-sm text-slate-400 mt-1">企业用户快捷登录通道</Text>
				</View>

				{/* 登录表单卡片 */}
				<View className="bg-white rounded p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
					<Text className="font-bold text-slate-800 mb-1">手机号验证码登录</Text>

					{/* 手机号输入框 */}
					<View className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
						<View className="icon-[ph--device-mobile] size-5 text-slate-400 shrink-0" />
						<Input
							type="number"
							value={phone}
							maxlength={11}
							onInput={(e) => setPhone(e.detail.value)}
							placeholder="请输入企业注册手机号"
							placeholderClass="text-slate-400 text-xs"
							className="flex-1 flex items-center text-sm text-slate-800"
						/>
					</View>

					{/* 验证码输入框 + 获取按钮 */}
					<View className="flex items-center gap-2.5">
						<View className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-12">
							<View className="icon-[ph--shield-check] size-5 text-slate-400 shrink-0" />
							<Input
								type="number"
								value={verificationCode}
								maxlength={8}
								onInput={(e) => setVerificationCode(e.detail.value)}
								placeholder="请输入短信验证码"
								placeholderClass="text-slate-400 text-xs"
								className="flex-1 flex items-center text-sm text-slate-800"
							/>
						</View>

						<View
							onClick={handleGetCode}
							className={cn(
								'h-12 px-3.5 rounded-xl flex items-center justify-center shrink-0 border transition-all',
								canSendCode
									? 'bg-blue-50 border-blue-200 text-primary active:bg-blue-100 cursor-pointer'
									: 'bg-slate-100 border-slate-200 text-slate-400',
							)}
						>
							<Text className="text-sm font-semibold whitespace-nowrap">
								{sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s 后重试` : '获取验证码'}
							</Text>
						</View>
					</View>

					{/* 登录提交按钮 */}
					<Button size="xl" block variant="primary" loading={loading} onClick={handleLogin}>
						立即登录
					</Button>

					{/* 预留注册入口 */}
					<View className="flex items-center justify-between pt-2 border-t border-slate-100">
						<Text className="text-sm text-slate-400">还没有企业账号？</Text>
						<View
							onClick={handleGoRegister}
							className="flex items-center gap-1 cursor-pointer active:opacity-70"
						>
							<Text className="text-sm font-semibold text-primary">立即注册</Text>
							<View className="icon-[ph--arrow-right] size-3.5 text-primary" />
						</View>
					</View>
				</View>

				<View className="flex justify-center mt-5">
					<Text
						onClick={handleSwitchAdmin}
						className="text-sm text-slate-400 underline active:text-slate-600 px-4 py-2 cursor-pointer"
					>
						我是管理员，切换账号密码登录
					</Text>
				</View>
			</View>
		</Page>
	);
};

export default EnterpriseLoginPage;
