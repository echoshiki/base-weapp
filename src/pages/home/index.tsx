import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Page, Card, Carousel, Badge, ActionTile, Icon } from '@/components/ui';
import { UserHeader } from '@/components/biz';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useHomeData } from '@/hooks/useResource';
import { useInfiniteAppealList, useInfiniteAppealTrackingList } from '@/hooks/useDemand';
import citySkylineImg from '@/assets/images/city-skyline.jpg';

export default function Home() {
	const { isLoggedIn, isAdmin, isEnterprise, navigateWithAuth } = useAuth();
	const { refetch } = useUser();
	const { data: homeData, refetch: refetchHomeData } = useHomeData();

	// 已登录时统一拉取诉求与跟踪统计数量
	const { data: appealCountPages, refetch: refetchAppealCount } = useInfiniteAppealList(undefined, 1, isLoggedIn);
	const { data: trackingCountPages, refetch: refetchTrackingCount } = useInfiniteAppealTrackingList(
		undefined,
		undefined,
		1,
		isLoggedIn,
	);
	const appealTotal = appealCountPages?.pages?.[0]?.total ?? 0;
	const trackingTotal = trackingCountPages?.pages?.[0]?.total ?? 0;

	useDidShow(() => {
		refetchHomeData().catch((err) => console.error('首页数据拉取失败:', err));
		if (isLoggedIn) {
			refetch().catch((err) => console.error('首页同步用户信息失败:', err));
			refetchAppealCount().catch((err) => console.error('首页诉求统计拉取失败:', err));
			refetchTrackingCount().catch((err) => console.error('首页跟踪统计拉取失败:', err));
		}
	});

	const carouselList = (homeData?.photos || []).map((pic, index) => ({
		id: index,
		pic,
	}));

	return (
		<Page paddingX={false} showQuickMenu={false} className="h-screen overflow-hidden">
			{/* 底部楼宇天际线素描插画 */}
			<View className="fixed -bottom-15 left-0 right-0 z-0 pointer-events-none select-none overflow-hidden">
				<Image src={citySkylineImg} mode="widthFix" className="w-full block opacity-40 mix-blend-multiply" />
				<View className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-main-bg via-main-bg/50 to-transparent" />
			</View>

			{/* 顶部用户信息栏 */}
			<UserHeader variant="hero" />

			{/* 主体工作台区域 */}
			<View className="relative z-10 flex-1 -mt-24 px-3 pb-4">
				<View className="flex flex-col gap-3">
					{/* 首页轮播图 */}
					{carouselList.length > 0 && (
						<View className="rounded overflow-hidden shadow-sm">
							<Carousel
								list={carouselList}
								isFull
								heightClass="h-44"
								onItemClick={(item) => {
									Taro.previewImage({
										current: item.pic,
										urls: carouselList.map((c) => c.pic),
									});
								}}
							/>
						</View>
					)}

					{/* 核心业务 Bento 磁贴区：企业端左侧「创建诉求」，管理员/未登录左侧「企业信息」 */}
					<View className="flex items-stretch gap-2.5 h-40">
						{isEnterprise ? (
							<ActionTile
								layout="square"
								theme="blue"
								title="创建诉求"
								subTitle="提报企业诉求、意见反馈"
								icon="icon-[ph--plus-bold]"
								onClick={() => navigateWithAuth('/pages/appeal/form/index')}
							/>
						) : (
							<ActionTile
								layout="square"
								theme="blue"
								title="企业信息"
								subTitle="辖区企业档案与基础台账"
								icon="icon-[ph--magnifying-glass-duotone]"
								onClick={() => navigateWithAuth('/pages/enterprise/index')}
							/>
						)}

						<View className="flex-1 flex flex-col gap-2.5">
							<ActionTile
								layout="compact"
								theme="orange"
								tone="dark"
								title={isEnterprise ? '我的诉求' : '企业诉求'}
								value={isLoggedIn ? appealTotal : undefined}
								unit="条"
								subTitle="诉求查看与协同办理"
								icon="icon-[ph--chat-circle-dots-duotone]"
								onClick={() => navigateWithAuth('/pages/appeal/index')}
							/>

							<ActionTile
								layout="compact"
								theme="blue"
								tone="dark"
								title="诉求跟踪"
								value={isLoggedIn ? trackingTotal : undefined}
								unit="条"
								subTitle="办理节点实时追踪"
								icon="icon-[ph--path-duotone]"
								onClick={() => navigateWithAuth('/pages/tracking/index')}
							/>
						</View>
					</View>

					{/* 其余服务：链资源宽卡 + 政策文件/知识科普并排 */}
					<View className="flex flex-col gap-2.5">
						<Card
							clickable
							onClick={() => navigateWithAuth('/pages/resource/index')}
							className="flex-row items-center justify-between gap-3 cursor-pointer"
						>
							<View className="flex items-center gap-3 min-w-0 flex-1">
								<Icon icon="icon-[ph--link-duotone]" shape="square" size={50} theme="blue" />

								<View className="flex flex-col gap-0.5 min-w-0">
									<Text className="text-sm font-bold text-slate-800">链资源</Text>
									<Text className="text-xs text-slate-400 truncate">产业链上下游供需对接</Text>
								</View>
							</View>
							<View className="flex items-center gap-1.5 shrink-0">
								<Badge variant="blue" pill>
									{isAdmin ? '资源管理' : '详细查看'}
								</Badge>
								<View className="icon-[ph--caret-right-bold] size-3.5 text-slate-300" />
							</View>
						</Card>

						<View className="flex items-stretch gap-2.5 h-20">
							<ActionTile
								layout="compact"
								theme="rose"
								tone="dark"
								title="政策文件"
								subTitle="惠企政策汇编"
								icon="icon-[ph--file-text-duotone]"
								onClick={() => navigateWithAuth('/pages/policy/index')}
							/>
							<ActionTile
								layout="compact"
								theme="emerald"
								tone="dark"
								title="知识科普"
								subTitle="行业安全指南"
								icon="icon-[ph--book-open-text-duotone]"
								onClick={() => navigateWithAuth('/pages/knowledge/index')}
							/>
						</View>
					</View>
				</View>
			</View>
		</Page>
	);
}
