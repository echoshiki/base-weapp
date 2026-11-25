import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import {
	Card,
	Alert,
	Badge,
	Avatar,
	Button,
	Carousel,
	Empty,
	Tabs,
	Drawer,
	SearchBar,
	Description,
	DescriptionList,
	FormItem,
	Input,
	Textarea,
	ImageUploader,
	NavItem,
	AspectRatio,
	Dialog,
	Skeleton,
	Signature,
	Heading,
	Asset,
	Divider,
	Icon,
	Gender,
	ImagePreview,
	ActionTile,
	EntryCard,
	NavBar,
	FloatCustomerService,
	Loading,
	Feedback,
	FeedbackVariant,
	AuthMask,
	Select,
	RegionChangeResult,
	FileUploader,
	UploadedFile,
	Rate,
	FloatQuickMenu,
} from '@/components/ui';
import { MOCK_BANNERS, MOCK_USER, MOCK_CARD_ITEM } from './mock';

export function AvatarDemo() {
	return (
		<View className="flex items-center gap-4">
			<Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size="xs" />
			<Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size="sm" />
			<Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size="md" />
			<Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size="lg" />
			<Avatar name="李四" size="lg" />
		</View>
	);
}

export function BadgeDemo() {
	return (
		<View className="flex flex-wrap gap-2">
			<Badge variant="primary">Primary</Badge>
			<Badge variant="emerald" dot>
				已上线
			</Badge>
			<Badge variant="amber" dot>
				审核中
			</Badge>
			<Badge variant="rose">已驳回</Badge>
			<Badge variant="blue">VIP 特权</Badge>
			<Badge variant="zinc" pill>
				胶囊 Badge
			</Badge>
		</View>
	);
}

export function CardDemo() {
	return (
		<View className="flex flex-col gap-3">
			{/* 纵向卡片 */}
			<Card className="gap-4" onClick={() => Taro.showToast({ title: '点击卡片', icon: 'none' })}>
				<View className="flex flex-col gap-2 border-b pb-4 border-zinc-200">
					<Text className="font-medium leading-tight">{MOCK_CARD_ITEM.title}</Text>
					<Text className="text-xs opacity-60">发布时间：{MOCK_CARD_ITEM.time}</Text>
				</View>
				<Text className="text-xs opacity-60 leading-relaxed line-clamp-2">{MOCK_CARD_ITEM.desc}</Text>
				<View className="flex items-center justify-between ">
					<View className="flex items-center gap-1">
						<Badge variant="primary">{MOCK_CARD_ITEM.tag}</Badge>
						<Badge variant="zinc">奢侈品估价</Badge>
					</View>
					<Button size="xs" rounded={false}>
						查看详情
					</Button>
				</View>
			</Card>

			{/* 纵向大图卡片 */}
			<Card noPadding onClick={() => Taro.showToast({ title: '点击商品/大图卡片', icon: 'none' })}>
				<Image
					src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80"
					mode="aspectFill"
					className="w-full h-36"
				/>
				<View className="px-4 py-4 flex flex-col gap-2">
					<View className="flex items-center justify-between gap-2">
						<Text className="font-medium leading-tight truncate">Rolex 劳力士切利尼经典腕表预估服务</Text>
					</View>
					<Text className="text-xs opacity-60 leading-relaxed line-clamp-2">{MOCK_CARD_ITEM.desc}</Text>
					<View className="flex items-center justify-between pt-2 border-t border-zinc-200">
						<View className="flex gap-1 items-center">
							<Badge variant="emerald">可上门</Badge>
							<Text className="text-xs opacity-60">已有 128 人成功评估</Text>
						</View>
						<Button size="xs" variant="primary">
							立即预约
						</Button>
					</View>
				</View>
			</Card>

			{/* 横向图文卡片 */}
			<Card layout="horizontal" onClick={() => Taro.showToast({ title: '点击文章卡片', icon: 'none' })}>
				<Image
					src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80"
					mode="aspectFill"
					className="w-24 h-20 rounded shrink-0"
				/>
				<View className="flex-1 min-w-0 flex flex-col justify-between">
					<Text className="font-medium text-sm line-clamp-2">最新便民社区服务与通知指南</Text>
					<View className="flex items-center justify-between">
						<Badge variant="zinc">便民信息</Badge>
						<Text className="text-xs opacity-60">2026-07-29</Text>
					</View>
				</View>
			</Card>
		</View>
	);
}

