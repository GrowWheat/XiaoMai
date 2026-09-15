---
title: Markdown 选项组
published: 2026-08-28
description: 以紧凑、同步的 M3E 选项组呈现相关的 Markdown 备选方案。
tags: [演示, Markdown, 选项卡, XiaoMai]
category: 指南
lang: zh-CN
draft: false
---

选项组把等价的操作说明放在一起，而无需重复周围的解释。每个选项都接受完整的块级 Markdown，而所选的值还能与同一页面上的另一个组同步。

## 选择包管理器

使用 `@tab:active` 选择初始选项。`#` 后面的后缀提供一个稳定值，而不改变可见标题。

::: tabs#package-manager

@tab npm

使用 npm 安装该包：

```powershell
npm install astro
```

@tab:active **pnpm**#pnpm

使用 pnpm 安装该包：

```powershell
pnpm.cmd add astro
```

@tab Bun#bun

使用 Bun 安装该包：

```powershell
bun add astro
```

:::

## 运行项目

这个组共享 `package-manager` 这个 id。在上面选择一个选项会更新下方匹配的命令，并在下次访问时记住该选择。

::: tabs#package-manager

@tab npm

```powershell
npm run dev
```

@tab pnpm

```powershell
pnpm.cmd dev
```

@tab Bun#bun

```powershell
bun run dev
```

:::

## 多种备选方案

较长的选项行保持在一行内，并在窄屏时于自身导航区域内滚动。

::: tabs

@tab 本地工作站

开发某个功能时，使用本地工具链。

@tab 托管预览环境

发布一个临时预览供审阅。

@tab 持续集成

针对每一次变更运行确定性校验。

@tab 生产部署

将经验证的产物提升到生产环境。

@tab 离线恢复流程

当网络不可用时，从本地产物恢复。

:::

## 编写语法

````markdown
::: tabs#package-manager

@tab npm

Use npm instructions here.

@tab:active **pnpm**#pnpm

Use pnpm instructions here.

:::
````

每个组至少需要两个 `@tab` 区块，且每个区块都需要有与标记之间以空行分隔的正文内容。无效或不完整的组会作为普通 Markdown 保持可读。
