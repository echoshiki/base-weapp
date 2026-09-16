import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useAuthStore } from '@/store/auth';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useAppConfig } from '@/hooks/useAppConfig';
import { Avatar, NavItem, Page, Card, Asset, Gender } from '@/components/ui';
import { mapsTo } from '@/utils/common';

export default function UserPage() {
	const { userInfo } = useAuthStore();
	const { isLoggedIn, onLogout, navigateWithAuth } = useAuth();

	// 全局系统配置
	const { data: appConfig } = useAppConfig();

	// 挂载更新用户信息
	const { refetch } = useUser();

	useDidShow(() => {
		if (isLoggedIn) refetch().catch((err) => console.error('用户中心同步最新身份失败:', err));
	});

	return (
		<Page hasTabBar paddingX={false}>
			<View className="bg-linear-to-b from-[#0a0a0a] via-[#12100e] to-[#1e1914] h-42 pt-8 px-6">
				<View className="flex items-center gap-4">
					{/* 用户头像 */}
					<View className="border-8 border-primary rounded-full">
						<Avatar
							src={isLoggedIn ? userInfo?.avatar : ''}
							name={isLoggedIn ? userInfo?.name : '游客'}
							size="md"
						/>
					</View>

					{/* 用户信息 */}
					<View className="flex-1">
						{isLoggedIn && userInfo ? (
							<View className="flex flex-col text-white">
								<View className="flex items-center gap-1.5">
									<Text className="text-lg font-bold text-current block">{userInfo.name}</Text>
									<Gender gender={userInfo.gender} />
								</View>
								<View className="flex items-center gap-1 text-xs opacity-60">
									<View className="flex items-center gap-1 mt-1">
										<View className="icon-[ph--device-mobile-thin] size-3.5" />
										<Text className="text-xs">{userInfo?.maskedPhone || '暂无手机号'}</Text>
									</View>
								</View>
							</View>
						) : (
							<View onClick={() => !isLoggedIn && mapsTo('/pages/login/index')}>
								<Text className="text-xl font-bold text-white">点击登录</Text>
								<Text className="text-sm text-white/50 block mt-1">登录发现更多精彩</Text>
							</View>
						)}
					</View>

					{/* 设置按钮 */}
					{isLoggedIn && (
						<View
							className="icon-[ph--gear] w-6 h-6 text-text-title"
							onClick={() => navigateWithAuth('/pages/user/profile/index')}
						/>
					)}
				</View>
			</View>

			<View className="px-4 -mt-15 flex flex-col gap-5">
				<Card className="flex flex-row">
					<Asset label="年度积分" value={userInfo?.accumulatedAccount || 0} />
					<Asset label="补分额度" value={userInfo?.currentTicket || 0} valueColor="text-zinc-600" />
					<Asset label="安全等级" value={userInfo?.registeredDays || 0} valueColor="text-zinc-600" />
				</Card>

				{/* 功能列表区域 */}
				<Card noPadding>
					<NavItem
						icon="icon-[ph--user-gear]"
						layout="list"
						label="个人资料"
						onClick={() => navigateWithAuth('/pages/user/profile/index')}
					/>
					<NavItem
						icon="icon-[ph--question]"
						layout="list"
						label="帮助中心"
						onClick={() => mapsTo('/pages/article/index')}
					/>
					<NavItem icon="icon-[ph--headset]" layout="list" label="在线客服" openType="contact" />
					<NavItem
						icon="icon-[ph--book]"
						layout="list"
						label="用户协议"
						onClick={() => mapsTo('/pages/common/agreement/index?type=agreement')}
					/>
					<NavItem
						icon="icon-[ph--file]"
						layout="list"
						label="隐私条款"
						onClick={() => mapsTo('/pages/common/agreement/index?type=policy')}
					/>

					{/* 退出按钮 */}
					{isLoggedIn && (
						<View
							className="p-4 flex items-center justify-center active:bg-red-50 transition-colors"
							onClick={() => {
								Taro.showModal({
									title: '提示',
									content: '确定要退出当前账户吗？',
									success: (res) => res.confirm && onLogout(),
								});
							}}
						>
							<View className="icon-[ph--sign-out-light] w-5 h-5 text-primary mr-2" />
							<Text className="text-sm text-primary font-bold">退出登录</Text>
						</View>
					)}
				</Card>

				{/* 底部版权所有与备案号 */}
				{(appConfig?.copyright || appConfig?.icp) && (
					<View className="py-6 flex flex-col items-center gap-1 text-center text-xs text-text-muted/40">
						{appConfig.copyright && <Text>{appConfig.copyright}</Text>}
						{appConfig.icp && <Text>备案号: {appConfig.icp}</Text>}
					</View>
				)}
			</View>
		</Page>
	);
}
