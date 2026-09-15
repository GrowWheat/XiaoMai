---
version: alpha
name: XiaoMai
description: 一个基于 Material 3 Expressive 的、柔和且带有动漫气质的个人博客。
colors:
  primary: "oklch(42% 0.16 315)"
  secondary: "oklch(52% 0.13 20)"
  tertiary: "oklch(50% 0.12 215)"
  surface: "oklch(96% 0.012 315)"
  surface-container-low: "oklch(96.5% 0.01 315)"
  surface-container: "oklch(94% 0.015 315)"
  surface-container-high: "oklch(92% 0.02 315)"
  on-surface: "oklch(16% 0.02 315)"
  on-surface-variant: "oklch(34% 0.03 315)"
  outline: "oklch(45% 0.03 315)"
  outline-variant: "oklch(76% 0.02 315)"
  error: "oklch(57% 0.21 27)"
  on-primary: "oklch(99% 0.02 315)"
typography:
  display:
    fontFamily: "var(--font-sans)"
    fontSize: 2.75rem
    fontWeight: 700
    lineHeight: 1.18
  headline:
    fontFamily: "var(--font-sans)"
    fontSize: 1.5rem
    fontWeight: 500
    lineHeight: 1.33
  title:
    fontFamily: "var(--font-sans)"
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "var(--font-sans)"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "var(--font-sans)"
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.33
  label:
    fontFamily: "var(--font-sans)"
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.43
  code:
    fontFamily: "var(--font-mono)"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 28px
  full: 999px
spacing:
  unit: 4px
  compact: 8px
  control: 12px
  section: 24px
  content: 32px
  page: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.control}"
  button-tonal:
    backgroundColor: "var(--secondary-container)"
    textColor: "var(--on-secondary-container)"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.control}"
  card:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section}"
  input:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.control}"
  state-layer:
    backgroundColor: "color-mix(in oklab, var(--on-surface) 8%, transparent)"
  code-block:
    backgroundColor: "var(--codeblock-bg)"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: "{spacing.section}"
---

## 概述

XiaoMai 是一个将阅读视为首要交互的个人动漫博客。其视觉语言是**柔和的 Material 编辑风**：既有足够个性以体现表达力，又足够克制以让长文写作保持舒适。Material 3 Expressive 提供了交互语法，而动漫气息则来自所选壁纸、动态色调、圆角几何与排版，而非来自装饰性的 UI 外观。

界面应当在首次访问时令人感到安静，在再次访问时令人感到高效。读者应当能够识别当前页面、浏览文章元数据、打开一篇文章，并在无需学习新操控语言的情况下回到导航。

上方的令牌记录的是运行时 CSS 变量，而非用固定的品牌色去替换它们。HCT 动态配色是有意为之：配置好的种子色相、风格、色彩规范，以及浅色/深色模式，会在浏览器中生成最终的调色板。

## 颜色

调色板是一套色调化的表面系统，而非固定的色板集合。

- **Primary（主色）** 驱动当前页面、主要操作、链接、进度，以及帮助读者定位自己的微小强调。
- **Secondary（次色）** 提供选择与分组状态，例如色调芯片、标签页、筛选器与导航指示器。
- **Tertiary（第三色）** 是面向表达性内容与语义区分的辅助强调，不应与主阅读路径相争。
- **Surface（表面）** 及其各容器层级通过色调提升来建立纵深。内容表面应当与页面背景区分开，但不应看起来像一堆漂浮的营销卡片。
- **On-surface（表面文字色）** 是默认的阅读色。**On-surface-variant（表面变体文字色）** 保留给元数据、辅助文本与次级控件。
- **Error（错误色）** 保留给失败操作、校验、受保护内容错误，以及其他需要引起注意的状态。

切勿用硬编码的黑色、白色或品牌十六进制取值替换语义令牌。应用中唯一允许的固定颜色，是叠加在内容图片之上、且必须在任意图像上保持对比度稳定的场景。

## 排版

排版友好且易读，为散文配置 body（正文）角色，为中日韩文本配置 CJK 角色，为代码配置 mono（等宽）角色。默认搭配为：拉丁 UI 文本使用 Outfit，CJK 文本使用 Yozai Medium，代码使用 JetBrains Mono。

- **Display（展示）** 仅用于首页横幅与主要页面标识。它不得渗入紧凑面板、侧边栏或工具型控件。
- **Headline（标题）** 以适度的字号差异建立文章与页面的层级。XiaoMai 偏好节奏感与可读的行宽，而非过大的宣传式字号。
- **Title（题名）** 用于卡片与区块标题。
- **Body（正文）** 是默认的长文阅读样式。保持宽松的行高，并避免在散文中使用密集的全大写处理。
- **Label（标签）** 用于控件、元数据、筛选器与导航。它应当保持可被快速扫读，同时视觉上不至于比文章标题更喧闹。
- **Code（代码）** 使用 mono 角色，并通过表面处理与间距——而非过度的颜色——来保持视觉区分。