export function DescriptionDemo() {
	return (
		<DescriptionList divider>
			<Description label="鉴定订单号" value="ORD-20260729-8890" variant="between" />
			<Description label="评估分类" value="腕表 / 劳力士" variant="between" />
			<Description label="服务方式" value={<Badge variant="emerald">上门核验</Badge>} variant="between" />
			<Description label="服务备注" value="客户要求在 18:00 前联系并确认上门地址。" variant="start" />
		</DescriptionList>
	);
}

export function SkeletonDemo() {
	return (
		<View className="flex flex-col gap-3">
			<View className="flex items-center gap-3">
				<Skeleton className="size-10 rounded-full" />
				<View className="flex-1 flex flex-col gap-2">
					<Skeleton className="h-3.5 w-full" />
					<Skeleton className="h-3.5 w-3/5" />
				</View>
			</View>
			<Card className="gap-3">
				<Skeleton className="h-28 w-full rounded-card" />
				<Skeleton className="h-4 w-2/3" />
				<Skeleton className="h-3 w-1/2" />
			</Card>
		</View>
	);
}

export function AspectRatioDemo() {
	return (
		<View className="flex flex-col gap-3">
			<AspectRatio ratio={16 / 9} className="rounded-card bg-zinc-100">
				<Image
					src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80"
					className="size-full rounded-card"
					mode="aspectFill"
				/>
			</AspectRatio>
			<View className="grid grid-cols-2 gap-3">
				<AspectRatio ratio={1 / 1} className="rounded-card bg-zinc-100">
					<Image
						src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80"
						className="size-full rounded-card"
						mode="aspectFill"
					/>
				</AspectRatio>
				<AspectRatio ratio={4 / 3} className="rounded-card bg-zinc-100">
					<Image
						src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&auto=format&fit=crop&q=80"
						className="size-full rounded-card"
						mode="aspectFill"
					/>
				</AspectRatio>
			</View>
		</View>
	);
}

export function CarouselDemo() {
	return (
		<Carousel
			list={MOCK_BANNERS}
			heightClass="h-36"
			onItemClick={(item) => Taro.showToast({ title: item.title, icon: 'none' })}
		/>
	);
}

export function NavItemDemo() {
	return (
		<View className="flex flex-col gap-4">
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
					variant="emerald"
					onClick={() => Taro.showToast({ title: '奢品鉴定', icon: 'none' })}
				/>
				<NavItem
					label="上门核验"
					icon="icon-[ph--map-pin-line-duotone]"
					variant="amber"
					onClick={() => Taro.showToast({ title: '上门核验', icon: 'none' })}
				/>
				<NavItem
					label="更多服务"
					icon="icon-[ph--dots-three-circle-duotone]"
					variant="zinc"
					onClick={() => Taro.showToast({ title: '更多服务', icon: 'none' })}
				/>
			</View>

			<View className="bg-white rounded-card overflow-hidden border border-zinc-100/80">
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
					extra={<Badge variant="emerald">在线</Badge>}
					border={false}
				/>
			</View>
		</View>
	);
}

export function TabsDemo() {
	const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1');

	return (
		<View className="bg-white rounded-card overflow-hidden border border-zinc-100/80">
			<Tabs
				tabs={[
					{ label: '基础视图', value: 'tab1' },
					{ label: '高级数据', value: 'tab2' },
				]}
				value={activeTab}
				onChange={setActiveTab}
			/>
			<View className="p-3">
				<Text className="text-xs">
					{activeTab === 'tab1' ? '这是 Tab1 的内容视图。' : '这是 Tab2 的高级数据视图。'}
				</Text>
			</View>
		</View>
	);
}

export function SearchBarDemo() {
	const [searchValue, setSearchValue] = useState('');

	return (
		<View className="flex flex-col gap-3">
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
		</View>
	);
}

