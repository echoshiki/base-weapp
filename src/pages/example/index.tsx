import { View, Text } from '@tarojs/components';
import { ReactNode, useState } from 'react';
import { Page, Card, Heading } from '@/components/ui';
import { cn } from '@/utils/common';
import {
	AvatarDemo,
	BadgeDemo,
	CardDemo,
	DescriptionDemo,
	SkeletonDemo,
	AspectRatioDemo,
	CarouselDemo,
	NavItemDemo,
	TabsDemo,
	SearchBarDemo,
	AlertDemo,
	EmptyDemo,
	DialogDemo,
	DrawerDemo,
	FormItemDemo,
	InputDemo,
	TextareaDemo,
	ImageUploaderDemo,
	SignatureDemo,
	HeadingDemo,
	AssetDemo,
	DividerDemo,
	IconDemo,
	GenderDemo,
	PageDemo,
	ImagePreviewDemo,
	ButtonDemo,
	ActionTileDemo,
	EntryCardDemo,
	NavBarDemo,
	FloatWidgetsDemo,
	LoadingDemo,
	FeedbackDemo,
	AuthMaskDemo,
	SelectDemo,
	FileUploaderDemo,
	RateDemo,
} from './demos';

interface ExampleItem {
	key: string;
	name: string;
	desc: string;
	render: () => ReactNode;
}

interface ExampleGroup {
	title: string;
	items: ExampleItem[];
}

const EXAMPLE_GROUPS: ExampleGroup[] = [
	{
		title: '基础展示',
		items: [
			{
				key: 'avatar',
				name: 'Avatar 头像',
				desc: '五档尺寸预设与首字母彩底自动兜底',
				render: () => <AvatarDemo />,
			},
			{
				key: 'badge',
				name: 'Badge 徽章',
				desc: 'CVA 语义变体、Dot 状态红点与胶囊样式',
				render: () => <BadgeDemo />,
			},
			{
				key: 'card',
				name: 'Card 卡片',
				desc: '纵向卡片、大图卡片与横向图文卡片',
				render: () => <CardDemo />,
			},
			{
				key: 'description',
				name: 'DescriptionList 描述列表',
				desc: '左右键值对规格展示及分隔线配置',
				render: () => <DescriptionDemo />,
			},
			{
				key: 'skeleton',
				name: 'Skeleton 骨架屏',
				desc: '基础波浪骨架与全套卡片预加载占位',
				render: () => <SkeletonDemo />,
			},
			{
				key: 'heading',
				name: 'Heading 区块标题',
				desc: '支持尺寸、前缀图标、副标题与右侧扩展槽位',
				render: () => <HeadingDemo />,
			},
			{
				key: 'asset',
				name: 'Asset 资产数值',
				desc: '上下结构数据指标展示，常用于个人中心头部',
				render: () => <AssetDemo />,
			},
			{
				key: 'divider',
				name: 'Divider 分割线',
				desc: '水平/垂直、实线/虚线与中间文本嵌入',
				render: () => <DividerDemo />,
			},
			{
				key: 'icon',
				name: 'Icon 图标容器',
				desc: '纯图标、方形/圆形衬底与多主题色预设',
				render: () => <IconDemo />,
			},
			{
				key: 'gender',
				name: 'Gender 性别徽标',
				desc: '自动区分男/女样式与多档尺寸预设',
				render: () => <GenderDemo />,
			},
		],
	},
	{
		title: '布局与媒体',
		items: [
			{
				key: 'page',
				name: 'Page 页面容器',
				desc: '全站统一背景、container-x 边距与 PageContent',
				render: () => <PageDemo />,
			},
			{
				key: 'aspect-ratio',
				name: 'AspectRatio 宽高比容器',
				desc: '16:9 横屏、1:1 正方形与 4:3 比例约束',
				render: () => <AspectRatioDemo />,
			},
			{
				key: 'carousel',
				name: 'Carousel 轮播图',
				desc: '支持自动播放与无缝循环的轮播容器',
				render: () => <CarouselDemo />,
			},
			{
				key: 'image-preview',
				name: 'ImagePreview 图片预览',
				desc: '全屏自定义多图预览弹窗与原生 previewImage',
				render: () => <ImagePreviewDemo />,
			},
		],
	},
	{
		title: '导航与交互',
		items: [
			{
				key: 'button',
				name: 'Button 按钮',
				desc: 'Solid/Soft/Outline/Ghost 四种形态与多尺寸主题',
				render: () => <ButtonDemo />,
			},
			{
				key: 'action-tile',
				name: 'ActionTile 快捷磁贴',
				desc: 'Square/Compact 双形态与 Light/Dark 双色调',
				render: () => <ActionTileDemo />,
			},
			{
				key: 'entry-card',
				name: 'EntryCard 玄关入口卡',
				desc: '渐变主题背景卡片，支持禁用置灰态',
				render: () => <EntryCardDemo />,
			},
			{
				key: 'nav-bar',
				name: 'NavBar 顶部导航栏',
				desc: '适配胶囊高度、透明渐变吸顶与深浅主题',
				render: () => <NavBarDemo />,
			},
			{
				key: 'nav-item',
				name: 'NavItem 导航项',
				desc: 'Grid 宫格导航与支持 openType 的列表形态',
				render: () => <NavItemDemo />,
			},
			{
				key: 'tabs',
				name: 'Tabs 选项卡',
				desc: '基础视图与高级数据视图切换控制',
				render: () => <TabsDemo />,
			},
			{
				key: 'search-bar',
				name: 'SearchBar 搜索栏',
				desc: 'Filled 胶囊、Outline 线框与只读跳转模式',
				render: () => <SearchBarDemo />,
			},
			{
				key: 'float-widgets',
				name: 'FloatQuickMenu & FloatCustomerService',
				desc: '可拖拽悬浮快捷菜单与在线客服悬浮球',
				render: () => <FloatWidgetsDemo />,
			},
		],
	},
	{
		title: '反馈与浮层',
		items: [
			{
				key: 'alert',
				name: 'Alert 提示框',
				desc: '基础提示文案与标题描述组合公告',
				render: () => <AlertDemo />,
			},
			{
				key: 'loading',
				name: 'Loading 加载占位',
				desc: '通用旋转加载指示器与说明文案',
				render: () => <LoadingDemo />,
			},
			{
				key: 'empty',
				name: 'Empty 空状态',
				desc: '暂无数据占位与底部引导操作按钮',
				render: () => <EmptyDemo />,
			},
			{
				key: 'feedback',
				name: 'Feedback 落地反馈',
				desc: '成功、错误、警告、信息与加载大版式结果页',
				render: () => <FeedbackDemo />,
			},
			{
				key: 'auth-mask',
				name: 'AuthMask 登录遮罩',
				desc: '未登录局部高斯模糊遮挡与一键登录引导',
				render: () => <AuthMaskDemo />,
			},
			{
				key: 'dialog',
				name: 'Dialog 对话框',
				desc: '居中模态对话框与二次确认弹窗',
				render: () => <DialogDemo />,
			},
			{
				key: 'drawer',
				name: 'Drawer 抽屉',
				desc: '右侧滑出筛选抽屉与底部快捷面板抽屉',
				render: () => <DrawerDemo />,
			},
		],
	},
	{
		title: '表单与输入',
		items: [
			{
				key: 'form-item',
				name: 'FormItem 表单项',
				desc: 'row/column 表单布局、必填标识与辅助/错误提示',
				render: () => <FormItemDemo />,
			},
			{
				key: 'input',
				name: 'Input 输入框',
				desc: 'filled/underline/ghost 风格、前后缀与一键清空',
				render: () => <InputDemo />,
			},
			{
				key: 'textarea',
				name: 'Textarea 文本域',
				desc: 'filled/outlined/ghost 风格与右下角字数统计',
				render: () => <TextareaDemo />,
			},
			{
				key: 'select',
				name: 'Select 全能选择器',
				desc: '单选、日期、时间与本地省市区级联选择',
				render: () => <SelectDemo />,
			},
			{
				key: 'image-uploader',
				name: 'ImageUploader 图片上传',
				desc: '单图/多图上传模式与只读大图预览',
				render: () => <ImageUploaderDemo />,
			},
			{
				key: 'file-uploader',
				name: 'FileUploader 文档上传',
				desc: '聊天文件选择上传与 PDF/Word 文件预览卡片',
				render: () => <FileUploaderDemo />,
			},
			{
				key: 'rate',
				name: 'Rate 评分',
				desc: '星级评分交互与只读模式展示',
				render: () => <RateDemo />,
			},
			{
				key: 'signature',
				name: 'Signature 手写签名',
				desc: '微信原生 Canvas 2D 笔迹绘制与透明 PNG 导出',
				render: () => <SignatureDemo />,
			},
		],
	},
];

