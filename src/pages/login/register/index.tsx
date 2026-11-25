import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useRef, useState } from 'react';
import { Page, Card, Input, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { mapsTo, cn } from '@/utils/common';

const PHONE_REGEX = /^1\d{10}$/;
const COUNTDOWN_SECONDS = 60;

/**
 * 通用账号注册页
 */
export default function RegisterPage() {
	const { onSendSmsCode, onRegister } = useAuth();
	const instance = Taro.getCurrentInstance();
	const initialPhone = instance.router?.params?.phone ? decodeURIComponent(instance.router.params.phone) : '';

	const [phone, setPhone] = useState(initialPhone);
	const [smsCode, setSmsCode] = useState('');
	const [nickName, setNickName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const [countdown, setCountdown] = useState(0);
	const [sendingCode, setSendingCode] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

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

	const handleBackToLogin = (registeredPhone?: string) => {
		const backUrl = instance.router?.params?.back_url;
		const params: string[] = [];
		const targetPhone = registeredPhone ?? phone.trim();
		if (targetPhone) params.push(`phone=${encodeURIComponent(targetPhone)}`);
		if (backUrl) params.push(`back_url=${encodeURIComponent(decodeURIComponent(backUrl))}`);
		const query = params.length > 0 ? `?${params.join('&')}` : '';
		mapsTo(`/pages/login/index${query}`, 'redirectTo');
	};

	const handleSubmit = async () => {
		const trimmedPhone = phone.trim();
		const trimmedCode = smsCode.trim();
		const trimmedPassword = password.trim();

		if (!PHONE_REGEX.test(trimmedPhone)) {
			return Taro.showToast({ title: '请输入正确的11位手机号', icon: 'none' });
		}
		if (!/^\d{4,8}$/.test(trimmedCode)) {
			return Taro.showToast({ title: '请输入正确的短信验证码', icon: 'none' });
		}
		if (trimmedPassword.length < 6 || trimmedPassword.length > 20) {
			return Taro.showToast({ title: '密码长度需在 6-20 位之间', icon: 'none' });
		}
		if (trimmedPassword !== confirmPassword.trim()) {
			return Taro.showToast({ title: '两次输入的密码不一致', icon: 'none' });
		}

		setSubmitting(true);
		try {
			const res = await onRegister({
				phone: trimmedPhone,
				code: trimmedCode,
				password: trimmedPassword,
				nickName: nickName.trim() || undefined,
			});
			if (res.success) {
				setTimeout(() => handleBackToLogin(trimmedPhone), 500);
			}
		} finally {
			setSubmitting(false);
		}
	};

	const canSendCode = countdown === 0 && !sendingCode && PHONE_REGEX.test(phone.trim());

	return (
		<Page showQuickMenu={false}>
			<View className="flex-1 flex flex-col pt-10 pb-10">
				<View className="flex flex-col items-center text-center mb-6">
					<Text className="text-xl font-bold tracking-tight">创建新账号</Text>
					<Text className="text-xs opacity-60 mt-1">填写基本信息即可完成账号注册</Text>
				</View>

				<Card className="gap-4">
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

					<Input
						maxlength={20}
						prefix="icon-[ph--user]"
						placeholder="请输入昵称（选填）"
						value={nickName}
						onChange={setNickName}
						clearable
					/>

					<Input
						maxlength={20}
						password={!showPassword}
						prefix="icon-[ph--lock-key]"
						placeholder="请设置 6-20 位登录密码"
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

					<Input
						maxlength={20}
						password={!showPassword}
						prefix="icon-[ph--lock-key]"
						placeholder="请再次确认登录密码"
						value={confirmPassword}
						onChange={setConfirmPassword}
					/>

					<Button size="lg" block variant="primary" loading={submitting} onClick={handleSubmit} className="mt-1">
						提交注册
					</Button>

					<View className="flex items-center justify-center pt-3 border-t border-zinc-100">
						<Text
							onClick={() => handleBackToLogin()}
							className="text-xs text-primary font-medium cursor-pointer active:opacity-70"
						>
							已有账号？返回登录
						</Text>
					</View>
				</Card>
			</View>
		</Page>
	);
}