export function AlertDemo() {
	return (
		<View className="flex flex-col gap-3">
			<Alert variant="info">请确保凭证边缘完整、公章清晰，格式支持 JPG、PNG</Alert>
			<Alert
				variant="warning"
				title="实名认证提示"
				extra={
					<Button
						size="xs"
						variant="amber"
						appearance="soft"
						onClick={() => Taro.showToast({ title: '去认证', icon: 'none' })}
					>
						去认证
					</Button>
				}
			>
				您提交的凭证将在 1-3 个工作日内完成审核，请耐心等待。
			</Alert>
		</View>
	);
}

export function EmptyDemo() {
	return (
		<Empty
			title="暂无任何评估订单"
			subTitle="您可以提交需求开始第一次奢品估价体验"
			buttonText="立即申请评估"
			onButtonClick={() => Taro.showToast({ title: '点击申请', icon: 'none' })}
		/>
	);
}

export function DialogDemo() {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<View>
			<Button size="sm" variant="primary" onClick={() => setDialogOpen(true)}>
				打开 Dialog 居中对话框
			</Button>

			<Dialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				title="二次确认提示"
				description="您确定要撤回提交的奢品真伪鉴定申请吗？此操作无法撤销。"
				footer={
					<>
						<Button size="xs" appearance="outline" onClick={() => setDialogOpen(false)}>
							取消
						</Button>
						<Button
							size="xs"
							variant="rose"
							onClick={() => {
								setDialogOpen(false);
								Taro.showToast({ title: '已成功撤回', icon: 'success' });
							}}
						>
							确认撤回
						</Button>
					</>
				}
			/>
		</View>
	);
}

export function DrawerDemo() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);

	return (
		<View>
			<View className="flex flex-wrap gap-2.5">
				<Button size="sm" appearance="outline" onClick={() => setDrawerOpen(true)}>
					打开右侧筛选抽屉
				</Button>
				<Button size="sm" variant="zinc" onClick={() => setBottomDrawerOpen(true)}>
					打开底部面板抽屉
				</Button>
			</View>

			{/* 侧边滑出抽屉 */}
			<Drawer
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				position="right"
				title="高阶参数筛选"
				description="按品牌、年份与估价区间条件过滤"
				footer={
					<>
						<Button size="xs" appearance="outline" onClick={() => setDrawerOpen(false)}>
							重置
						</Button>
						<Button size="xs" variant="primary" onClick={() => setDrawerOpen(false)}>
							应用筛选
						</Button>
					</>
				}
			>
				<View>
					<Text className="text-xs opacity-60 block">成色要求</Text>
					<View className="flex flex-wrap gap-2 mt-2">
						<Badge variant="primary">全新未拆</Badge>
						<Badge variant="zinc">95新微瑕</Badge>
						<Badge variant="zinc">90新正常使用</Badge>
					</View>
				</View>
			</Drawer>

			{/* 底部滑出抽屉 */}
			<Drawer
				open={bottomDrawerOpen}
				onOpenChange={setBottomDrawerOpen}
				position="bottom"
				title="快捷服务确认"
				footer={
					<Button block variant="primary" onClick={() => setBottomDrawerOpen(false)}>
						确认预约
					</Button>
				}
			>
				<View className="flex flex-col items-center gap-3">
					<Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size="lg" />
					<Text className="font-bold text-base">
						{MOCK_USER.name} ({MOCK_USER.role})
					</Text>
					<Text className="text-xs opacity-60 text-center">确认使用 138****8888 预约上门成色评估服务？</Text>
				</View>
			</Drawer>
		</View>
	);
}

