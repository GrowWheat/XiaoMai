---
title: "XiaoMai Markdown 增强功能"
published: 2026-08-19
pinned: true
description: "探索 XiaoMai 的自定义 Markdown 扩展、表现力组件与写作语法。"
tags: [演示, Markdown, 扩展, 主题, XiaoMai]
category: 指南
lang: zh-CN
draft: false
---

XiaoMai 提供了一系列主题专属的 Markdown 扩展与自定义语法容器。基于我们原生的 unified AST 处理管线构建，所有扩展在站点构建时即渲染为无障碍、语义化的 HTML，具备**零客户端 JavaScript 水合开销**与 **100% M3E 设计令牌对齐**。

## 文件树

文件树可将多层项目结构、源码层级与终端目录输出，转换为紧凑、可交互的树状视图，带有自动扩展名图标、差异高亮与可折叠分支。

### 1. 嵌套列表语法（`:::file-tree`）

当直接以 Markdown 嵌套列表的形式书写文件层级时，使用 `:::file-tree` 块指令。

```markdown
:::file-tree{title="XiaoMai source tree"}
- src
  - components/
    - ++ Navigation.svelte # added component
    - -- Button.astro # removed component
  - content
    - posts/
      - markdown-增强功能.md
  - layouts/
    - PostLayout.astro
  - plugins
    - markdown/
      - rehype-file-tree.mjs
  - styles
    - markdown/
      - trees.css
  - **content.config.ts** # important file
- public/
  - favicon.svg
- package.json
:::
```

:::file-tree{title="XiaoMai 源码树"}
- src
  - components/
    - ++ Navigation.svelte # added component
    - -- Button.astro # removed component
  - content
    - posts/
      - markdown-增强功能.md
  - layouts/
    - PostLayout.astro
  - plugins
    - markdown/
      - rehype-file-tree.mjs
  - styles
    - markdown/
      - trees.css
  - **content.config.ts** # important file
- public/
  - favicon.svg
- package.json
:::

#### 写作规则与标记

- **差异状态**：在条目前加 `++`（绿色背景与徽标）或 `--`（红色背景与删除线）以突出改动。
- **注释**：`#` 之后的任意文本会渲染为弱化的、右对齐行内注释。
- **强调**：用 `**粗体**` 包裹名称，让关键文件获得醒目的视觉权重。
- **可折叠文件夹**：由嵌套列表项推断出的目录默认展开。添加末尾斜杠（例如 `components/`）可创建一个折叠目录，读者可通过点击或键盘导航展开。

---

### 2. 终端输出语法（```` ```file-tree ````）

当你已经有用 `tree` 等命令行工具生成的目录树文本时，可直接粘贴进 `file-tree` 围栏代码块。Unicode 分支字符（`├──`、`└──`、`│`）与 ASCII 分支都会被自动解析。

````markdown
```file-tree title="Build output" icon="simple"
dist
├── _astro/
│   ├── index.css
│   └── page.js
└── favicon.ico
```
````

```file-tree title="构建输出" icon="simple"
dist
├── _astro/
│   ├── index.css
│   └── page.js
└── favicon.ico
```

#### 配置选项

- `title="string"`：为树设置自定义标题与无障碍标签。
- `icon="colored" | "simple"`：在多彩扩展图标（`colored`，默认）与极简单色图标（`simple`）之间选择。

---

## 代码树

交互式代码树将左侧的多级文件层级导航面板与右侧的即时代码面板切换配对。它们为多文件示例、模块或整个目录的导读提供了类似 IDE 的阅读体验。

### 1. 容器语法（`:::code-tree`）

在 `:::code-tree` 块指令中组合多个围栏代码块。每个代码块通过 `title="path/to/file"` 指定其路径。

````markdown
:::code-tree{title="XiaoMai Component Demo" height="380px" entry="src/Button.svelte"}
```svelte title="src/Button.svelte"
<script lang="ts">
  let { label = "Click me" } = $props();
</script>

<button class="m3-btn">{label}</button>
```

```stylus title="src/styles/button.styl"
.m3-btn
  background: var(--primary)
  color: var(--on-primary)
  border-radius: var(--shape-corner-m)
```

```json title="package.json"
{
  "name": "button-demo",
  "version": "1.0.0"
}
```
:::
````

:::code-tree{title="XiaoMai 组件演示" height="380px" entry="src/Button.svelte"}
```svelte title="src/Button.svelte"
<script lang="ts">
  let { label = "Click me" } = $props();
</script>

<button class="m3-btn">{label}</button>
```

```stylus title="src/styles/button.styl"
.m3-btn
  background: var(--primary)
  color: var(--on-primary)
  border-radius: var(--shape-corner-m)
```

```json title="package.json"
{
  "name": "button-demo",
  "version": "1.0.0"
}
```
:::

#### 配置与标记

- `title="string"`：为代码树设置标题与无障碍标签。
- `height="string"`：设置桌面视图的高度（默认 `420px`，例如 `380px`、`26rem`）。
- `entry="filepath"`：指定首次加载时处于激活状态的文件。
- `icon="colored" | "simple"`：在彩色或极简单色文件图标之间切换。
- `:active`：在任意围栏代码块上放置 `:active`，将其指定为默认激活标签页。

---

### 2. 本地目录自动导入（`@[code-tree]`）

直接指向工作区中的任意本地目录路径，即可在构建时自动扫描并生成交互式代码树，无需手动复制文件内容。

```markdown
@[code-tree title="代码树工具" entry="code-tree.ts"](/src/utils)
```

@[code-tree title="站点配置" entry="siteConfig.ts"](/src/config)
