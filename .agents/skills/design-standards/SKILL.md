---
name: design-standards
description: >-
  Project-wide UI design system, component reuse, anti-AI-slop aesthetics,
  Taro cross-platform (Weapp + H5) conventions, and API architecture standards.
  Load this skill whenever building or modifying pages, UI components, styles,
  services, hooks, or types in this Taro + React + Tailwind v4 codebase.
---

# 项目设计标准化与工程规范 (Base Taro Design Standards)

在编写或重构任何页面、UI 组件、样式或接口代码前，必须严格遵循以下设计系统与工程约定，确保不同页面与新项目保持一致的克制美学与代码质量。

---

## 1. 视觉美学与「反 AI 味」准则

保持极简、现代、克制的移动端原生质感，**明确禁止以下典型“AI 味”堆砌**：
- **禁止滥用渐变与发光**：不要动辄给普通卡片、按钮、背景加刺眼的紫/粉/蓝霓虹渐变或 `shadow-blue-500/40` 发光阴影；渐变仅限主视觉 Banner、品牌 Header 或已封装的 `ActionTile`/`EntryCard`。
- **禁止套娃卡片**：不要在 `<Card>` 里面再套带边框和阴影的 `<Card>`；头像区、顶部提示、纯列表分组等适合通透呈现的区域，优先直接落在 `bg-main-bg` 上，用留白与轻量分隔线区分层级。
- **禁止用 Emoji 替代图标**：所有界面图标统一使用项目内置的 Phosphor Iconify 类名（`icon-[ph--xxx]`），不要在标题、按钮、标签里塞 `🚀`、`✨`、`🔥` 等 Emoji。
- **禁止装饰性废话**：副标题、空状态、按钮文案保持简短直白（如「点击头像更换」「保存资料」），不要堆砌浮夸营销腔。

---

## 2. 色彩、尺寸与排版硬性规范

### 2.1 灰色系唯一标准：`zinc`
- **全站灰色一律使用 `zinc` 色阶**（`bg-zinc-50`、`border-zinc-100`、`border-zinc-200`、`text-zinc-400`、`text-zinc-500`、`text-zinc-900`）。
- **严禁使用** `slate-*`、`gray-*`、`neutral-*`、`stone-*`。

### 2.2 语义主题色：`UiColor`
- 所有多色主题组件统一使用 `src/components/ui/types.ts` 定义的 `UiColor`：
  `'primary' | 'blue' | 'sky' | 'indigo' | 'emerald' | 'amber' | 'orange' | 'rose' | 'zinc'`。
- 不要自行发明 `'secondary'`、`'destructive'`、`'success'` 等非标准色名去传给使用 `UiColor` 的组件。

### 2.3 文本色规范
- 全局默认字色已在 `src/app.css` 的 `page, body` 设为 `#18181b`（`zinc-900`），常规标题与正文直接继承即可，**不要使用已废弃的 `text-text-title` / `text-text-body` / `text-text-muted`**。
- **弱化文字**：
  - 纯文字节点或需自适应深/浅背景的组件（如 `Heading`、`Description`、`Divider`）：优先使用 `opacity-60`。
  - 输入框占位符 (`placeholderClass`)、图标、或内部包含彩色子元素的容器：使用 `text-zinc-400` / `text-zinc-500`。

### 2.4 最小元素尺寸规范：`xs`
- **最小字号、最小阴影、最小组件档位一律以 `xs` 为下限**：
  - 严禁出现 `text-[10px]`、`text-[11px]`、`text-[18rpx]`、`text-2xs`、`shadow-2xs` 等极小任意值或次级尺寸。
- **标准工具类优先**：
  - 正方形尺寸优先用 `size-*`（如 `size-4`、`size-10`、`size-full`）而非 `w-4 h-4`；
  - 1 像素分割线用 `h-px` / `w-px` 而非 `h-[1px]`；
  - 卡片统一圆角使用 `rounded-card`，页面左右边距由 `<Page>` 的 `container-x` 统一提供。

---

## 3. 组件库优先与单组件封装哲学

### 3.1 严禁重复造轮子与重复手写基础样式
写页面前，必须先检查 `src/components/ui/index.ts`（或查阅 `src/components/ui/README.md`），**优先组合现有 38 个 UI 组件**：
- 页面壳子用 `<Page>`，白底卡片用 `<Card>`，区块标题用 `<Heading>`；
- 输入框用 `<Input variant="filled | underline | ghost" />`，多行输入用 `<Textarea showCount />`，表单行用 `<FormItem>`，选择器用 `<Select>`；
- 弹窗/抽屉用 `<Dialog>` / `<Drawer>`，标签用 `<Badge>`，按钮用 `<Button>`，选项卡用 `<Tabs>`，空状态用 `<Empty>`，提示条用 `<Alert>`。
- 禁止在业务页面里反复手写 `flex items-center gap-3 bg-zinc-50 border rounded-xl h-12` 这类裸输入框包装代码。

