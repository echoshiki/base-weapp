# UI 组件库 (`@/components/ui`)

基于 **Taro 4 + React 18 + Tailwind CSS v4 + Iconify (`@iconify-json/ph`)** 的小程序 & H5 双端原子级 UI 组件库。

**设计理念**：薄封装、单组件优先、无业务耦合、开箱即用。所有组件统一从 `@/components/ui` 导出，并在 `src/pages/example/` 提供完整交互示例。

```tsx
import {
	Page,
	Card,
	Heading,
	Button,
	Input,
	Textarea,
	FormItem,
	Badge,
	Avatar,
	Tabs,
	Drawer,
	Dialog,
} from '@/components/ui';
```

---

## 统一设计规范

- **语义主题色 (`UiColor`)**：`'primary' | 'blue' | 'sky' | 'indigo' | 'emerald' | 'amber' | 'orange' | 'rose' | 'zinc'`
- **灰色系**：全站统一使用 `zinc` 色阶（禁止混用 `slate` / `gray` / `neutral`）
- **最小尺寸**：字号、阴影与组件尺寸最小档位为 `xs`（禁止 `text-[10px]` / `text-[11px]` / `text-[18rpx]` / `2xs`）
- **文本色**：全局默认字色 `#18181b`（`zinc-900`）；自适应弱化文字使用 `opacity-60`，占位符与图标使用 `text-zinc-400` / `text-zinc-500`
- **双端浮层**：`Drawer`、`Dialog`、`ImagePreview`、`FloatCustomerService` 在 H5 端自动通过 `portal.ts` 挂载到 `document.body`，规避路由层叠上下文与 TabBar 遮挡

---

## 组件总览（共 38 个）

## 组件总览（共 40 个）

| 分类           | 组件                                                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **布局与媒体** | `Page`、`Card`、`Divider`、`AspectRatio`、`Carousel`、`ImagePreview`                                                             |
| **基础展示**   | `Heading`、`Badge`、`Avatar`、`Gender`、`Icon`、`Asset`、`DescriptionList` / `Description`、`Skeleton`                           |
| **基础展示**   | `Heading`、`Badge`、`Avatar`、`Gender`、`Icon`、`Asset`、`Price`、`DescriptionList` / `Description`、`Skeleton`                  |
| **导航与入口** | `NavBar`（含 `useNavInfo`）、`NavItem`、`Tabs`、`SearchBar`、`ActionTile`、`EntryCard`、`FloatQuickMenu`、`FloatCustomerService` |
| **表单与输入** | `FormItem`、`Input`、`Textarea`、`Select`、`ImageUploader`、`FileUploader`、`Rate`、`Signature`                                  |
| **表单与输入** | `FormItem`、`Input`、`Textarea`、`Select`、`Stepper`、`ImageUploader`、`FileUploader`、`Rate`、`Signature`                       |
| **交互与反馈** | `Button`、`Alert`、`Loading`、`Empty`、`Feedback`、`AuthMask`、`Dialog`、`Drawer`                                                |

---

## 布局与媒体

### Page

页面级顶级容器，收归背景色 (`bg-main-bg`)、左右边距 (`container-x`)、页面级 Loading、底部 TabBar/安全区留白与可选悬浮快捷菜单。

| Prop            | 类型         | 默认值                            | 说明                                                               |
| --------------- | ------------ | --------------------------------- | ------------------------------------------------------------------ |
| `hasTabBar`     | `boolean`    | `false`                           | 是否为 TabBar 页（启用 `pb-24` 留白）                              |
| `paddingX`      | `boolean`    | `true`                            | 是否启用全站左右边距 `container-x`                                 |
| `loading`       | `boolean`    | `false`                           | 页面级 Loading 状态                                                |
| `showQuickMenu` | `boolean`    | `false`                           | 是否挂载右下角 `FloatQuickMenu`                                    |
| `showH5Nav`     | `boolean`    | 非 TabBar 且非微信浏览器时 `true` | H5 端是否显示顶部 44px 吸顶返回导航栏（小程序端自动走原生 Header） |
| `title`         | `string`     | 自动读取 `document.title`         | H5 顶部导航栏标题                                                  |
| `navExtra`      | `ReactNode`  | -                                 | H5 顶部导航栏右侧扩展槽位                                          |
| `onBack`        | `() => void` | 智能返回/回首页                   | 自定义返回按钮点击回调                                             |
| `header`        | `ReactNode`  | -                                 | 顶部自定义插槽                                                     |

