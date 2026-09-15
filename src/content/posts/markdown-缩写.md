---
title: Markdown 缩写
published: 2026-08-28
description: 一次性定义常用缩写，并在普通文章正文中保留其完整含义。
tags: [演示, Markdown, 排版, XiaoMai]
category: 指南
lang: zh-CN
draft: false
---

缩写让技术写作保持紧凑，同时为需要完整术语的读者保留其全称。被定义的术语会渲染为原生的 `abbr` 元素，其含义可在悬停时查看，也能被辅助技术读取。

## 在语境中

SSR 优先（SSR-first）的输出会在 JavaScript 运行前就让初始文档可见。在衡量其阅读体验时，LCP 和 CLS 能揭示首屏可见内容是否足够快且稳定。

缩写也可以出现在 **SSR** 这类普通 Markdown 旁边，但诸如 `SSR` 这样的字面代码以及像 [LCP 文档](https://web.dev/articles/lcp) 这样的链接不会被改动。

## 定义术语

将定义放在同一篇 Markdown 文档的任意位置。它们不会作为可见段落渲染，只有该文章中匹配的术语才会获得语义化的缩写处理。

```markdown
*[SSR]: Server-Side Rendering
*[LCP]: Largest Contentful Paint
*[CLS]: Cumulative Layout Shift

SSR makes an HTML response available before client code runs.
```

*[SSR]: 服务端渲染（Server-Side Rendering）
*[LCP]: 最大内容绘制（Largest Contentful Paint）
*[CLS]: 累积布局偏移（Cumulative Layout Shift）

## 编写边界

术语必须以字母或数字开头，可包含字母、数字、句点、下划线、加号和连字符。每个定义仅适用于当前文章；无效或重复的定义会保持为普通 Markdown，而不会静默替换另一个术语。
