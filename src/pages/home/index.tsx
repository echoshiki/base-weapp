import { View, Text } from '@tarojs/components';
import { Page, Card, Heading, ActionTile, Badge, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth';
import { ARTICLE_ROUTES } from '@/packages/article/routes';
import { FEEDBACK_ROUTES } from '@/packages/feedback/routes';
import { mapsTo } from '@/utils/common';

export default function Home() {
	const { isLoggedIn } = useAuth();
	const { userInfo } = useAuthStore();

	return (
		<Page hasTabBar showQuickMenu={false}>
			<View className="flex flex-col gap-4 py-4">
				{/* 顶部基座欢迎卡片 */}
				<Card className="gap-3">
					<View className="flex items-center justify-between gap-2">
						<Heading
							title="Base Taro 应用基座"
							subtitle="Taro 4 · React 18 · Tailwind CSS v4"
							size="lg"
							extra={
								<Badge variant={isLoggedIn ? 'emerald' : 'zinc'} dot>
									{isLoggedIn ? '已登录' : '未登录'}
								</Badge>
							}
						/>
					</View>
					<Text className="text-xs opacity-60 leading-relaxed">
						{isLoggedIn && userInfo
							? `欢迎回来，${userInfo.nickName || userInfo.userName || '用户'}。可从下方快速体验组件库或进入个人中心。`
							: '已内置原子级 UI 组件库、请求封装、React Query 与鉴权登录流，适合直接作为新项目起点。'}
					</Text>
					{!isLoggedIn && (
						<View className="flex items-center gap-2 pt-1">
							<Button size="sm" variant="primary" onClick={() => mapsTo('/pages/login/index')}>
								去登录 / 注册
							</Button>
							<Button
								size="sm"
								variant="zinc"
								appearance="outline"
								onClick={() => mapsTo('/pages/example/index')}
							>
								浏览 UI 组件
							</Button>
						</View>
					)}
				</Card>

				{/* 快捷功能磁贴 */}
				<Heading title="快捷入口" subtitle="基座内置页面导航" size="sm" />
				<View className="grid grid-cols-2 gap-3 h-32">
					<ActionTile
						layout="square"
						tone="dark"
						theme="primary"
						title="UI 组件库"
						subTitle="完整交互示例"
						icon="icon-[ph--squares-four-duotone]"
						onClick={() => mapsTo('/pages/example/index')}
					/>
					<ActionTile
						layout="square"
						tone="light"
						theme="emerald"
						title="个人中心"
						subTitle="资料与账号管理"
						icon="icon-[ph--user-circle-duotone]"
						onClick={() => mapsTo('/pages/user/index')}
					/>
				</View>

				<View className="grid grid-cols-2 gap-3">
					<ActionTile
						layout="compact"
						theme="blue"
						title="文章模块"
						subTitle="列表 + 详情样板"
						icon="icon-[ph--article-duotone]"
						onClick={() => mapsTo(ARTICLE_ROUTES.list)}
					/>
					<ActionTile
						layout="compact"
						theme="amber"
						title="意见反馈"
						subTitle="表单 + 进度样板"
						icon="icon-[ph--chat-circle-text-duotone]"
						onClick={() => mapsTo(FEEDBACK_ROUTES.form)}
					/>
				</View>
			</View>
		</Page>
	);
}