```tsx
<Page hasTabBar showQuickMenu={false}>
	<View className="py-4">页面内容</View>
</Page>
```

### Card

统一卡片容器，支持 `vertical`（纵向）与 `horizontal`（横向）布局。

| Prop        | 类型                         | 默认值             | 说明                                   |
| ----------- | ---------------------------- | ------------------ | -------------------------------------- |
| `layout`    | `'vertical' \| 'horizontal'` | `'vertical'`       | 布局方向                               |
| `noPadding` | `boolean`                    | `false`            | 取消默认内边距（适合顶部通栏大图卡片） |
| `rounded`   | `boolean`                    | `true`             | 是否启用 `rounded-card`                |
| `clickable` | `boolean`                    | `Boolean(onClick)` | 点击缩放反馈                           |

```tsx
<Card className="gap-2" onClick={goDetail}>
	<Heading title="卡片标题" subtitle="2026-11-25" />
	<Text className="text-xs opacity-60">摘要内容...</Text>
</Card>
```

### Divider

水平/垂直分割线，支持虚线与中间嵌入文本。

```tsx
<Divider />
<Divider dashed />
<Divider>中间文字</Divider>
<View className="flex items-center">左<Divider orientation="vertical" />右</View>
```

### AspectRatio

宽高比约束容器，防止媒体异步加载导致的布局跳变。

```tsx
<AspectRatio ratio={16 / 9} className="rounded-card bg-zinc-100">
	<Image src={cover} className="size-full rounded-card" mode="aspectFill" />
</AspectRatio>
```

### Carousel

轮播图组件，支持数据驱动 (`list` + 可选 `renderItem`) 及高度/圆角配置。

```tsx
<Carousel list={banners} heightClass="h-44" onItemClick={(item) => item.url && mapsTo(item.url)} />
```

### ImagePreview

全屏图片预览组件（H5 自动 Portal 挂载），同时提供静态方法 `ImagePreview.show({ urls, current })` 调起原生预览。

```tsx
<ImagePreview open={visible} urls={urls} current={0} onClose={() => setVisible(false)} />;
ImagePreview.show({ urls, current: 0 });
```

---

## 基础展示

### Heading

区块标题组件，基于 `currentColor` 自动适配深/浅背景。

```tsx
<Heading
	title="最新动态"
	subtitle="共 12 条"
	size="md"
	icon="icon-[ph--sparkle-duotone]"
	extra="查看全部"
	onExtraClick={goMore}
/>
```

### Badge

语义徽章标签，支持 `UiColor`、`pill` 胶囊、`dot` 状态点与前缀 `icon`。

```tsx
<Badge variant="emerald" dot>已上线</Badge>
<Badge variant="amber" dot>审核中</Badge>
<Badge variant="zinc" pill>默认标签</Badge>
```

### Avatar

头像组件，支持 `xs` / `sm` / `md` / `lg` / `xl` 五档尺寸，无图或加载失败时自动回退为首字母彩底占位，支持自定义 `fallback`。

```tsx
<Avatar src={user.avatar} name={user.nickName} size="lg" />
```

### Gender

性别图标徽标（`'0'` 蓝男标、`'1'` 红女标，未知返回 `null`），支持 `xs` / `sm` / `md`。

```tsx
<Gender gender="0" size="sm" />
```

### Icon

通用图标与带底块图标容器，支持 `shape="none" | "circle" | "square"`、`size="sm" | "md" | "lg" | number` 与 `UiColor` 主题。

```tsx
<Icon icon="icon-[ph--shield-check-duotone]" shape="square" size="md" theme="primary" />
```

### Asset

上下结构的数据指标展示，常用于个人中心或统计卡片。

```tsx
<View className="flex items-center">
	<Asset label="已发布" value={12} />
	<Asset label="进行中" value={3} valueColor="text-emerald-500" />
</View>
```