### 3.2 新增/重构组件的「单组件优先」黄金法则
禁止教条式照搬 Web 端 shadcn/Radix 的多层子组件拆分（如 `CardHeader/CardTitle/CardFooter`、`DialogContent/DialogHeader/DialogTitle`、`FormLabel/FormControl`）：
- **只有满足以下两条之一，才拆「父 + 子」两层组件**：
  1. 不固定数量的重复列表项，且父容器需通过 Context 统一控制子项行为（如 `DescriptionList` + `Description`）；
  2. 子项间存在真实的交互状态联动（如 `RadioGroup` + `Radio`）。
- **固定版式槽位（图标、标题、描述、底部操作）一律采用「单组件 + `ReactNode` Props + `children`」**（如 `Alert`、`Empty`、`Dialog`、`Drawer`、`FormItem`、`Avatar`）。
- 受控表单/切换组件统一使用标准 `value` + `onChange`（需要窄联合类型推导时加泛型 `<T>`），不保留 `current`、`onValueChange` 等双轨兼容字段。

---

## 4. Taro 双端（微信小程序 + H5）避坑清单

1. **`cn()` 不做 Tailwind 冲突合并**：`src/utils/common.ts` 中的 `cn` 是纯字符串拼接（无 `tailwind-merge`）。互斥的样式状态（如 `error` 边框、激活态字重）必须用三元表达式互斥输出，禁止同时输出两个同类 Tailwind 类指望后者覆盖前者。
2. **全局浮层在 H5 端必须走 Portal**：Taro H5 的 `.taro_page` 带有 `z-index: 0` 层叠上下文且 `.weui-tabbar` 为 `z-index: 500`。新增全屏模态或全局悬浮组件（类似 `Drawer`、`Dialog`、`ImagePreview`、`FloatCustomerService`）时，必须用 `src/components/ui/portal.ts` 的 `renderPortal()` 在 H5 端挂载到 `document.body`，层级设为 `z-[550]`~`z-[600]`（高于 TabBar `500`，低于系统 Toast/Modal `1000+`）。
3. **悬浮拖拽严禁使用 `MovableArea` / `MovableView`**：Taro H5 中其 Web Component 懒加载会导致首次挂载落到左上角 `(0, 0)`；统一采用纯 CSS `fixed` + `catchMove` + `onTouchStart`/`onTouchMove`。
4. **严禁在微信小程序原生 `<Input>` 上写 `display: flex`**：会破坏小程序原生 `<input>` 的 `text-align: right`。H5 端的 `Input`/`Textarea` 居中与透明背景已在 `src/app.css` 全局处理，组件内无需重复加 `flex`。
5. **自定义原生能力按钮**：如 `openType="chooseAvatar"` 包裹复杂图形时，优先使用原生 `TaroButton` 并清理 `m-0 p-0 bg-transparent after:border-0 overflow-visible`，避免 `ui/Button` 的固定高度与 `overflow-hidden` 裁剪角标。

---

## 5. 工程分层与接口规范

1. **单向清晰分层：`types/` → `services/` → `hooks/` → `pages/`**
   - `types/`：定义后端原始请求/响应类型与前端内部标准模型；
   - `services/`：**纯粹的接口声明清单**（一行一个 `http.get/post/put/delete`），不写业务逻辑或字段转换；
   - `hooks/`：负责数据翻译（Adapter）、状态编排、Store 更新、Loading/Toast 反馈与异常兜底；
   - `pages/`：纯 UI 渲染与交互，不感知后端原始字段差异。
2. **统一响应协议**：所有接口统一使用 `BaseResponse<T>`（`{ code, msg, data }`），分页数据统一放在 `data` 中使用 `PageData<T>`（`{ list, total, page, pageSize, hasMore? }`）。
3. **传参方式**：`GET` 用 Query，`POST`/`PUT` 业务接口一律用 Body `application/json`，仅文件上传使用 `multipart/form-data`（`http.upload`）。
4. **后台静默请求**：冷启动 Token 校验、静默微信登录、全局配置拉取等非用户主动触发的请求，必须传 `{ silent: true }`，避免失败时弹 Toast 或 401 Modal 打扰用户。