export function FormItemDemo() {
	const [userName, setUserName] = useState('');
	const [bankCard, setBankCard] = useState('');
	const [remark, setRemark] = useState('');

	return (
		<View className="flex flex-col gap-3 bg-white rounded-card px-4 py-2 border border-zinc-100">
			{/* row 模式：默认带底部分隔线，搭配 ghost Input */}
			<FormItem label="微信真实姓名" required helper="用于核对估价协议与转账卡号">
				<Input
					variant="ghost"
					inputClassName="text-right"
					placeholder="请输入真实姓名"
					value={userName}
					onChange={setUserName}
				/>
			</FormItem>

			{/* column 模式：默认无底部分隔线，搭配 filled Input + 错误提示 */}
			<FormItem
				layout="column"
				label="提现银行卡号"
				required
				error={bankCard ? '' : '银行卡号不能为空，请如实填写'}
			>
				<Input
					variant="filled"
					placeholder="请输入卡号"
					value={bankCard}
					onChange={setBankCard}
					clearable
					error={!bankCard}
				/>
			</FormItem>

			{/* column 模式搭配 Textarea */}
			<FormItem layout="column" label="备注说明" helper="选填，最多 100 字">
				<Textarea
					variant="filled"
					placeholder="请输入补充说明..."
					value={remark}
					onChange={setRemark}
					maxlength={100}
					showCount
				/>
			</FormItem>
		</View>
	);
}

export function InputDemo() {
	const [account, setAccount] = useState('');
	const [phone, setPhone] = useState('13800138000');
	const [amount, setAmount] = useState('');

	return (
		<View className="flex flex-col gap-3">
			<Input
				variant="filled"
				prefix="icon-[ph--user]"
				placeholder="filled 淡灰框（带前缀与清空）"
				value={account}
				onChange={setAccount}
				clearable
			/>
			<Input
				variant="underline"
				prefix="icon-[ph--device-mobile]"
				placeholder="underline 下划线风格"
				value={phone}
				onChange={setPhone}
				clearable
			/>
			<Input
				variant="filled"
				type="digit"
				placeholder="带右侧后缀单位"
				value={amount}
				onChange={setAmount}
				suffix={<Text className="text-xs text-zinc-500">万元</Text>}
			/>
			<Input variant="filled" error placeholder="校验错误状态 (error)" />
			<Input variant="filled" disabled value="禁用状态不可编辑" />
		</View>
	);
}

export function TextareaDemo() {
	const [filledVal, setFilledVal] = useState('');
	const [outlinedVal, setOutlinedVal] = useState('');

	return (
		<View className="flex flex-col gap-3">
			<Textarea
				variant="filled"
				placeholder="filled 淡灰底多行文本域（带字数统计）..."
				value={filledVal}
				onChange={setFilledVal}
				maxlength={200}
				showCount
			/>
			<Textarea
				variant="outlined"
				placeholder="outlined 白底描边风格..."
				value={outlinedVal}
				onChange={setOutlinedVal}
				textareaClassName="h-20"
			/>
			<Textarea variant="filled" error placeholder="校验错误状态 (error)" textareaClassName="h-16" />
		</View>
	);
}

export function ImageUploaderDemo() {
	const [singleImage, setSingleImage] = useState<string[]>([
		'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80',
	]);
	const [multiImages, setMultiImages] = useState<string[]>([
		'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
		'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&auto=format&fit=crop&q=80',
	]);

	return (
		<View className="flex flex-col gap-3">
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
		</View>
	);
}

export function SignatureDemo() {
	return (
		<View className="flex flex-col">
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
				appearance="outline"
				size="sm"
				className="mt-3 text-xs"
				onClick={() => Taro.navigateTo({ url: '/pages/pawn/sign/index' })}
			>
				体验完整合同签署流程页面 →
			</Button>
		</View>
	);
}

export function HeadingDemo() {
	return (
		<View className="flex flex-col gap-4">
			<Heading
				title="今日活动"
				subtitle="精选 3 场线下沙龙"
				size="lg"
				icon="icon-[ph--sparkle-duotone]"
				extra="查看全部"
				onExtraClick={() => Taro.showToast({ title: '点击查看全部', icon: 'none' })}
			/>
			<Heading
				title="最新通知"
				size="md"
				className="border-l-10 border-primary pl-3 mt-3"
				extra={<Badge variant="primary">3条未读</Badge>}
			/>
			<Heading title="小号标题" subtitle="辅助说明文案" size="sm" />
		</View>
	);
}

