import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useRef, useState } from 'react';
import { Page, Card, Tabs, Input, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { mapsTo, cn } from '@/utils/common';

type LoginTab = 'phone' | 'account';

const PHONE_REGEX = /^1\d{10}$/;
const COUNTDOWN_SECONDS = 60;

/**
 * 统一登录页（支持手机号验证码登录 / 账号密码登录切换，附带注册入口）
 */
export default function LoginPage() {
	const { onAccountLogin, onPhoneLogin, onSendSmsCode } = useAuth();

	const instance = Taro.getCurrentInstance();
	const initialPhone = instance.router?.params?.phone ? decodeURIComponent(instance.router.params.phone) : '';
	const initialTab = (instance.router?.params?.tab as LoginTab) === 'account' ? 'account' : 'phone';

	const [activeTab, setActiveTab] = useState<LoginTab>(initialTab);

	// 手机号登录表单
	const [phone, setPhone] = useState(initialPhone);
	const [smsCode, setSmsCode] = useState('');
	const [countdown, setCountdown] = useState(0);
	const [sendingCode, setSendingCode] = useState(false);

	// 账号密码登录表单
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const [loading, setLoading] = useState(false);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	/** 登录成功后统一回退/跳转 */
	const handleNavigationBack = () => {
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
			if (prevPage?.route && !`/${prevPage.route}`.includes('/pages/login/')) {
				return Taro.navigateBack({ delta: 1 });
			}
		}

		mapsTo('/pages/home/index', 'reLaunch');
	};

	const startCountdown = () => {
		if (timerRef.current) clearInterval(timerRef.current);
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

	/** 获取短信验证码 */
	const handleGetCode = async () => {
		if (countdown > 0 || sendingCode) return;
		const trimmedPhone = phone.trim();
		if (!PHONE_REGEX.test(trimmedPhone)) {
			return Taro.showToast({ title: '请输入正确的11位手机号', icon: 'none' });
		}

		setSendingCode(true);
		try {
			const res = await onSendSmsCode(trimmedPhone);
			if (res.success) startCountdown();
		} finally {
			setSendingCode(false);
		}
	};

	/** 提交登录 */
	const handleSubmit = async () => {
		if (activeTab === 'phone') {
			const trimmedPhone = phone.trim();
			const trimmedCode = smsCode.trim();
			if (!PHONE_REGEX.test(trimmedPhone)) {
				return Taro.showToast({ title: '请输入正确的11位手机号', icon: 'none' });
			}
			if (!/^\d{4,8}$/.test(trimmedCode)) {
				return Taro.showToast({ title: '请输入正确的短信验证码', icon: 'none' });
			}

			setLoading(true);
			try {
				const res = await onPhoneLogin({ phone: trimmedPhone, code: trimmedCode });
				if (res.success) {
					setTimeout(() => handleNavigationBack(), 400);
				}
			} finally {
				setLoading(false);
			}
			return;
		}

		const trimmedUsername = username.trim();
		const trimmedPassword = password.trim();
		if (!trimmedUsername) {
			return Taro.showToast({ title: '请输入登录账号', icon: 'none' });
		}
		if (!trimmedPassword) {
			return Taro.showToast({ title: '请输入登录密码', icon: 'none' });
		}

		setLoading(true);
		try {
			const res = await onAccountLogin({
				username: trimmedUsername,
				password: trimmedPassword,
			});
			if (res.success) {
				setTimeout(() => handleNavigationBack(), 400);
			}
		} finally {
			setLoading(false);
		}
	};

	/** 跳转注册页 */
	const handleGoRegister = () => {
		const backUrl = instance.router?.params?.back_url;
		const params: string[] = [];
		if (phone.trim()) params.push(`phone=${encodeURIComponent(phone.trim())}`);
		if (backUrl) params.push(`back_url=${encodeURIComponent(decodeURIComponent(backUrl))}`);
		const query = params.length > 0 ? `?${params.join('&')}` : '';
		mapsTo(`/pages/login/register/index${query}`);
	};

	const canSendCode = countdown === 0 && !sendingCode && PHONE_REGEX.test(phone.trim());

	return (
		<Page showQuickMenu={false}>
			<View className="flex-1 flex flex-col pt-16 pb-10">
				{/* 顶部品牌标题 */}
				<View className="flex flex-col items-center text-center mb-8">
					<View className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
						<View className="icon-[ph--cube-duotone] size-8" />
					</View>
					<Text className="text-xl font-bold tracking-tight">欢迎登录</Text>
					<Text className="text-xs opacity-60 mt-1">支持手机号验证码或账号密码快捷登录</Text>
				</View>

				{/* 登录卡片 */}
				<Card noPadding className="overflow-hidden">
					<Tabs
						tabs={[
							{ label: '手机号登录', value: 'phone' },
							{ label: '账号密码登录', value: 'account' },
						]}
						value={activeTab}
						onChange={setActiveTab}
					/>

					<View className="p-5 flex flex-col gap-4">
						{activeTab === 'phone' ? (
							<>
								<Input
									type="number"
									maxlength={11}
									prefix="icon-[ph--device-mobile]"
									placeholder="请输入11位手机号"
									value={phone}
									onChange={setPhone}
									clearable
								/>

								<View className="flex items-center gap-2.5">
									<Input
										type="number"
										maxlength={6}
										prefix="icon-[ph--shield-check]"
										placeholder="请输入短信验证码"
										value={smsCode}
										onChange={setSmsCode}
										className="flex-1"
									/>
									<Button
										size="md"
										variant={canSendCode ? 'primary' : 'zinc'}
										appearance={canSendCode ? 'soft' : 'solid'}
										rounded={false}
										disabled={!canSendCode}
										className="h-11 px-3.5 shrink-0 text-xs"
										onClick={handleGetCode}
									>
										{sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
									</Button>
								</View>
							</>
						) : (
							<>
								<Input
									maxlength={30}
									prefix="icon-[ph--user]"
									placeholder="请输入账号"
									value={username}
									onChange={setUsername}
									clearable
								/>

								<Input
									maxlength={20}
									password={!showPassword}
									prefix="icon-[ph--lock-key]"
									placeholder="请输入登录密码"
									value={password}
									onChange={setPassword}
									suffix={
										<View
											onClick={() => setShowPassword((v) => !v)}
											className={cn(
												'size-4.5 text-zinc-400 cursor-pointer',
												showPassword ? 'icon-[ph--eye-bold]' : 'icon-[ph--eye-slash-bold]',
											)}
										/>
									}
								/>
							</>
						)}

						<Button
							size="lg"
							block
							variant="primary"
							loading={loading}
							onClick={handleSubmit}
							className="mt-1"
						>
							立即登录
						</Button>

						{/* 底部注册入口 */}
						<View className="flex items-center justify-between pt-3 border-t border-zinc-100">
							<Text className="text-xs opacity-60">还没有账号？</Text>
							<View
								onClick={handleGoRegister}
								className="flex items-center gap-1 cursor-pointer active:opacity-70"
							>
								<Text className="text-xs font-semibold text-primary">立即注册</Text>
								<View className="icon-[ph--arrow-right] size-3.5 text-primary" />
							</View>
						</View>
					</View>
				</Card>

				{/* 暂不登录返回首页 */}
				<View className="flex justify-center mt-6">
					<Text
						onClick={() => mapsTo('/pages/home/index', 'reLaunch')}
						className="text-xs opacity-60 underline px-4 py-2 cursor-pointer"
					>
						暂不登录，返回首页
					</Text>
				</View>
			</View>
		</Page>
	);
}
