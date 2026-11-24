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
	ImageUploaderDemo,
	SignatureDemo,
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
				desc: '尺寸预设与在线状态角标 (AvatarBadge)',
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
		],
	},
	{
		title: '布局与媒体',
		items: [
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
		],
	},
	{
		title: '导航与搜索',
		items: [
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
				key: 'empty',
				name: 'Empty 空状态',
				desc: '暂无数据占位与底部引导操作按钮',
				render: () => <EmptyDemo />,
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
				desc: '输入框表单布局、必填标识与校验错误提示',
				render: () => <FormItemDemo />,
			},
			{
				key: 'image-uploader',
				name: 'ImageUploader 图片上传',
				desc: '单图/多图上传模式与只读大图预览',
				render: () => <ImageUploaderDemo />,
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
									<View key={item.key} className={cn(!isLast && 'border-b border-gray-100/80')}>
										<View
											onClick={() => toggleItem(item.key)}
											className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors active:bg-gray-50/80"
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
											<View className="px-4 py-3.5 bg-gray-50/60 border-t border-gray-100/80">
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
