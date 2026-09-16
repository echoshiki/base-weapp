import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import {
	Page,
	Card,
	CardImage,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	Heading,
	Alert,
	AlertTitle,
	AlertDescription,
	Badge,
	Avatar,
	AvatarBadge,
	Button,
	Carousel,
	CarouselContent,
	CarouselItem,
	Empty,
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
	SearchBar,
	Description,
	DescriptionList,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	ImageUploader,
	ImagePreview,
	NavItem,
	AspectRatio,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	SkeletonAvatar,
	SkeletonText,
	SkeletonCard,
	Signature,
} from '@/components/ui';
import { Input } from '@tarojs/components';

/**
 * 全局通用测试/Mock 数据集
 * 用于 UI 组件展示与用例演示
 */

export interface BannerMockItem {
	id: number;
	title: string;
	pic: string;
	url?: string;
}

export const MOCK_BANNERS: BannerMockItem[] = [
	{
		id: 1,
		title: '夏季限时特惠活动',
		pic: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
		url: '/pages/home/index',
	},
	{
		id: 2,
		title: '全新优质服务上线',
		pic: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80',
		url: '/pages/home/index',
	},
	{
		id: 3,
		title: '新手专属立减礼包',
		pic: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&auto=format&fit=crop&q=80',
		url: '/pages/home/index',
	},
];

export const MOCK_USER = {
	id: 'u_1001',
	name: '张三',
	avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
	role: 'VIP 高级会员',
	phone: '138****8888',
	status: 'online',
};

export const MOCK_TABS = [
	{ label: '全部动态', value: 'all' },
	{ label: '进行中', value: 'progress' },
	{ label: '已完成', value: 'completed' },
	{ label: '审核中', value: 'pending' },
];

export const MOCK_CARD_ITEM = {
	id: 101,
	title: '高级品牌奢品鉴定与评估服务',
	desc: '提供权威正品鉴定、市场行情预估及一站式上门估价服务。',
	tag: '热门推荐',
	time: '2026-07-29',
};