export function AssetDemo() {
	return (
		<View className="flex items-center bg-white rounded-card py-3 border border-zinc-100">
			<Asset label="已发布" value={12} onClick={() => Taro.showToast({ title: '已发布: 12', icon: 'none' })} />
			<Divider orientation="vertical" />
			<Asset label="进行中" value={3} valueColor="text-emerald-500" />
			<Divider orientation="vertical" />
			<Asset label="待审核" value={1} valueColor="text-amber-500" />
		</View>
	);
}

export function DividerDemo() {
	return (
		<View className="flex flex-col gap-2">
			<Divider />
			<Divider dashed />
			<Divider>中间嵌入文字</Divider>
			<View className="flex items-center justify-center text-xs py-1">
				<Text>左侧项</Text>
				<Divider orientation="vertical" />
				<Text>中间项</Text>
				<Divider orientation="vertical" dashed />
				<Text>右侧项</Text>
			</View>
		</View>
	);
}

export function IconDemo() {
	return (
		<View className="flex flex-col gap-3">
			<View className="flex items-center gap-4">
				<Icon icon="icon-[ph--house-duotone]" size="sm" theme="primary" />
				<Icon icon="icon-[ph--gear-duotone]" size="md" theme="emerald" />
				<Icon icon="icon-[ph--star-duotone]" size="lg" theme="amber" />
				<Icon icon="icon-[ph--heart-duotone]" size={26} theme="rose" />
			</View>
			<View className="flex items-center gap-3">
				<Icon icon="icon-[ph--shield-check-duotone]" shape="square" size="sm" theme="blue" />
				<Icon icon="icon-[ph--lightning-duotone]" shape="square" size="md" theme="indigo" />
				<Icon icon="icon-[ph--compass-duotone]" shape="circle" size="md" theme="zinc" />
				<Icon icon="icon-[ph--crown-duotone]" shape="circle" size="lg" theme="orange" />
			</View>
		</View>
	);
}

export function GenderDemo() {
	return (
		<View className="flex items-center gap-4">
			<View className="flex items-center gap-1.5">
				<Gender gender="0" size="xs" />
				<Text className="text-xs opacity-60">男 (xs)</Text>
			</View>
			<View className="flex items-center gap-1.5">
				<Gender gender="1" size="sm" />
				<Text className="text-xs opacity-60">女 (sm)</Text>
			</View>
			<View className="flex items-center gap-1.5">
				<Gender gender="0" size="md" />
				<Text className="text-xs opacity-60">男 (md)</Text>
			</View>
		</View>
	);
}

export function PageDemo() {
	return (
		<View className="flex flex-col gap-2">
			<Text className="text-xs opacity-60 leading-relaxed">
				当前示例页即由 &lt;Page&gt; 包裹，自动提供全站背景色、左右边距 (container-x)、页面级
				Loading、底部安全区留白与悬浮快捷菜单。
			</Text>
		</View>
	);
}

export function ImagePreviewDemo() {
	const [open, setOpen] = useState(false);
	const urls = MOCK_BANNERS.map((b) => b.pic);

	return (
		<View className="flex flex-wrap gap-2.5">
			<Button size="sm" variant="primary" onClick={() => setOpen(true)}>
				打开自定义预览弹窗
			</Button>
			<Button
				size="sm"
				variant="zinc"
				appearance="outline"
				onClick={() => ImagePreview.show({ urls, current: 0 })}
			>
				调用原生 previewImage
			</Button>
			<ImagePreview open={open} urls={urls} current={0} onClose={() => setOpen(false)} />
		</View>
	);
}

export function ButtonDemo() {
	const [loading, setLoading] = useState(false);

	return (
		<View className="flex flex-col gap-3">
			<View className="flex flex-wrap items-center gap-2">
				<Button size="xs" variant="primary">
					xs 按钮
				</Button>
				<Button size="sm" variant="emerald">
					sm 按钮
				</Button>
				<Button size="md" variant="amber">
					md 按钮
				</Button>
			</View>
			<View className="flex flex-wrap items-center gap-2">
				<Button size="sm" appearance="solid" variant="primary">
					Solid
				</Button>
				<Button size="sm" appearance="soft" variant="primary">
					Soft
				</Button>
				<Button size="sm" appearance="outline" variant="primary">
					Outline
				</Button>
				<Button size="sm" appearance="ghost" variant="zinc">
					Ghost
				</Button>
			</View>
			<View className="flex flex-wrap items-center gap-2">
				<Button
					size="sm"
					icon="icon-[ph--paper-plane-tilt-bold]"
					loading={loading}
					onClick={() => {
						setLoading(true);
						setTimeout(() => setLoading(false), 1200);
					}}
				>
					{loading ? '提交中...' : '点击测试 Loading'}
				</Button>
				<Button size="sm" disabled>
					禁用状态
				</Button>
			</View>
		</View>
	);
}