### DescriptionList / Description

键值规格列表，`DescriptionList` 通过 Context 统一控制 `divider` 分隔线。

```tsx
<DescriptionList divider>
	<Description label="订单编号" value="ORD-20261125-01" variant="between" />
	<Description label="当前状态" value={<Badge variant="emerald">已完成</Badge>} variant="between" />
</DescriptionList>
```

### Skeleton

原子骨架屏占位块，通过 `className` 自由组合尺寸与形状。

```tsx
<Skeleton className="size-10 rounded-full" />
<Skeleton className="h-4 w-2/3" />
```

---

## 导航与入口

### NavBar & `useNavInfo`

自定义顶部导航栏（配合页面 `navigationStyle: 'custom'`），自动适配微信胶囊高度，支持滚动透明渐变吸顶与 Logo 自动反白。

```tsx
<NavBar title="首页" theme="light" transparent />
```

### NavItem

统一导航项，支持 `layout="grid"`（宫格）与 `layout="list"`（列表），支持小程序 `openType` 与右侧 `extra`。

```tsx
<NavItem label="帮助中心" icon="icon-[ph--question]" variant="primary" onClick={goHelp} />
<NavItem layout="list" label="在线客服" icon="icon-[ph--headset]" openType="contact" border={false} />
```

### Tabs

数据驱动泛型选项卡（`Tabs<T>`），支持均分与横向滚动 (`scrollable`)、吸顶 (`sticky`)，重复点击当前项自动拦截。

```tsx
<Tabs
	tabs={[
		{ label: '全部', value: 'all' },
		{ label: '进行中', value: 'active' },
	]}
	value={tab}
	onChange={setTab}
/>
```

### SearchBar

搜索栏组件，支持 `variant="filled" | "outline"`、`pill`、`readonly` 跳转模式、`action` 外置槽位与清空按钮。

```tsx
<SearchBar
	variant="filled"
	value={kw}
	onInput={setKw}
	placeholder="搜索关键词..."
	action={<Button size="sm">搜索</Button>}
/>
```

### ActionTile

快捷功能磁贴，支持 `layout="square" | "compact"`、`tone="dark" | "light"` 与 `UiColor` 主题，可展示统计数值 (`value` + `unit`) 或副标题。

```tsx
<ActionTile
	layout="square"
	tone="dark"
	theme="primary"
	title="UI 组件库"
	subTitle="完整交互示例"
	icon="icon-[ph--squares-four-duotone]"
/>
```

### EntryCard

带主题渐变背景与装饰图标的入口卡片，支持 `theme?: UiColor` 与 `disabled`。

```tsx
<EntryCard
	theme="blue"
	icon="icon-[ph--buildings-duotone]"
	title="企业认证"
	desc="完成资质核验解锁服务"
	onClick={goAuth}
/>
```

### FloatQuickMenu & FloatCustomerService

可拖拽悬浮组件（纯 CSS `fixed` + 触摸拖拽，已规避 H5 `MovableArea` 懒加载水合 Bug）：

- `FloatQuickMenu`：快捷返回/首页/置顶菜单（`Page` 默认内置，可通过 `showQuickMenu={false}` 关闭）。
- `FloatCustomerService`：在线客服悬浮球（`openType="contact"`，H5 自动 Portal 挂载）。

---

## 表单与输入

### FormItem

纯粹的表单项布局容器，负责 `label`（支持 `ReactNode`）、`required`、`helper`、`error` 与 `row` / `column` 排版。`border` 默认在 `row` 模式下开启、`column` 模式下关闭。

```tsx
<FormItem label="真实姓名" required helper="用于实名核验">
  <Input variant="ghost" inputClassName="text-right" value={name} onChange={setName} placeholder="请输入姓名" />
</FormItem>

<FormItem layout="column" label="详细地址" error={addrError}>
  <Input variant="filled" value={addr} onChange={setAddr} clearable error={!!addrError} />
</FormItem>
```

### Input

单行输入框，支持 `variant="filled" | "underline" | "ghost"`、`prefix`、`suffix`、`clearable`、`error`、`onChange` 与 `inputClassName`。

