import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Page } from '@/components/ui';
import { mapsTo } from '@/utils/common';

/**
 * 登录玄关页：引导用户根据身份选择对应登录方式
 */
const LoginEntryPage = () => {
	const instance = Taro.getCurrentInstance();
	const backUrl = instance.router?.params?.back_url;

	const buildTargetUrl = (basePath: string) => {
		return backUrl ? `${basePath}?back_url=${encodeURIComponent(decodeURIComponent(backUrl))}` : basePath;
	};

	const handleSelectEnterprise = () => {
		mapsTo(buildTargetUrl('/pages/login/enterprise/index'));
	};

	const handleSelectAdmin = () => {
		mapsTo(buildTargetUrl('/pages/login/account/index'));
	};

	return (
		<Page paddingX={false} showQuickMenu={false}>
			<View className="flex-1 flex flex-col px-8 pt-28">
				{/* 顶部平台欢迎语 */}
				<View className="flex flex-col items-center text-center mb-10">
					<Text className="text-2xl font-bold text-slate-800 tracking-tight">新城企业服务直通车</Text>
					<Text className="text-xs text-slate-600 mt-2">请选择您的身份，进入对应的登录通道</Text>
				</View>

				{/* 角色选择卡片列表 */}
				<View className="flex flex-col gap-4">
					{/* 入口一：企业用户登录 */}
					<View
						onClick={handleSelectEnterprise}
						className="bg-linear-to-br from-[#0e49ec] via-[#3472f2] to-[#4b9bf5] rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center justify-between gap-4 active:scale-98 active:bg-blue-50/30 transition-all cursor-pointer"
					>
						<View className="flex items-center gap-4 min-w-0 flex-1">
							<View className="size-16 rounded-full bg-white/60 flex items-center justify-center shrink-0">
								<View className="icon-[ph--device-mobile-camera-duotone] size-8 text-primary" />
							</View>
							<View className="flex flex-col min-w-0 gap-0.5">
								<Text className="font-bold text-white">企业用户登录</Text>
								<Text className="text-xs text-white/80 leading-relaxed">
									适用于企业负责人，支持手机号快捷登录与注册
								</Text>
							</View>
						</View>
						<View className="icon-[ph--caret-right-bold] size-5 text-white/50 shrink-0" />
					</View>

					{/* 入口二：管理员登录 */}
					<View
						onClick={handleSelectAdmin}
						className="bg-linear-to-br from-amber-600 via-amber-500 to-amber-400 rounded-2xl px-4 py-6 shadow-sm border border-orange-100 flex items-center justify-between gap-4 active:scale-98 active:bg-slate-50 transition-all cursor-pointer"
					>
						<View className="flex items-center gap-4 min-w-0 flex-1">
							<View className="size-16 rounded-full bg-white/60 flex items-center justify-center shrink-0">
								<View className="icon-[ph--shield-duotone] size-8 text-amber-600" />
							</View>
							<View className="flex flex-col min-w-0 gap-0.5">
								<Text className="font-bold text-white">管理员登录</Text>
								<Text className="text-xs text-white/80 leading-relaxed">
									适用于管理人员，使用后台系统分配的账号密码登录
								</Text>
							</View>
						</View>
						<View className="icon-[ph--caret-right-bold] size-5 text-white/50 shrink-0" />
					</View>
				</View>

				<View className="flex justify-center mt-5">
					<Text
						onClick={() => mapsTo('/pages/home/index', 'reLaunch')}
						className="text-sm underline text-slate-600 active:text-slate-600 px-4 py-2 cursor-pointer"
					>
						暂不登录，返回首页
					</Text>
				</View>
			</View>
		</Page>
	);
};

export default LoginEntryPage;
