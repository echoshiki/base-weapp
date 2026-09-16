# UI 组件库

基于 Taro + React + Tailwind CSS 的小程序原子级 UI 组件集合。设计目标：薄封装、可组合、符合 shadcn 范式、可跨项目复制。

所有组件统一从 `@/components/ui` 导出：

```tsx
import { Page, Card, Button, FormItem, Badge, Avatar, Drawer, Tabs } from '@/components/ui';
```

---

## 目录

- [前置依赖](#前置依赖)
- 布局：[`Page`](#page)、[`Card`](#card)、[`Divider`](#divider)
- 展示：[`Heading`](#heading)、[`Badge`](#badge)、[`Avatar`](#avatar)、[`Description`](#description)、[`Asset`](#asset)、[`Alert`](#alert)、[`Loading`](#loading)、[`Skeleton`](#skeleton)、[`Empty`](#empty)、[`Feedback`](#feedback)
- 导航：[`Tabs`](#tabs)、[`GridNav`](#gridnav)、[`ColumnNav`](#columnnav)、[`EntryCard`](#entrycard)、[`Carousel`](#carousel)、[`SearchBar`](#searchbar)
- 表单：[`FormItem`](#formitem)、[`Select`](#select)、[`Signature`](#signature)、[`ImageUploader`](#imageuploader)、[`FileUploader`](#fileuploader)、[`Rate`](#rate)
- 交互：[`Button`](#button)、[`Dialog`](#dialog)、[`Drawer`](#drawer)、[`ImagePreview`](#imagepreview)

---

## 前置依赖

复制到其他项目时，请确认目标项目同样具备以下基础：

| 类别 | 依赖                                                      |
| ---- | --------------------------------------------------------- |
| 框架 | `@tarojs/components`、`@tarojs/taro`、`react@18+`         |
| 样式 | Tailwind CSS（小程序端推荐 `weapp-tailwindcss`）          |
| 图标 | Iconify 的 class-based 用法（如 `icon-[ph--house-bold]`） |

---

## 布局组件

### Page

页面级 Layout 顶级容器组件。自动收归全站背景色 (`bg-main-bg`)、左右边距 (`paddingX`/`container-x`)、页面级 Loading 居中占位与底部 TabBar/安全区留白 (`hasTabBar`/`pb-safe`)。导出 `<Page>` 与 `<PageContent>`。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `hasTabBar` | `boolean` | 是否包含底部 TabBar（启用 `pb-24` 留白，默认 `false`） |
| `paddingX` | `boolean` | 是否启用全站统一左右边距 (`container-x`)，默认 `true` |
| `loading` | `boolean` | 页面级统一 Loading 状态，默认 `false` |
| `header` | `ReactNode` | 页面顶部固定 Header 槽位 (如吸顶搜索栏) |
| `footer` | `ReactNode` | 页面底部 Fixed 吸底操作栏槽位 |

```tsx
// 1. 默认统一边距与 TabBar 留白页面
<Page hasTabBar>
  <View className="py-4">页面内容自动享受 container-x 左右边距</View>
</Page>

// 2. 带页面 Loading 状态与吸底按钮槽位
<Page loading={isLoading} footer={<Button block>提交订单</Button>}>
  <View>数据加载完成后显示内容...</View>
</Page>
```

### AspectRatio

宽高比约束容器组件（shadcn 架构）。将子元素（图片、视频、骨架屏等）强约束在指定的宽高比例容器内，有效防止图片/媒体异步加载时的布局塌陷与页面跳变 (CLS)。

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `ratio` | `number` | 宽高比例（如 `16 / 9`, `4 / 3`, `1 / 1`, `3 / 4`），默认 `16 / 9` |

```tsx
// 1. 16:9 经典横屏 Banner 比例
<AspectRatio ratio={16 / 9} className="rounded-card">
  <Image src="https://.../banner.jpg" className="size-full" mode="aspectFill" />
</AspectRatio>

// 2. 1:1 方图或 4:3 列表比例
<AspectRatio ratio={1 / 1} className="rounded-card">
  <Image src="https://.../thumb.jpg" className="size-full" mode="aspectFill" />
</AspectRatio>
```

### Card

卡片容器组件族（shadcn 架构）。支持纵向与横向图文（`layout="horizontal"`）双重布局。

#### 子组件导出：

- `<Card>`: 容器
- `<CardImage>`: 封面图片组件（自动根据 layout 适配尺寸）
- `<CardHeader>`, `<CardTitle>`, `<CardDescription>`: 头部与标题说明
- `<CardContent>`, `<CardFooter>`: 内容区与底部操作区

```tsx
// 1. 纵向面板卡片
<Card clickable onClick={goDetail}>
  <CardHeader>
    <CardTitle>奢品鉴定服务</CardTitle>
    <CardDescription>发布时间：2026-07-29</CardDescription>
  </CardHeader>
  <CardContent>内容摘要描述...</CardContent>
  <CardFooter>
    <Text>分类：手表</Text>
    <Button size="xs" variant="ghost">查看</Button>
  </CardFooter>
</Card>

// 2. 纵向大图卡片 (上面大图，下面标题信息)
<Card noPadding clickable onClick={goDetail}>
  <CardImage src="https://.../cover.jpg" className="h-36" />
  <View className="p-3.5 space-y-2">
    <CardTitle>Rolex 劳力士预估服务</CardTitle>
    <CardDescription>包含机芯检测与行情参考</CardDescription>
  </View>
</Card>

// 3. 横向图文卡片 (替代旧版 ArticleCard，零硬编码)
<Card layout="horizontal" clickable onClick={goDetail}>
  <CardImage src="https://.../thumb.jpg" />
  <CardContent>
    <CardTitle className="line-clamp-1">最新便民社区服务指南</CardTitle>
    <CardDescription className="line-clamp-2">摘要描述...</CardDescription>
    <CardFooter>
      <Badge size="xs" variant="secondary">便民信息</Badge>
      <Text>2026-07-29</Text>
    </CardFooter>
  </CardContent>
</Card>
```

### Divider

分割线，可水平/垂直、可虚线、可在中间嵌入文字。

```tsx
<Divider>—— 我是分割线 ——</Divider>
<Divider dashed className="my-2" />
<View>左<Divider orientation="vertical" />右</View>
```

---

## 展示组件

### Heading

模块级标题，左侧装饰条/图标 + 标题 + 可选副标题 + 右侧统一 `extra` 扩充与 `onExtraClick` 回调。

```tsx
// 1. 快捷字符串 extra (自动渲染文本与右侧箭头)
<Heading title="今日活动" subtitle="精选 3 场" extra="查看全部" onExtraClick={goActivity} />

// 2. 自定义 ReactNode extra (如微型按钮或 Badge)
<Heading title="最新通知" extra={<Badge variant="primary" size="xs">3条未读</Badge>} />
```

### Badge

徽章/标签组件，提供标准化 CVA 语义变体，支持 `dot` 状态点与前缀图标。

| Prop      | 类型                                                                                                      | 说明                       |
| --------- | --------------------------------------------------------------------------------------------------------- | -------------------------- |
| `variant` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'destructive' \| 'info' \| 'outline'` | 变体样式，默认 `secondary` |
| `size`    | `'xs' \| 'sm' \| 'md' \| 'lg'`                                                                            | 尺寸，默认 `sm`            |
| `pill`    | `boolean`                                                                                                 | 是否胶囊圆角               |
| `dot`     | `boolean`                                                                                                 | 文字左侧是否显示状态小红点 |
| `icon`    | `ReactNode` \| `string`                                                                                   | 前缀图标                   |

```tsx
<Badge variant="success" dot>已上线</Badge>
<Badge variant="warning" dot>审核中</Badge>
<Badge variant="destructive">已驳回</Badge>
<Badge variant="outline">轮播标签</Badge>
<Badge variant="secondary" pill>VIP 胶囊</Badge>
```

### Avatar

头像组件族，导出 `<Avatar>`, `<AvatarImage>`, `<AvatarFallback>`, `<AvatarBadge>`。

```tsx
// 1. 开箱即用单标签模式
<Avatar src={user.avatar} name={user.nickName} size="lg" />

// 2. 复合组件模式 (带状态角标)
<View className="relative">
  <Avatar src={user.avatar} name={user.nickName} size="md" />
  <AvatarBadge status="online" />
</View>
```

### Description / DescriptionList

描述项与规格数据表组件族。导出 `<DescriptionList>` (容器，支持 `divider` 边框线) 与 `<Description>` / `<DescriptionItem>`。

```tsx
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
```

### Asset

上下结构的数值展示，常用于个人中心头部"已发布 / 已完成"等数据。

```tsx
<View className="flex">
	<Asset label="已发布" value={12} />
	<Asset label="进行中" value={3} valueColor="text-emerald-500" />
</View>
```

### Alert

行内提示条，采用 shadcn 风格的复合组件架构，支持语义色变体（`default`/`info`/`warning`/`success`/`destructive`）。

```tsx
// 1. 经典单体简化用法
<Alert variant="info">请确保凭证边缘完整、公章清晰，格式支持 JPG、PNG</Alert>
<Alert variant="destructive" icon="icon-[ph--x-circle]">提交失败，请稍后重试</Alert>

// 2. shadcn 优雅复合组件用法
<Alert variant="warning">
  <AlertTitle>审核提示</AlertTitle>
  <AlertDescription>您提交的凭证将在 1-3 个工作日内完成人工审核。</AlertDescription>
  <AlertAction>
    <Button size="xs" variant="outline">撤回</Button>
  </AlertAction>
</Alert>
```

### Loading

通用加载占位（中心 spinner + 文案）。

```tsx
return isLoading ? <Loading title="加载中..." /> : <List />;
```

### Empty

空状态组件族，导出 `<Empty>`, `<EmptyIcon>`, `<EmptyTitle>`, `<EmptyDescription>`, `<EmptyAction>`。

```tsx
// 1. 简易模式
<Empty title="暂无任何评估订单" subTitle="您可以提交需求开始体验" buttonText="去申请" onButtonClick={goApply} />

// 2. 复合模式 (自由定制按钮或插画)
<Empty>
  <EmptyIcon icon="icon-[ph--mailbox-duotone]" />
  <EmptyTitle>暂无数据</EmptyTitle>
  <EmptyDescription>试试其他搜索关键词吧</EmptyDescription>
  <EmptyAction>
    <Button size="sm" onClick={reset}>重新加载</Button>
  </EmptyAction>
</Empty>
```

### Feedback

落地反馈/结果页（成功、失败、加载等大版式），可插入中间内容与底部按钮。

```tsx
<Feedback
	variant="success"
	title="支付成功"
	subtitle="感谢您的支持"
	extra={
		<Button block onClick={back}>
			返回订单
		</Button>
	}
/>
```

---

## 导航组件

### Tabs

选项卡组件族，导出 `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>`。

```tsx
// 1. shadcn 声明式复合模式
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">基础视图</TabsTrigger>
    <TabsTrigger value="tab2">高级数据</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">视图 1 内容</TabsContent>
  <TabsContent value="tab2">视图 2 内容</TabsContent>
</Tabs>

// 2. 简易数据驱动模式
<Tabs
  tabs={[{ label: '全部', value: 'all' }, { label: '进行中', value: 'serving' }]}
  current={tab}
  onChange={(val) => setTab(val)}
/>
```

### NavItem / GridNav / ColumnNav

导航项统一组件族（支持 `layout="grid"` 垂直宫格与 `layout="list"` 横向列表），彻底解耦 `path` 转向 `onClick` 与小程序原生 `openType`（如 `openType="contact"` 微信客服）。保留 `GridNav` 与 `ColumnNav` 别名。

```tsx
// 1. Grid 宫格导航形态 (layout="grid")
<View className="grid grid-cols-4 gap-4">
  <NavItem label="需求大厅" icon="icon-[ph--hand-coins]" variant="primary" onClick={goDemand} />
  <NavItem label="志愿活动" icon="icon-[ph--confetti]" variant="success" onClick={goActivity} />
</View>

// 2. List 列表条目形态 (layout="list"，含微信客服与 ghost 变体)
<NavItem layout="list" icon="icon-[ph--gear]" label="设置" onClick={goSettings} />
<NavItem layout="list" icon="icon-[ph--headset]" label="联系客服" openType="contact" border={false} />
```

### EntryCard

带主题色背景与装饰的玄关式入口卡片。

```tsx
<EntryCard
	theme="orange"
	icon="icon-[ph--user-focus-duotone]"
	title="志愿者认证"
	desc="完成实名认证后可承接需求"
	url="/pages/apply/volunteer/index"
/>
```

### Carousel

轮播图组件，完全解耦业务逻辑。导出 `<Carousel>`, `<CarouselContent>`, `<CarouselItem>`。

```tsx
// 1. 简易数据驱动模式
<Carousel
  list={bannerList}
  onItemClick={(item) => item.url && Taro.navigateTo({ url: item.url })}
/>

// 2. shadcn 复合组件模式
<Carousel>
  <CarouselContent autoplay circular heightClass="h-48">
    <CarouselItem onClick={() => console.log('item 1')}>
      <Image src="https://.../banner1.jpg" className="w-full h-full rounded-card" mode="aspectFill" />
    </CarouselItem>
  </CarouselContent>
</Carousel>
```

### SearchBar

搜索栏组件（shadcn 范式），支持 `variant="filled" | "outline"` 变体、`pill` 胶囊圆角、`action` 右侧解耦槽位 (可自由传入 `<Button>` 或文本)、只读跳转模式与 `onClear` 清除事件。

```tsx
// 1. filled 填充胶囊搜索框 (解耦外置按钮 Slot)
<SearchBar
  variant="filled"
  action={<Button size="xs" onClick={doSearch}>搜索</Button>}
  value={kw}
  onInput={setKw}
  onClear={() => setKw('')}
  placeholder="搜索物品或服务..."
/>

// 2. outline 线框模式
<SearchBar variant="outline" placeholder="搜索关键词" />

// 3. 只读跳转模式
<SearchBar readonly placeholder="搜索需求" onClick={() => Taro.navigateTo({ url: '/pages/search/index' })} />
```

---

## 表单组件

### FormItem

表单项组件族（支持单标签模式与 shadcn 复合模式）。导出 `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormDescription>`, `<FormMessage>`。

```tsx
// 1. 单标签简易模式
<FormItem label="微信真实姓名" required helper="用于核对估价协议与转账卡号">
  <Input className="text-right text-sm" value={form.name} onInput={(e) => setField('name', e.detail.value)} />
</FormItem>

// 2. 带有校验错误提示 (FormMessage) 的模式
<FormItem border={false} error={form.bankCard ? '' : '银行卡号不能为空'}>
  <FormLabel required>提现银行卡号</FormLabel>
  <FormControl>
    <Input className="text-right text-sm" placeholder="请输入卡号" />
  </FormControl>
</FormItem>
```

### Select

全能选择器组件（收归普通单选 `selector`、日期 `date`、省市区 `region`、时间 `time`），统一支持 `outlined`（框体卡片）/ `underline`（单下划线）/ `ghost`（极简行内）三种主题变体。

| Prop | 类型 | 适用模式 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'selector' \| 'date' \| 'region' \| 'time'` | 全部 | 选择器模式，默认 `'selector'` |
| `variant` | `'outlined' \| 'underline' \| 'ghost'` | 全部 | 变体风格，默认 `'outlined'` |
| `placeholder` | `string` | 全部 | 占位文案 |
| `icon` | `ReactNode \| string` | 全部 | 左侧图标 |
| `children` | `ReactNode` | 全部 | 自定义触发插槽（不传则渲染内置标准框） |
| `options` | `(T \| string \| number)[]` | `selector` | 数据源数组 |
| `value` | `any` | 全部 | 当前选中的值 |
| `onChange` | `Function` | 全部 | 选中变更回调（根据 mode 智能推导参数） |
| `fields` | `'year' \| 'month' \| 'day'` | `date` | 日期选择粒度，默认 `'day'` |

```tsx
// 1. 普通下拉单选 (估价页 / 独立卡片)
<Select
  options={categoryList}
  value={selectedCatId}
  onChange={(val) => setCatId(val)}
  placeholder="请点击选择典当大类"
  icon="icon-[ph--cube-light]"
  variant="outlined"
/>

// 2. 日期 / 生日选择 (mode="date")
<Select
  mode="date"
  variant="underline"
  value={birthday}
  onChange={(dateStr) => setBirthday(dateStr)}
  placeholder="请选择生日"
  icon="icon-[ph--calendar-light]"
/>

// 3. 省市区级联选择 (mode="region")
<Select
  mode="region"
  variant="ghost"
  value={regionCodes}
  onChange={(res) => setRegion(res.province.name + res.city.name)}
/>
```

### ImageUploader

图片上传组件，支持单图/多图模式，内置点击大图预览 (`preview`) 与只读模式 (`readonly`)。

| Prop       | 类型                                     | 说明                                                                 |
| ---------- | ---------------------------------------- | -------------------------------------------------------------------- |
| `value`    | `string[]`                               | 已上传图片 URL 数组                                                  |
| `onChange` | `(urls: string[]) => void`               | 图片列表变动回调                                                     |
| `onUpload` | `(paths: string[]) => Promise<string[]>` | 处理实际上传接口，返回最终 URL 数组                                  |
| `maxCount` | `number`                                 | 最大上传数量，默认 `1`（单图为全宽卡片，>1 为九宫格）                |
| `preview`  | `boolean`                                | 点击已上传缩略图是否自动调起大图预览，默认 `true`                    |
| `readonly` | `boolean`                                | 是否只读态（只读模式下隐藏上传按钮与删除角标，仅展示图片与点击放大） |

```tsx
// 1. 多图上传态 (带上传回调与大图预览)
<ImageUploader
  maxCount={4}
  value={urls}
  onChange={setUrls}
  onUpload={uploadApi}
  label="添加凭证"
/>

// 2. 只读态 (表单查看页)
<ImageUploader readonly value={urls} />
```

---

## 交互组件

### Button

多变体、多尺寸按钮组件（shadcn 范式），支持左侧 `icon` 图标、全局原生伪元素边框防锯齿重置与 `destructive` / `outline` 变体。

```tsx
<Button variant="primary" icon="icon-[ph--paper-plane]" onClick={submit}>提交</Button>
<Button variant="outline" size="sm">取消</Button>
<Button variant="destructive" size="xs">删除记录</Button>
```

### Drawer

抽屉组件族（shadcn Sheet 范式）。导出 `<Drawer>`, `<DrawerContent>`, `<DrawerHeader>`, `<DrawerTitle>`, `<DrawerDescription>`, `<DrawerFooter>`。支持 `position` 弹出方向（`right` / `bottom` / `left` / `top`）。

```tsx
// 1. 右侧弹出筛选抽屉 (position="right")
<Drawer open={isOpen} onOpenChange={setIsOpen} position="right">
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>高阶参数筛选</DrawerTitle>
      <DrawerDescription>筛选条件设置</DrawerDescription>
    </DrawerHeader>
    <View className="p-4">筛选内容区...</View>
    <DrawerFooter>
      <Button variant="outline" size="xs" onClick={reset}>重置</Button>
      <Button variant="primary" size="xs" onClick={apply}>确定</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

// 2. 底部弹出面板 (position="bottom")
<Drawer open={isBottomOpen} onOpenChange={setBottomOpen} position="bottom">
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>确认预约</DrawerTitle>
    </DrawerHeader>
    <View className="p-4">确认信息...</View>
    <DrawerFooter>
      <Button block variant="primary" onClick={confirm}>提交</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### ImagePreview

全屏高保真图片预览组件，支持单图及多图 Swiper 滚动预览（带 `1 / 5` 页码指示器与底部动作栏），并提供静态快捷 API `ImagePreview.show({ urls, current })`。

```tsx
// 1. JSX 组件模式
<ImagePreview open={visible} urls={imgList} current={0} onClose={() => setVisible(false)} />;

// 2. 静态 Helper API 直接调起原生全屏预览
ImagePreview.show({ urls: imgList, current: 0 });
```

### Dialog

居中模态对话框复合组件族（shadcn 对话框架构）。提供透明高斯模糊遮罩、缩放动画（`animate-scale-in`）、右上角关闭按钮与弹窗卡片全套组件。

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>二次确认</DialogTitle>
      <DialogDescription>确定要删除此条记录吗？</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button size="xs" variant="outline" onClick={() => setOpen(false)}>取消</Button>
      <Button size="xs" variant="destructive" onClick={handleDelete}>删除</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Skeleton

骨架屏预加载组件族（shadcn 架构）。基于 Tailwind `animate-pulse` 实现呼吸感波浪微调预加载占位，避免图片/列表异步加载时的页面跳变。

```tsx
// 1. 基础波浪块
<Skeleton className="h-4 w-full" />

// 2. 头像骨架与多行文本骨架
<SkeletonAvatar size="md" />
<SkeletonText lines={3} />

// 3. 全套图文卡片组合骨架
<SkeletonCard />
```

### Signature

亲笔手写签名画板组件。基于微信原生 Canvas 2D 高清绘制（自动适配 Retina 屏幕像素比），0 外部依赖，支持平滑圆润笔触、防空白拦截、一键重写与透明背景 PNG 导出。

```tsx
<Signature
  height={200}
  strokeWidth={3.5}
  placeholder="请在此区域亲笔手写您的全名"
  onConfirm={(tempFilePath) => {
    console.log('导出透明签名图片路径:', tempFilePath);
  }}
  onClear={() => {
    console.log('签名已清空');
  }}
/>
```

---

## 设计约定

- **样式来源**：组件内部直接写 Tailwind class，样式覆盖优先通过 `className` 追加。
- **数据流**：组件保持**纯展示与解耦**；副作用（请求、Toast、跳转）通过回调交由业务侧。
- **命名空间**：原子 UI 组件放在 `components/ui/`，业务组件放在 `components/biz/`。
- **图标**：统一使用 Iconify Phosphor（如 `icon-[ph--gear]`）。