```tsx
<Input variant="filled" prefix="icon-[ph--user]" placeholder="请输入账号" value={val} onChange={setVal} clearable />
<Input variant="underline" placeholder="请输入手机号" value={phone} onChange={setPhone} />
```

### Textarea

多行文本域，支持 `variant="filled" | "outlined" | "ghost"`、右下角字数统计 (`showCount`) 与 `error`。

```tsx
<Textarea variant="filled" placeholder="请输入描述..." value={desc} onChange={setDesc} maxlength={200} showCount />
```

### Select

全能选择器，支持 `mode="selector" | "date" | "region" | "time"`（`region` 内置本地省市区数据），统一提供 `outlined` / `underline` / `ghost` 三种风格。

```tsx
<Select mode="selector" options={options} value={val} onChange={setVal} placeholder="请选择" />
<Select mode="date" variant="underline" value={date} onChange={setDate} />
<Select mode="region" value={region} onChange={(res) => setRegion(res.rawNames || [])} />
```

### ImageUploader & FileUploader

- `ImageUploader`：单图/多图上传组件（`maxCount` 控制模式），内置点击预览与 `readonly` 只读态。
- `FileUploader`：微信聊天文档选择与上传组件（支持 PDF/Word 等格式预览与清除）。

### Rate & Signature

- `Rate`：星级评分组件，支持交互评分、自定义文案 `texts` 与 `readonly`。
- `Signature`：微信原生 Canvas 2D 手写签名画板，支持一键清空与透明 PNG 导出。

---

## 交互与反馈

### Button

多外观多尺寸按钮，支持 `size="xs" | "sm" | "md" | "lg" | "xl"`、`appearance="solid" | "soft" | "outline" | "ghost"`、`variant?: UiColor | 'none'`、`icon`、`block`、`loading`、`rounded`。

```tsx
<Button size="md" variant="primary" icon="icon-[ph--paper-plane-tilt-bold]" loading={submitting} onClick={submit}>
  提交
</Button>
<Button size="sm" variant="zinc" appearance="outline">取消</Button>
```

### Alert

行内提示条，支持 `variant="default" | "info" | "warning" | "success" | "destructive" | "error"`、可选 `title` 与右侧 `extra` 操作区。

```tsx
<Alert
	variant="warning"
	title="审核提示"
	extra={
		<Button size="xs" variant="amber" appearance="soft">
			去修改
		</Button>
	}
>
	您提交的材料将在 1-3 个工作日内完成审核。
</Alert>
```

### Loading / Empty / Feedback

- `Loading`：通用旋转加载占位（`<Loading title="加载中..." />`）。
- `Empty`：空状态占位，支持 `title`/`subTitle`（`ReactNode`）、`icon`/`image`、`buttonText`+`onButtonClick` 或自定义 `action`，并提供 `setDefaultEmptyImage(url)` 全局注册默认插图。
- `Feedback`：大版式落地结果页，支持 `variant="success" | "error" | "warning" | "info" | "loading"`、`title`、`subtitle` 与底部 `extra`。

### AuthMask

未登录局部高斯模糊遮罩组件，控制 `locked` 切换遮挡态与正常内容态。

```tsx
<AuthMask locked={!isLoggedIn} title="登录后查看完整数据" onLoginClick={goLogin}>
	<Card>受保护内容</Card>
</AuthMask>
```

### Dialog & Drawer

均为单组件声明式 API（H5 端自动 Portal 挂载至 `document.body`，完整覆盖 TabBar）：

- `Dialog`：居中模态对话框（`open` / `onOpenChange` / `title` / `description` / `footer` / `showClose`）。
- `Drawer`：四向滑出抽屉（`position="right" | "bottom" | "left" | "top"`、`sizeClass`、`title`、`description`、`footer`、`scrollable`）。

```tsx
<Dialog open={open} onOpenChange={setOpen} title="二次确认" description="确定删除该记录吗？" footer={<Button size="xs" variant="rose" onClick={del}>确认</Button>} />

<Drawer open={open} onOpenChange={setOpen} position="bottom" title="筛选条件" footer={<Button block onClick={apply}>确定</Button>}>
  <View className="p-4">抽屉内容</View>
</Drawer>
```
