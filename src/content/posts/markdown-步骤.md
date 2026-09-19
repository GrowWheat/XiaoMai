---
title: Markdown 步骤
published: 2026-08-27
description: 在 XiaoMai 中以紧凑、无障碍的步骤流呈现顺序化操作说明。
tags: [演示, Markdown, 步骤, XiaoMai]
category: 指南
lang: zh-CN
draft: false
---

当操作的顺序很重要时，使用 Steps 组件。该组件保持文章的阅读流不被打断：一条安静的编号轨道提供定位，而标题、段落、链接、列表和代码仍保留其原生的 Markdown 角色。

## 有序列表语法

将一个 Markdown 有序列表包裹在 `:::steps` 容器中。每个顶层列表项成为一步。

````markdown
:::steps[Production deployment]
1. **Clone and prepare the workspace**

   Clone the repository and enter the project directory.

   ```powershell
   git clone https://github.com/GrowWheat/XiaoMai.git
   Set-Location XiaoMai
   ```

2. **Install dependencies**

   Use the repository's pinned package manager.

   ```powershell
   pnpm.cmd install
   ```

3. **Run project checks**

   Confirm Astro diagnostics and TypeScript checks pass.

   ```powershell
   npx.cmd astro check
   pnpm.cmd type-check
   ```

4. **Build the production site**

   Generate the static site and search index.

   ```powershell
   pnpm.cmd build
   ```
:::
````

:::steps[生产部署]
1. **克隆并准备工作区**

   克隆仓库并进入项目目录。

   ```powershell
   git clone https://github.com/GrowWheat/XiaoMai.git
   Set-Location XiaoMai
   ```

2. **安装依赖**

   使用仓库锁定的包管理器。

   ```powershell
   pnpm.cmd install
   ```

3. **运行项目检查**

   确认 Astro 诊断与 TypeScript 检查通过。

   ```powershell
   npx.cmd astro check
   pnpm.cmd type-check
   ```

4. **构建生产站点**

   生成静态站点与搜索索引。

   ```powershell
   pnpm.cmd build
   ```
:::

## 选项

- `:::steps[标题]` 或 `title="标题"` 会添加可见标签与无障碍名称。
- `start=4` 改变首个显示的步号。
- 容器必须恰好包含一个有序列表。无效或混合的输入会保持为普通可读的 Markdown，而不会被启发式地解释。
- 渲染在站点构建阶段完成，不引入任何客户端 JavaScript 或网络请求。