export default function Index() {
	const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

	const toggleItem = (key: string) => {
		setExpandedKeys((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	return (
		<Page>
			<View className="flex flex-col gap-4 py-3">
				<Card>
					<Heading
						title="UI 组件设计系统"
						subtitle="shadcn 风格极简现代规范 · 点击条目展开或收起预览"
						size="lg"
					/>
				</Card>

				{EXAMPLE_GROUPS.map((group) => (
					<View key={group.title} className="flex flex-col gap-2">
						<Text className="px-1 text-xs font-medium text-text-muted">{group.title}</Text>
						<Card noPadding className="overflow-hidden">
							{group.items.map((item, idx) => {
								const isLast = idx === group.items.length - 1;
								const isExpanded = !!expandedKeys[item.key];

								return (
									<View key={item.key} className={cn(!isLast && 'border-b border-zinc-100/80')}>
										<View
											onClick={() => toggleItem(item.key)}
											className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors active:bg-zinc-50/80"
										>
											<View className="flex-1 min-w-0 flex flex-col gap-0.5">
												<Text className="text-sm font-medium text-text-title truncate">
													{item.name}
												</Text>
												<Text className="text-xs text-text-muted truncate">{item.desc}</Text>
											</View>
											<View
												className={cn(
													'icon-[ph--caret-right-thin] size-4 text-text-muted/70 shrink-0 transition-transform duration-200',
													isExpanded && 'rotate-90 text-primary',
												)}
											/>
										</View>

										{isExpanded && (
											<View className="px-4 py-3.5 bg-zinc-50/60 border-t border-zinc-100/80">
												{item.render()}
											</View>
										)}
									</View>
								);
							})}
						</Card>
					</View>
				))}
			</View>
		</Page>
	);
}
