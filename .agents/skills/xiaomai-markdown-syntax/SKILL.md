---
name: xiaomai-markdown-syntax
description: "用 XiaoMai 自定义 Markdown 语法撰写内容——提示容器、代码树、选项组、步骤流、字段卡片、马克笔高亮、数学公式、Mermaid 图、图片画廊与尺寸、缩写释义、内容标注、剧透、文件包含与 GitHub 卡片。当撰写或编辑 Markdown/MDX 内容并选择正确语法时使用。"
---

# XiaoMai 自定义 Markdown 语法(作者向)

以下语法**开箱即用、自激活**:写进正文即可,无需 frontmatter 开关或配置;页面只加载实际用到的语法的 CSS/JS。机器可读的完整契约(pattern、参数、默认值、示例)以 `src/plugins/markdown/manifest.json` 为单一索引。普通 CommonMark/GFM 之外的所有自定义语法如下:

| 语法 | 写法 | 演示文章 |
|---|---|---|
| Field cards / 字段卡片 | `:::: field-group` + `::: field name`,配合 `@type`、`@default` 与必填态元数据 | `markdown-字段卡片.md` |
| 提示容器 | `:::tip[标题] ... :::` 或 `> [!NOTE]`,类型:`note/info/tip/important/warning/caution/details` | `提示框.md` |
| collapse-panels | `::: collapse [accordion] [expand]` 包裹无序列表,项首 `:+`/`:-` 控制开合 | `折叠面板.md` |
| 选项组(Tabs) | `::: tabs[#同步id]` + `@tab 标题#值`,值相同的组跨页同步 | `markdown-选项组.md` |
| 步骤流 | `:::steps{title start}` 包裹有序列表 | `markdown-步骤.md` |
| 代码树 | `:::code-tree{title height entry icon}` 内嵌多文件代码块,或 `@[code-tree](目录)` | `markdown-增强功能.md` |
| 文件树 | `:::file-tree{title icon}` 嵌套列表或 ```file-tree 围栏(tree 输出) | `markdown-增强功能.md` |
| 马克笔高亮 | `==内容==`,变体 `==...=={.error}`(`primary/secondary/tertiary/error/tip`) | `markdown-标记高亮.md` |
| 数学公式 | `$行内$` 与 `$$块级$$`(KaTeX) | `markdown-示例.md` |
| Mermaid 图 | ` ```mermaid ` 围栏,客户端按需主题化渲染 | `markdown-图表画廊.md` |
| 图片画廊 | `:::grid{columns="1..6" aspect="W/H" fit="cover\|contain"}` 包裹图片 | `image-grid-demo/` |
| 图片尺寸/图注 | `![说明 w-60%](src "图注")` | `markdown-剧透.md` |
| 缩写释义 | `*[SSR]: Server-Side Rendering` 定义行,悬停/聚焦/触屏出释义 | `markdown-缩写.md` |
| 内容标注 | 行内 `[+label]` 引用 + `[+label]:` 定义块,原生 Popover 展示 | `内容注释.md` |
| 行内剧透 | `:spoiler[内容]` | `markdown-扩展功能.md` |
| GitHub 卡片 | `::github{repo="owner/repo"}`,客户端按需取仓库元数据 | `markdown-扩展功能.md` |
| 文件包含 | `<!-- @include: 路径 -->`,支持 `{2-6}` 行范围与 `#region` | `markdown-文件包含.md` |
| 代码块元数据 | Expressive Code:`title`、`ins={2}`、`del={3-5}`、`collapse={4-8}`、`showLineNumbers`、`frame` 等 | `代码高亮示例.md` |

## Field Cards / 字段卡片

使用 `field-group` 容器来紧凑罗列 API 或配置参数。每个子 `field` 以一个名称开头，并可在其 Markdown 描述之前声明若干元数据行：

```md
:::: field-group

::: field title
@type string
@required

The visible title.
:::

::: field disabled
@type boolean
@default `false`
@optional

Whether the control is disabled.
:::

::::
```

支持的元数据为 `@name`、`@type`、`@default`、`@required`、`@optional`、`@deprecated` 和 `@description`。`field` 之后的字段名会作为 `@name` 的兜底值；元数据必须出现在第一个描述段落之前。其余 Markdown 会成为可见描述，因此允许使用链接、列表与行内代码。

当嵌套三冒号 `field` 块时,`field-group` 使用四冒号围栏。单个 `field` 也可不分组单独使用。未知或格式错误的 `@tags` 会原样保留为普通描述文本,而非被丢弃。渲染仅走 SSR:卡片不引入任何 JavaScript 或网络请求。

参考实现与可复制示例： `src/plugins/markdown/manifest.json` and `src/content/posts/markdown-字段卡片.md`.

## Bilibili 视频

使用 `::bilibili{bvid="BV..." title="..." p=1 preload="auto"}` 嵌入视频。`bvid` 和非空 `title` 必填，`p` 为可选正整数，`preload` 可选值为 `none` 或 `auto`。`auto` 会在视频接近视口时准备播放器，避免首屏一次性加载所有第三方资源；省略时保持点击后加载。首屏输出标题、播放按钮和 Bilibili 回退链接。非法输入保留为普通 Markdown。

## AcFun 视频

使用 `::acfun{acid="ac..." title="..." preload="auto"}` 嵌入视频。`acid` 必须是 `ac` 加正整数，`title` 必填；`preload` 可选值为 `none` 或 `auto`。`auto` 会在视频接近视口时准备播放器，省略时保持点击后加载。首屏输出标题、播放按钮和 AcFun 回退链接。非法输入保留为普通 Markdown。

## ArtPlayer 视频

使用 `::artplayer{src="/..." title="..." preload="auto"}` 输出原生视频控件。`src` 和非空 `title` 必填，来源仅接受站内根路径或显式 HTTPS 地址；`preload` 可选值为 `none` 或 `auto`，默认是 `none`。首版不加载 ArtPlayer npm 包或客户端模块，原生控件和源文件链接在无 JavaScript 时仍可用。

## YouTube 视频

使用 `::youtube{id="..." title="..." preload="auto"}` 嵌入视频。`id` 必须是严格的 11 字符 YouTube 视频 ID，`title` 必填；`preload` 可选值为 `none` 或 `auto`。`auto` 会在视频接近视口时准备 privacy-enhanced 播放器，省略时保持点击后加载。首屏输出标题、播放按钮和 YouTube 回退链接。非法输入保留为普通 Markdown。

## 使用要点

- 大多数语法对**非法或残缺输入回退为普通 Markdown** 并保留原文,不会静默改写;
- `abbreviation` 与 `content-annotation` 的定义只在当前文章内生效;
- `:::details` 折叠是纯原生 `<details>`,无 JS;tabs/code-tree 等交互增强在脚本失败时正文仍完整可读;
- 加密文章的语法增强(如 mermaid)在解密后会正确初始化,无需额外处理;
- 内联 `w-N%` 是 alt 中的宽度令牌(1–100),越界值保留原文。

## Audio Reader 音频

使用 `:audio-reader[标题]{src="/..."}` 插入紧凑的行内朗读按钮。指令标签和 `src` 均为必填项；来源仅接受站内根路径或显式 HTTPS 地址。标签只作为纯文本显示，隐藏的原生音频元素使用 `preload="none"`，仅在点击扬声器按钮后开始加载。

## 必读文档

- `src/plugins/markdown/manifest.json` — 每种语法的 forms/attributes/示例/运行时成本(单一真源)
- `docs/markdown-syntax-manifest.md` — 清单字段与状态含义(stable/legacy/deprecated)
- `src/content/posts/` — 上述演示文章,均含可复制示例
