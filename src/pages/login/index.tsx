import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { Page, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useAppConfig } from '@/hooks/useAppConfig';
import { mapsTo, cn } from '@/utils/common';
import defaultLogo from '@/assets/images/logo.svg';

const LoginPage = () => {
	const { data: config } = useAppConfig();
	const { authStage, onManualLogin, onBindPhone } = useAuth();
	const [isAgreed, setIsAgreed] = useState(false);

	// 统一回退/跳转逻辑
	const handleNavigationBack = () => {
		const instance = Taro.getCurrentInstance();
		const queryBackUrl = instance.router?.params?.back_url;

		if (queryBackUrl) {
			const target = decodeURIComponent(queryBackUrl);
			if (!target.includes('/pages/login/index')) {
				return mapsTo(target, 'redirectTo');
			}
		}

		const pages = Taro.getCurrentPages();
		if (pages.length > 1) {
			const prevPage = pages[pages.length - 2];
			if (prevPage && prevPage.route) {
				const prevRoute = `/${prevPage.route}`;
				if (!prevRoute.includes('/pages/login/index')) {
					return Taro.navigateBack({ delta: 1 });
				}
			}
		}

		// 兜底回首页 (mapsTo 会自动识别 TabBar 执行 switchTab)
		mapsTo('/pages/index/index', 'reLaunch');
	};

	// 协议勾选检查
	const checkPrivacyAgreement = (): boolean => {
		if (!isAgreed) {
			Taro.showToast({
				title: '请先阅读并勾选协议',
				icon: 'none',
				duration: 2000,
			});
			return false;
		}
		return true;
	};

	// 切换协议勾选
	const toggleAgreement = () => {
		Taro.vibrateShort?.({ type: 'light' });
		setIsAgreed(!isAgreed);
	};

	// 微信快捷登录
	const handleLoginClick = async () => {
		if (!checkPrivacyAgreement()) return;
		const res = await onManualLogin();
		if (res && res.stage === 'LOGGED_IN') {
			Taro.showToast({ title: '登录成功', icon: 'success' });
			setTimeout(() => {
				handleNavigationBack();
			}, 300);
		}
	};

	// 手机号授权绑定
	const handleBindPhoneSuccess = async (e: any) => {
		if (!checkPrivacyAgreement()) return;
		const token = await onBindPhone(e);
		if (token) {
			setTimeout(() => {
				handleNavigationBack();
			}, 300);
		}
	};

	// 打开协议详情页
	const handleOpenAgreement = (type: 'agreement' | 'policy') => {
		mapsTo(`/pages/common/agreement/index?type=${type}`);
	};

	// 品牌信息
	const logoSrc = config?.appLogo || defaultLogo;
	const appName = config?.appName || '乌廷龙典当';
	const appDesc = config?.appDescription || '诚信质押 · 典当评估 · 资产变现 · 专业守护';

	return (
		<Page
			paddingX={false}
			className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#12100e] to-[#1e1914] flex flex-col justify-between relative overflow-hidden"
		>
			{/* 顶部背景装饰：柔和香槟金光晕 */}
			<View className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
			<View className="absolute top-1/3 -right-20 w-64 h-64 bg-amber-200/10 rounded-full blur-2xl pointer-events-none" />

			{/* 主视觉区域 */}
			<View className="flex-1 flex flex-col items-center justify-center px-8 pt-12 pb-6 relative z-10">
				{/* 品牌 Logo 容器 */}
				<View className="relative mb-6">
					<Image src={logoSrc} mode="aspectFill" className="size-24 rounded-full" />
				</View>

				{/* 品牌标题与副标题 */}
				<View className="flex flex-col items-center text-center max-w-xs text-white ">
					<Text className="text-xl font-extrabold tracking-wider mb-2">{appName}</Text>
					<Text className="text-xs opacity-60 leading-relaxed px-2">{appDesc}</Text>
				</View>

				{/* 核心服务信任徽章 */}
				<View className="flex items-center gap-3 mt-8 bg-white/80 backdrop-blur-xs py-3 px-4 rounded-full border border-primary/15 shadow-xs">
					<View className="flex items-center gap-1">
						<View className="icon-[ph--shield-check-fill] size-4 text-primary" />
						<Text className="text-xs text-text-title font-medium">正规持牌</Text>
					</View>
					<View className="w-px h-3 bg-primary/50" />
					<View className="flex items-center gap-1">
						<View className="icon-[ph--lock-key-fill] size-4 text-primary" />
						<Text className="text-xs text-text-title font-medium">资产安保</Text>
					</View>
					<View className="w-px h-3 bg-primary/50" />
					<View className="flex items-center gap-1">
						<View className="icon-[ph--lightning-fill] size-4 text-primary" />
						<Text className="text-xs text-text-title font-medium">极速放款</Text>
					</View>
				</View>
			</View>

			{/* 下半部分：操作与协议 */}
			<View className="w-full px-8 pb-10 flex flex-col items-center relative z-10">
				{/* 登录交互区 */}
				<View className="w-full mb-6">
					{/* 阶段 1：未登录，一键微信授权 */}
					{authStage === 'UNLOGIN' && (
						<View className="flex flex-col gap-3.5">
							<Button
								size="xl"
								variant="primary"
								icon="icon-[ph--wechat-logo-fill]"
								onClick={handleLoginClick}
								className="h-13 bg-linear-to-r from-[#d4af37] via-primary to-[#b38b46] text-white text-base font-semibold shadow-lg shadow-primary/30 active:opacity-95 rounded-2xl border-none"
							>
								微信一键授权登录
							</Button>
							<View className="flex items-center justify-center gap-1 text-xs text-text-muted/80">
								<View className="icon-[ph--check-circle] size-3 text-primary" />
								<Text>我们从始自终保障账户隐私安全</Text>
							</View>
						</View>
					)}

					{/* 阶段 2：需补全授权手机号完成实名资产绑定 */}
					{authStage === 'NEED_BIND_PHONE' && (
						<View className="flex flex-col gap-4 ">
							<Button
								size="xl"
								variant="primary"
								icon="icon-[ph--device-mobile-bold]"
								openType="getPhoneNumber"
								onGetPhoneNumber={handleBindPhoneSuccess}
								className="h-12 bg-linear-to-r from-[#d4af37] via-primary to-[#b38b46] text-white text-sm font-semibold shadow-md shadow-primary/25 rounded-xl border-none"
							>
								一键授权手机号登录
							</Button>
						</View>
					)}
				</View>

				{/* 协议勾选条款区 */}
				<View className="flex items-start justify-center gap-2">
					<View
						onClick={toggleAgreement}
						className={cn(
							'size-4 rounded-full border flex items-center justify-center mt-0.5 transition-all duration-200 shrink-0 cursor-pointer',
							isAgreed
								? 'bg-primary border-primary shadow-xs'
								: 'border-stone-300 bg-white hover:border-primary/50',
						)}
					>
						{isAgreed && <View className="icon-[ph--check-bold] size-2.5 text-white" />}
					</View>

					<View className="text-xs text-stone-500 leading-normal select-none">
						<Text onClick={toggleAgreement}>我已详细阅读并同意</Text>
						<Text
							className="text-primary font-semibold active:opacity-70"
							onClick={(e) => {
								e.stopPropagation();
								handleOpenAgreement('agreement');
							}}
						>
							《用户服务协议》
						</Text>
						<Text onClick={toggleAgreement}>与</Text>
						<Text
							className="text-primary font-semibold active:opacity-70"
							onClick={(e) => {
								e.stopPropagation();
								handleOpenAgreement('policy');
							}}
						>
							《隐私政策》
						</Text>
					</View>
				</View>

				{/* 游客通道：暂不登录 */}
				<View className="mt-8">
					<Text
						className="text-xs text-stone-400 hover:text-stone-600 active:text-primary transition-colors py-1 px-3"
						onClick={() => mapsTo('/pages/index/index', 'reLaunch')}
					>
						暂不登录，先去首页看看 &gt;
					</Text>
				</View>
			</View>
		</Page>
	);
};

export default LoginPage;
