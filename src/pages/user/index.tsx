import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useAuthStore } from '@/store/auth';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useAppConfig } from '@/hooks/useAppConfig';
import { Avatar, NavItem, Page, Card, Asset, Gender, Divider } from '@/components/ui';
import { mapsTo } from '@/utils/common';

export default function UserPage() {
	const { userInfo } = useAuthStore();
	const { isLoggedIn, onLogout, navigateWithAuth } = useAuth();
	const { data: appConfig } = useAppConfig();
	const { refetch } = useUser();

	useDidShow(() => {
		if (isLoggedIn) refetch().catch((err) => console.error('用户中心同步最新身份失败:', err));
	});

	return (
		<Page hasTabBar paddingX={false} showQuickMenu={false}>
			{/* 顶部用户信息渐变背景 */}
			<View className="bg-linear-to-b from-primary via-blue-500 to-blue-400 h-42 pt-8 px-6">
				<View className="flex items-center gap-4">
					<View className="border-4 border-white/30 rounded-full">
						<Avatar
							src={isLoggedIn ? userInfo?.avatar : ''}
							name={isLoggedIn ? userInfo?.nickName || userInfo?.userName : 'U'}
							size="md"
						/>
					</View>

					<View className="flex-1 min-w-0">
						{isLoggedIn && userInfo ? (
							<View className="flex flex-col text-white">
								<View className="flex items-center gap-1.5">
									<Text className="text-lg font-bold truncate">
										{userInfo.nickName || userInfo.userName}
									</Text>
									<Gender gender={userInfo.sex} />
								</View>
								<View className="flex items-center gap-1 mt-1 opacity-75">
									<View className="icon-[ph--device-mobile-thin] size-3.5" />
									<Text className="text-xs">{userInfo.maskedPhone || '暂无手机号'}</Text>
								</View>
							</View>
						) : (
							<View onClick={() => mapsTo('/pages/login/index')} className="cursor-pointer">
								<Text className="text-xl font-bold text-white">点击登录</Text>
								<Text className="text-xs text-white/75 block mt-1">登录后同步个人资料与数据</Text>
							</View>
						)}
					</View>

					{isLoggedIn && (
						<View
							className="icon-[ph--gear] size-6 text-white/90 active:opacity-70 cursor-pointer shrink-0"
							onClick={() => navigateWithAuth('/pages/user/profile/index')}
						/>
					)}
				</View>
			</View>

			<View className="px-4 -mt-14 flex flex-col gap-4">
				{/* 数据概览卡片 */}
				<Card className="flex flex-row items-center py-4">
					<Asset label="我的收藏" value={0} />
					<Divider orientation="vertical" />
					<Asset label="待办事项" value={0} valueColor="text-zinc-700" />
					<Divider orientation="vertical" />
					<Asset label="消息通知" value={0} valueColor="text-zinc-700" />
				</Card>

				{/* 功能列表 */}
				<Card noPadding>
					<NavItem
						icon="icon-[ph--user-gear]"
						layout="list"
						label="个人资料"
						extra={isLoggedIn ? '去编辑' : '需登录'}
						onClick={() => navigateWithAuth('/pages/user/profile/index')}
					/>
					<NavItem
						icon="icon-[ph--squares-four]"
						layout="list"
						label="UI 组件示例"
						onClick={() => mapsTo('/pages/example/index')}
					/>
					<NavItem icon="icon-[ph--headset]" layout="list" label="在线客服" openType="contact" />
					<NavItem
						icon="icon-[ph--info]"
						layout="list"
						label="关于应用"
						border={isLoggedIn}
						onClick={() => Taro.showToast({ title: 'Base Taro v1.0.0', icon: 'none' })}
					/>

					{isLoggedIn && (
						<View
							className="p-4 flex items-center justify-center active:bg-rose-50 transition-colors cursor-pointer"
							onClick={() => {
								Taro.showModal({
									title: '提示',
									content: '确定要退出当前账户吗？',
									success: (res) => res.confirm && onLogout(),
								});
							}}
						>
							<View className="icon-[ph--sign-out-light] size-5 text-rose-500 mr-2" />
							<Text className="text-sm text-rose-500 font-semibold">退出登录</Text>
						</View>
					)}
				</Card>

				{/* 底部版权与备案信息 */}
				{(appConfig?.copyright || appConfig?.icp) && (
					<View className="py-4 flex flex-col items-center gap-1 text-center text-xs opacity-50">
						{appConfig.copyright && <Text>{appConfig.copyright}</Text>}
						{appConfig.icp && <Text>备案号: {appConfig.icp}</Text>}
					</View>
				)}
			</View>
		</Page>
	);
}