export function ActionTileDemo() {
	return (
		<View className="flex flex-col gap-3">
			<View className="grid grid-cols-2 gap-3 h-32">
				<ActionTile
					layout="square"
					tone="dark"
					theme="primary"
					title="政策申报"
					subTitle="在线快速填报"
					icon="icon-[ph--file-text-duotone]"
					onClick={() => Taro.showToast({ title: '点击政策申报', icon: 'none' })}
				/>
				<ActionTile
					layout="square"
					tone="light"
					theme="emerald"
					title="服务大厅"
					subTitle="一站式办理"
					icon="icon-[ph--buildings-duotone]"
					onClick={() => Taro.showToast({ title: '点击服务大厅', icon: 'none' })}
				/>
			</View>
			<View className="grid grid-cols-2 gap-3">
				<ActionTile
					layout="compact"
					theme="amber"
					title="待处理事项"
					value={8}
					unit="条"
					icon="icon-[ph--bell-ringing-duotone]"
				/>
				<ActionTile
					layout="compact"
					theme="zinc"
					title="历史记录"
					subTitle="查看全部归档"
					icon="icon-[ph--archive-duotone]"
				/>
			</View>
		</View>
	);
}

export function EntryCardDemo() {
	return (
		<View className="flex flex-col gap-3">
			<EntryCard
				title="企业入驻认证"
				desc="完成实名与企业资质核验，解锁专属服务"
				icon="icon-[ph--buildings-duotone]"
				theme="blue"
				onClick={() => Taro.showToast({ title: '点击企业入驻', icon: 'none' })}
			/>
			<EntryCard
				title="个人中心通道"
				desc="审核中状态（当前已禁用点击）"
				icon="icon-[ph--user-focus-duotone]"
				theme="zinc"
				disabled
			/>
		</View>
	);
}

export function NavBarDemo() {
	return (
		<View className="flex flex-col gap-3">
			<View className="rounded-card overflow-hidden border border-zinc-200/80 bg-white">
				<NavBar title="浅色导航栏 (dark 文字)" theme="dark" transparent={false} fixed={false} />
			</View>
			<View className="rounded-card overflow-hidden bg-primary">
				<NavBar
					title="深色导航栏 (light 白字)"
					theme="light"
					transparent={false}
					fixed={false}
					activeBgClass="bg-primary"
				/>
			</View>
		</View>
	);
}

export function FloatWidgetsDemo() {
	const [showMenu, setShowMenu] = useState(false);
	const [showService, setShowService] = useState(false);

	return (
		<View className="flex gap-2.5">
			<Button size="sm" variant={showService ? 'rose' : 'primary'} onClick={() => setShowService((v) => !v)}>
				{showService ? '隐藏客服悬浮球' : '显示客服悬浮球'}
			</Button>
			<Button size="sm" variant={showMenu ? 'rose' : 'primary'} onClick={() => setShowMenu((v) => !v)}>
				{showMenu ? '隐藏快捷菜单' : '显示快捷菜单'}
			</Button>
			{showService && <FloatCustomerService bottomOffset={120} />}
			{showMenu && <FloatQuickMenu bottomOffset={120} />}
		</View>
	);
}

export function LoadingDemo() {
	return (
		<View className="flex items-center justify-around py-4 bg-white rounded-card border border-zinc-100">
			<Loading />
			<Loading title="数据加载中..." />
		</View>
	);
}