export default function Index() {
	const [activeTabSub, setActiveTabSub] = useState<string | number>('tab1');
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [userName, setUserName] = useState('');
	const [singleImage, setSingleImage] = useState<string[]>([
		'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80',
	]);
	const [multiImages, setMultiImages] = useState<string[]>([
		'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
		'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&auto=format&fit=crop&q=80',
	]);

	return (
		<Page>
			<View className="flex flex-col gap-2 py-2">
				<SearchBar
					variant="filled"
					action={
						<Button
							size="md"
							variant="primary"
							onClick={() => Taro.showToast({ title: `搜索: ${searchValue}`, icon: 'none' })}
						>
							搜索
						</Button>
					}
					value={searchValue}
					onInput={setSearchValue}
					placeholder="输入腕表/奢品名称搜索..."
				/>

				{/* 页面顶栏标题 */}
				<Card>
					<Heading
						title="UI 组件设计系统"
						subtitle="shadcn 风格极简现代规范"
						size="lg"
						extra="查看文档"
						onExtraClick={() => Taro.showToast({ title: '查看 README 文档', icon: 'none' })}
					/>
				</Card>

				{/* Avatar 头像组件展示 */}
				<Card className="flex flex-col gap-3">
					<Heading title="Avatar 头像族" size="sm" subtitle="尺寸预设 & 在线状态角标 (AvatarBadge)" />
					<View className="flex items-center gap-4">
						<View className="relative">
							<Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size="sm" />
						</View>
						<View className="relative">
							<Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size="md" />
							<AvatarBadge status="online" />
						</View>
						<View className="relative">
							<Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size="lg" />
							<AvatarBadge status="away" />
						</View>
						<View className="relative">
							<Avatar name="李四" size="lg" />
							<AvatarBadge status="busy" />
						</View>
					</View>
				</Card>

				{/* Badge 徽章/标签展示 */}

				<Card className="flex flex-col gap-3">
					<Heading title="Badge 徽章族" size="sm" subtitle="CVA 语义变体 & Dot 状态红点" />
					<View className="flex flex-wrap gap-2">
						<Badge variant="primary">Primary</Badge>
						<Badge variant="success" dot>
							已上线
						</Badge>
						<Badge variant="warning" dot>
							审核中
						</Badge>
						<Badge variant="destructive">已驳回</Badge>
						<Badge variant="info">VIP 特权</Badge>
						<Badge variant="outline">轮播标签</Badge>
						<Badge variant="secondary" pill>
							胶囊 Badge
						</Badge>
					</View>
				</Card>

				{/* Card 卡片族展示 */}
				<Card className="flex flex-col gap-3">
					<Heading title="Card 卡片族" size="sm" subtitle="纵向卡片、大图卡片 & 横向图文卡片" />

					{/* 纵向卡片 */}
					<Card clickable onClick={() => Taro.showToast({ title: '点击卡片', icon: 'none' })}>
						<CardHeader>
							<View className="flex items-center justify-between">
								<CardTitle>{MOCK_CARD_ITEM.title}</CardTitle>
								<Badge variant="primary">{MOCK_CARD_ITEM.tag}</Badge>
							</View>
							<CardDescription>发布时间：{MOCK_CARD_ITEM.time}</CardDescription>
						</CardHeader>
						<CardContent>
							<Text className="text-xs text-text-body leading-relaxed">{MOCK_CARD_ITEM.desc}</Text>
						</CardContent>
						<CardFooter>
							<Text className="text-xs text-text-muted">所属分类：奢侈品估价</Text>
							<Button size="xs">查看详情</Button>
						</CardFooter>
					</Card>

					{/* 纵向大图卡片 */}
					<Card
						noPadding
						clickable
						onClick={() => Taro.showToast({ title: '点击商品/大图卡片', icon: 'none' })}
					>
						<CardImage
							src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80"
							className="h-36"
						/>
						<View className="p-3.5 space-y-2">
							<View className="flex items-center justify-between">
								<CardTitle className="text-base">Rolex 劳力士切利尼经典腕表预估服务</CardTitle>
								<Badge variant="success">可上门</Badge>
							</View>
							<CardDescription className="line-clamp-2">
								专业奢品成色评估，包含机芯检测、原装配件核验与市场行情参考。
							</CardDescription>
							<CardFooter className="pt-2 mt-2">
								<Text className="text-xs text-text-muted">已有 128 人成功评估</Text>
								<Button size="xs" variant="primary">
									立即预约
								</Button>
							</CardFooter>
						</View>
					</Card>

					{/* 横向图文卡片 */}
					<Card
						layout="horizontal"
						clickable
						onClick={() => Taro.showToast({ title: '点击文章卡片', icon: 'none' })}
					>
						<CardImage src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80" />
						<CardContent>
							<View>
								<CardTitle className="line-clamp-1">最新便民社区服务与通知指南</CardTitle>
								<CardDescription className="line-clamp-2 mt-1">
									本周社区卫生中心开展免费健康体检与疫苗接种宣传活动...
								</CardDescription>
							</View>
							<CardFooter>
								<Badge size="xs" variant="secondary">
									便民信息
								</Badge>
								<Text className="text-xs text-text-muted">2026-07-29</Text>
							</CardFooter>
						</CardContent>
					</Card>
				</Card>

				{/* NavItem 导航族 */}
				<Card className="flex flex-col gap-3">
					<Heading title="NavItem 导航族 (Grid 宫格)" size="sm" subtitle="Grid 宫格导航模式 (4列网格)" />
					<View className="grid grid-cols-4 gap-4">
						<NavItem
							label="名表估价"
							icon="icon-[ph--clock-duotone]"
							variant="primary"
							onClick={() => Taro.showToast({ title: '名表估价', icon: 'none' })}
						/>
						<NavItem
							label="奢品鉴定"
							icon="icon-[ph--shield-check-duotone]"
							variant="success"
							onClick={() => Taro.showToast({ title: '奢品鉴定', icon: 'none' })}
						/>
						<NavItem
							label="上门核验"
							icon="icon-[ph--map-pin-line-duotone]"
							variant="warning"
							onClick={() => Taro.showToast({ title: '上门核验', icon: 'none' })}
						/>
						<NavItem
							label="更多服务"
							icon="icon-[ph--dots-three-circle-duotone]"
							variant="secondary"
							onClick={() => Taro.showToast({ title: '更多服务', icon: 'none' })}
						/>
					</View>
				</Card>

				<Card className="p-0 overflow-hidden flex flex-col">
					<View className="p-4 pb-0">
						<Heading title="NavItem 列表形态" size="sm" subtitle="支持 openType 微信客服与 extra 扩展" />
					</View>
					<View className="flex flex-col mt-2">
						<NavItem
							layout="list"
							icon="icon-[ph--gear-light]"
							label="账号设置"
							extra="账号与安全"
							onClick={() => Taro.showToast({ title: '账号设置', icon: 'none' })}
						/>
						<NavItem
							layout="list"
							icon="icon-[ph--headset-light]"
							label="在线官方客服"
							openType="contact"
							extra={
								<Badge size="xs" variant="success">
									在线
								</Badge>
							}
							border={false}
						/>
					</View>
				</Card>

				{/* Tabs 选项卡族 */}
				<Card className="p-0 overflow-hidden flex flex-col">
					<View className="p-4 pb-0">
						<Heading title="Tabs 选项卡族" size="sm" subtitle="基础视图与高级数据视图切换" />
					</View>
					<Tabs value={activeTabSub} onValueChange={setActiveTabSub}>
						<TabsList>
							<TabsTrigger value="tab1">基础视图</TabsTrigger>
							<TabsTrigger value="tab2">高级数据</TabsTrigger>
						</TabsList>
						<TabsContent value="tab1" className="p-3">
							<Text className="text-xs text-text-body">这是 Tab1 的复合内容视图。</Text>
						</TabsContent>
						<TabsContent value="tab2" className="p-3">
							<Text className="text-xs text-text-body">这是 Tab2 的高级数据视图。</Text>
						</TabsContent>
					</Tabs>
				</Card>

				{/* Carousel 轮播图族 */}
				<Card className="flex flex-col gap-3">
					<Heading title="Carousel 轮播图族" size="sm" subtitle="自动播放 & 无缝循环" />
					<Carousel>
						<CarouselContent heightClass="h-36" autoplay circular>
							{MOCK_BANNERS.map((banner) => (
								<CarouselItem key={banner.id}>
									<Image src={banner.pic} className="w-full h-full rounded-card" mode="aspectFill" />
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</Card>

				{/* AspectRatio 宽高比容器族 */}
				<Card className="flex flex-col gap-3">
					<Heading title="AspectRatio 宽高比容器" size="sm" subtitle="16:9 经典横屏、1:1 正方形与 4:3 布局" />
					<AspectRatio ratio={16 / 9} className="rounded-card bg-gray-100">
						<Image
							src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80"
							className="size-full rounded-card"
							mode="aspectFill"
						/>
					</AspectRatio>
					<View className="grid grid-cols-2 gap-3">
						<AspectRatio ratio={1 / 1} className="rounded-card bg-gray-100">
							<Image
								src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80"
								className="size-full rounded-card"
								mode="aspectFill"
							/>
						</AspectRatio>
						<AspectRatio ratio={4 / 3} className="rounded-card bg-gray-100">
							<Image
								src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&auto=format&fit=crop&q=80"
								className="size-full rounded-card"
								mode="aspectFill"
							/>
						</AspectRatio>
					</View>
				</Card>

				{/* Alert 提示框族 */}
				<Card className="flex flex-col gap-3">
					<Heading title="Alert 提示框族" size="sm" subtitle="基础提示文案与标题描述组合" />
					<Alert variant="info">请确保凭证边缘完整、公章清晰，格式支持 JPG、PNG</Alert>
					<Alert variant="warning">
						<AlertTitle>实名认证提示</AlertTitle>
						<AlertDescription>您提交的凭证将在 1-3 个工作日内完成审核，请耐心等待。</AlertDescription>
					</Alert>
				</Card>

				{/* Empty 空状态族 */}
				<Card className="flex flex-col gap-3">
					<Heading title="Empty 空状态族" size="sm" subtitle="暂无数据及引导操作" />
					<Empty
						title="暂无任何评估订单"
						subTitle="您可以提交需求开始第一次奢品估价体验"
						buttonText="立即申请评估"
						onButtonClick={() => Taro.showToast({ title: '点击申请', icon: 'none' })}
					/>
				</Card>

				{/* Dialog 居中模态框 & Drawer 抽屉族 */}
				<Card className="flex flex-col gap-3">
					<Heading title="Dialog 居中模态框 & Drawer 抽屉族" size="sm" subtitle="居中对话框与侧边/底部抽屉" />
					<View className="flex flex-wrap gap-2.5">
						<Button size="sm" variant="primary" onClick={() => setDialogOpen(true)}>
							打开 Dialog 居中对话框
						</Button>
						<Button size="sm" variant="outline" onClick={() => setDrawerOpen(true)}>
							打开右侧筛选抽屉
						</Button>
						<Button size="sm" variant="secondary" onClick={() => setBottomDrawerOpen(true)}>
							打开底部面板抽屉
						</Button>
					</View>
				</Card>

				{/* Skeleton 骨架屏预加载族 */}
				<Card className="flex flex-col gap-3">
					<Heading title="Skeleton 骨架屏预加载族" size="sm" subtitle="基础波浪骨架与全套卡片预加载骨架" />
					<View className="flex items-center gap-3">
						<SkeletonAvatar size="md" />
						<SkeletonText lines={2} className="flex-1" />
					</View>
					<SkeletonCard />
				</Card>

				{/* SearchBar 搜索栏族 */}
				<Card className="flex flex-col gap-3">
					<Heading title="SearchBar 搜索栏族" size="sm" subtitle="Filled 胶囊、Outline 线框与只读模式" />
					<SearchBar
						variant="filled"
						action={
							<Button
								size="md"
								variant="primary"
								onClick={() => Taro.showToast({ title: `搜索: ${searchValue}`, icon: 'none' })}
							>
								搜索
							</Button>
						}
						value={searchValue}
						onInput={setSearchValue}
						placeholder="输入腕表/奢品名称搜索..."
					/>
					<SearchBar variant="outline" placeholder="outline 线框风格..." />
					<SearchBar
						readonly
						placeholder="点击跳转到独立搜索页..."
						onClick={() => Taro.showToast({ title: '跳搜索页', icon: 'none' })}
					/>
				</Card>

				{/* DescriptionList 描述规格族 */}
				<Card className="flex flex-col gap-3">
					<Heading title="DescriptionList 描述规格族" size="sm" subtitle="左右键值对及分隔线展示" />
					<DescriptionList divider>
						<Description label="鉴定订单号" value="ORD-20260729-8890" variant="between" />
						<Description label="评估分类" value="腕表 / 劳力士" variant="between" />
						<Description
							label="服务方式"
							value={
								<Badge size="xs" variant="success">
									上门核验
								</Badge>
							}
							variant="between"
						/>
						<Description label="服务备注" value="客户要求在 18:00 前联系并确认上门地址。" variant="start" />
					</DescriptionList>
				</Card>

				{/* FormItem 表单校验族 */}
				<Card className="flex flex-col gap-3">
					<Heading title="FormItem 表单校验族" size="sm" subtitle="输入框表单项与校验错误提示" />
					<FormItem label="微信真实姓名" required helper="用于核对估价协议与转账卡号">
						<Input
							className="text-right text-sm text-text-title"
							placeholder="请输入真实姓名"
							value={userName}
							onInput={(e) => setUserName(e.detail.value)}
						/>
					</FormItem>

					<FormItem border={false} error={userName ? '' : '真实姓名不能为空，请如实填写'}>
						<FormLabel required>提现银行卡号</FormLabel>
						<FormControl>
							<Input className="text-sm" placeholder="请输入卡号" />
						</FormControl>
					</FormItem>
				</Card>

				{/* ImageUploader 图片上传与预览族 */}
				<Card className="flex flex-col gap-3">
					<Heading
						title="ImageUploader 图片上传与预览族"
						size="sm"
						subtitle="单图/多图上传模式与只读大图预览"
					/>
					<ImageUploader
						value={singleImage}
						onChange={setSingleImage}
						onUpload={async (paths) => paths}
						label="上传评估证明"
					/>
					<ImageUploader
						maxCount={4}
						value={multiImages}
						onChange={setMultiImages}
						onUpload={async (paths) => paths}
						label="添加凭证"
					/>
					<ImageUploader readonly value={multiImages} />
				</Card>

				{/* 居中对话框 Dialog */}
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>二次确认提示</DialogTitle>
							<DialogDescription>
								您确定要撤回提交的奢品真伪鉴定申请吗？此操作无法撤销。
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button size="xs" variant="outline" onClick={() => setDialogOpen(false)}>
								取消
							</Button>
							<Button
								size="xs"
								variant="destructive"
								onClick={() => {
									setDialogOpen(false);
									Taro.showToast({ title: '已成功撤回', icon: 'success' });
								}}
							>
								确认撤回
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* 侧边滑出抽屉 */}
				<Drawer open={drawerOpen} onOpenChange={setDrawerOpen} position="right">
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>高阶参数筛选</DrawerTitle>
							<DrawerDescription>按品牌、年份与估价区间条件过滤</DrawerDescription>
						</DrawerHeader>
						<View className="p-4 space-y-4">
							<Text className="text-xs text-text-muted block">成色要求</Text>
							<View className="flex flex-wrap gap-2">
								<Badge variant="primary">全新未拆</Badge>
								<Badge variant="secondary">95新微瑕</Badge>
								<Badge variant="secondary">90新正常使用</Badge>
							</View>
						</View>
						<DrawerFooter>
							<Button size="xs" variant="outline" onClick={() => setDrawerOpen(false)}>
								重置
							</Button>
							<Button size="xs" variant="primary" onClick={() => setDrawerOpen(false)}>
								应用筛选
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>

				{/* 手写签名画板 */}
				<Card>
					<Heading title="手写签名 (Signature)" subtitle="微信原生 Canvas 2D 笔迹绘制与透明 PNG 导出" />
					<Signature
						height={180}
						onConfirm={(tempFilePath) =>
							Taro.showModal({
								title: '签名导出成功',
								content: `临时文件路径:\n${tempFilePath}`,
								showCancel: false,
							})
						}
					/>
					<Button
						variant="outline"
						size="sm"
						className="mt-3 text-xs"
						onClick={() => Taro.navigateTo({ url: '/pages/pawn/sign/index' })}
					>
						体验完整合同签署流程页面 →
					</Button>
				</Card>

				{/* 底部滑出抽屉 */}
				<Drawer open={bottomDrawerOpen} onOpenChange={setBottomDrawerOpen} position="bottom">
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>快捷服务确认</DrawerTitle>
						</DrawerHeader>
						<View className="p-6 flex flex-col items-center gap-3">
							<Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size="lg" />
							<Text className="font-bold text-base">
								{MOCK_USER.name} ({MOCK_USER.role})
							</Text>
							<Text className="text-xs text-text-muted text-center">
								确认使用 138****8888 预约上门成色评估服务？
							</Text>
						</View>
						<DrawerFooter>
							<Button block variant="primary" onClick={() => setBottomDrawerOpen(false)}>
								确认预约
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</View>
		</Page>
	);
}
