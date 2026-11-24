import Taro from '@tarojs/taro';
import { View, Text, ViewProps } from '@tarojs/components';
import { Badge } from '@/components/ui';
import { useAuthStore } from '@/store/auth';
import { useAuth } from '@/hooks/useAuth';
import { mapsTo, cn } from '@/utils/common';

export interface UserHeaderProps extends ViewProps {
	/**
	 * 展示形态：
	 * - hero: 首页通栏渐变大头（配合下方卡片 -mt-24 压边）
	 * - compact: 内页紧凑型共用蓝底头部（默认）
	 */
	variant?: 'hero' | 'compact';
	className?: string;
}

/**
 * 顶部用户信息共用头部（业务组件：含用户名、身份徽章、设置与退出登录动作）
 */
export function UserHeader({ variant = 'compact', className, ...props }: UserHeaderProps) {
	const { userInfo, enterpriseInfo } = useAuthStore();
	const { isLoggedIn, isAdmin, isEnterprise, onLogout, navigateWithAuth } = useAuth();

	const handleLogoutConfirm = () => {
		Taro.showModal({
			title: '提示',
			content: '确定要退出当前账户吗？',
			success: (res) => {
				if (res.confirm) onLogout();
			},
		});
	};

	const primaryEnterpriseUser = Array.isArray(enterpriseInfo?.user)
		? enterpriseInfo?.user[0]
		: (enterpriseInfo?.user as any);
	const displayName = isEnterprise
		? primaryEnterpriseUser?.name || userInfo?.nickName || enterpriseInfo?.entName || '企业用户'
		: userInfo?.nickName || userInfo?.userName || '已登录用户';
	const displaySub = isEnterprise
		? [enterpriseInfo?.entName, primaryEnterpriseUser?.position].filter(Boolean).join(' · ') ||
			'欢迎登录企业服务工作台'
		: '欢迎登录管理控制工作台';

	const isHero = variant === 'hero';

	return (
		<View
			className={cn(
				'relative z-10 px-5 text-white',
				isHero
					? 'bg-linear-to-b from-primary via-primary to-slate-50 pt-4 pb-28'
					: 'bg-primary py-3.5 shadow-xs',
				className,
			)}
			{...props}
		>
			<View className="flex items-center justify-between gap-3">
				<View className="min-w-0 flex-1">
					{isLoggedIn ? (
						<View className="flex flex-col">
							<Text className="font-bold text-white truncate">{displayName}</Text>
							<Text className="text-xs text-white/75 truncate">{displaySub}</Text>
						</View>
					) : (
						<View className="flex flex-col cursor-pointer" onClick={() => mapsTo('/pages/login/index')}>
							<Text className="font-bold text-white">您还未登录</Text>
							<Text className="text-xs text-white/75">点击登录，开启企业服务工作台</Text>
						</View>
					)}
				</View>

				{/* 已登录快捷操作：仅管理员显示个人资料修改，全员显示退出登录 */}
				{isLoggedIn && (
					<View className="flex items-center gap-2 shrink-0">
						<Badge className="bg-white/20 text-white shrink-0">{isAdmin ? '管理员' : '企业端'}</Badge>

						{isAdmin && (
							<View
								onClick={() => navigateWithAuth('/pages/user/profile/index')}
								className="flex items-center justify-center size-8 rounded-full bg-white/15 active:bg-white/25 transition-colors cursor-pointer"
							>
								<View className="icon-[ph--gear] size-5 text-white" />
							</View>
						)}
						<View
							onClick={handleLogoutConfirm}
							className="flex items-center justify-center size-8 rounded-full bg-white/15 active:bg-white/25 transition-colors cursor-pointer"
						>
							<View className="icon-[ph--sign-out] size-5 text-white" />
						</View>
					</View>
				)}
			</View>
		</View>
	);
}