export function FeedbackDemo() {
	const [variant, setVariant] = useState<FeedbackVariant>('success');
	const variants: FeedbackVariant[] = ['success', 'error', 'warning', 'info', 'loading'];

	return (
		<View className="flex flex-col gap-3">
			<View className="flex flex-wrap gap-1.5">
				{variants.map((v) => (
					<Button
						key={v}
						size="xs"
						variant={variant === v ? 'primary' : 'zinc'}
						appearance={variant === v ? 'solid' : 'outline'}
						onClick={() => setVariant(v)}
					>
						{v}
					</Button>
				))}
			</View>
			<View className="bg-white rounded-card p-4 border border-zinc-100">
				<Feedback
					variant={variant}
					title={variant === 'loading' ? '正在处理...' : `状态：${variant}`}
					subtitle="这是一段落地结果反馈页的描述文案"
					extra={
						variant !== 'loading' && (
							<Button size="sm" block onClick={() => Taro.showToast({ title: '点击返回', icon: 'none' })}>
								返回列表
							</Button>
						)
					}
				/>
			</View>
		</View>
	);
}

export function AuthMaskDemo() {
	const [locked, setLocked] = useState(true);

	return (
		<View className="flex flex-col gap-3">
			<View className="flex justify-end">
				<Button size="xs" appearance="outline" onClick={() => setLocked((v) => !v)}>
					{locked ? '模拟已登录（解锁）' : '模拟未登录（锁定）'}
				</Button>
			</View>
			<AuthMask
				locked={locked}
				title="登录后查看核心数据"
				subTitle="完成身份认证即可解锁完整列表"
				onLoginClick={() => setLocked(false)}
			>
				<Card className="h-36">
					<Text className="font-medium text-sm">机密业务报告</Text>
					<Text className="text-xs opacity-60 mt-1 leading-relaxed">
						当前已完成身份验证，您正在查看受保护的完整内容。
					</Text>
				</Card>
			</AuthMask>
		</View>
	);
}

export function SelectDemo() {
	const [industry, setIndustry] = useState<string | number | null>(null);
	const [dateVal, setDateVal] = useState('');
	const [timeVal, setTimeVal] = useState('');
	const [regionVal, setRegionVal] = useState<string[]>([]);

	const options = [
		{ label: '智能制造', value: 'mfg' },
		{ label: '数字经济', value: 'digital' },
		{ label: '生物医药', value: 'bio' },
	];

	return (
		<View className="flex flex-col gap-3">
			<Select
				mode="selector"
				options={options}
				value={industry}
				placeholder="请选择所属行业 (outlined)"
				icon="icon-[ph--briefcase]"
				onChange={(val) => setIndustry(val)}
			/>
			<Select
				mode="date"
				variant="underline"
				value={dateVal}
				placeholder="请选择成立日期 (underline)"
				icon="icon-[ph--calendar]"
				onChange={setDateVal}
			/>
			<Select
				mode="time"
				value={timeVal}
				placeholder="请选择预约时间"
				icon="icon-[ph--clock]"
				onChange={setTimeVal}
			/>
			<Select
				mode="region"
				value={regionVal}
				placeholder="请选择省市区"
				icon="icon-[ph--map-pin]"
				onChange={(res: RegionChangeResult) => setRegionVal(res.rawNames || [])}
			/>
		</View>
	);
}

export function FileUploaderDemo() {
	const [file, setFile] = useState<UploadedFile | null>({
		filePath: 'https://example.com/demo.pdf',
		fileName: '企业资质申报材料.pdf',
		fileType: 'pdf',
		fileSize: 245760,
	});

	return (
		<View className="flex flex-col gap-3">
			<FileUploader
				value={file}
				onChange={setFile}
				onUpload={async (paths) => paths}
				label="选择聊天记录中的文件"
				subLabel="支持 PDF、Word 等格式文档"
			/>
		</View>
	);
}

export function RateDemo() {
	const [score, setScore] = useState(4);

	return (
		<View className="flex flex-col gap-3 bg-white rounded-card p-4 border border-zinc-100">
			<Rate label="服务评价" value={score} onChange={setScore} size={5} />
			<Rate label="综合评分" value={5} readonly size={5} />
		</View>
	);
}