不要为某个孤立组件引入新的字族。字体角色集中配置，并在生产构建期间进行子集化。

## 布局

XiaoMai 采用响应式阅读框架。在小屏幕上，内容变为单一的纵向流，导航与侧边栏小部件环绕文章堆叠。在桌面上，主要内容与持久侧边栏搭配；可选的双栏排布仅在第二列包含已启用小部件时，才扩展为三栏框架。

横幅与顶部应用栏构成站点的标识层。其下方的文章或页面内容始终保持视觉优先。主阅读栏绝不应被装饰性元素挤压，页面应在首个视口之下保留可见的内容延续。

间距遵循 4px 基准网格。组件内边距与间隙请使用具名的 M3E 间距变量。列与页面宽度请使用响应式布局工具类，而不要在各组件中临时添加断点取值。

## 高度与纵深

纵深首先来自色调提升，其次来自阴影。表面容器层级是分隔页面、卡片、浮动面板、导航与瞬时反馈的主要方式。M3E 高度令牌仅在某个元素确实需要与周围环境产生物理分离时，才提供相应的阴影。

- 页面背景：`--page-bg`。
- 内容与卡片表面：`--card-bg` 或恰当的 surface container 令牌。
- 浮动面板：`--float-panel-bg` 搭配对应的 M3E 高度层级。
- Snackbar（提示条）与反向反馈：反向表面角色。

避免玻璃拟态、重度模糊、无谓的发光与层叠卡片。卡片是真正被框定的重复项或工具，而非每个区块的默认包裹层。当某个区块需要层级时，请优先使用留白、标题、分隔线或色调变化。

## 形状

XiaoMai 使用一种圆润但有节制的形状语言。按钮、输入框与常规控件使用 `--shape-corner-m`；卡片使用 `--shape-corner-l`；对话框与大面板使用 `--shape-corner-xl`；芯片与选中指示器使用 `--shape-corner-full`。形状契约是组件 API 的一部分，不应以任意圆角取值绕过。

圆角几何支撑了动漫博客的个性，但它不会把每个元素都变成胶囊。请将全圆角保留给芯片、开关、指示器、头像，以及语义上要求紧凑胶囊的控件。

## 组件

组件被组织为 atoms（原子）、molecules（分子）、organisms（有机体）、layouts（布局）与 pages（页面）。依赖自下而上流动：atoms 消费令牌，molecules 组合 atoms，organisms 持有业务状态与路由同步，layouts 持有页面骨架，pages 塑造路由数据。

在创建新组件之前，请使用既有的 M3E 组件。交互反馈属于 `.m3-state-layer`，它规范化了悬停、聚焦与按压叠加层，以及 focus-visible 轮廓。交互控件必须保留原生的键盘与语义行为。

- **顶部应用栏与导航：** 使用持久外壳组件。依赖于路由的外壳状态必须通过 Swup 生命周期事件进行同步。
- **文章卡片与文章正文：** 保持文章标题、元数据、封面与入口操作各自可独立访问。不要将包含链接的卡片再包裹进另一个链接。
- **侧边栏小部件：** 保持数据驱动，并遵守页面筛选。被禁用的可选小部件不输出任何 DOM、不发起网络请求、不增加主包依赖。
- **表单与浮层：** 使用既有的 TextField、Select、Dialog、Sheet、Snackbar 与 Tooltip 原语，及其令牌化的聚焦、动效与形状行为。
- **媒体：** 真实的内容图片才是视觉信号。当读者需要查看主体时，不要使用变暗或抽象的图片。

## 该做与不该做

- **该做** 让阅读路径清晰可见：页面标识、内容、元数据、导航。
- **该做** 为静态内容保留 SSR 输出，仅对需要浏览器的行为进行水合。
- **该做** 尊重 `prefers-reduced-motion` 与项目动效令牌。
- **该做** 让可选集成在禁用时真正可选、零负担。
- **该做** 对所有语言模块中的面向用户组件文案都使用 i18n 键。
- **该做** 让动态 HCT 配色遵循所配置的色彩与浅色/深色模式。
- **不该做** 为普通博客页面添加营销风格的 hero（首屏）区块。
- **不该做** 将渐变、装饰性色块、玻璃拟态或重度阴影用作默认视觉语言。
- **不该做** 在组件中硬编码颜色、圆角、排版、断点或动画时长。
- **不该做** 创建嵌套卡片，或将卡片用作通用的页面区块包裹层。
- **不该做** 在缺少其禁用、聚焦、键盘、加载与减弱动效行为（在适用时）的情况下添加交互。
- **不该做** 引入新的组件层、反向依赖，或路由拥有的持久化捷径。
