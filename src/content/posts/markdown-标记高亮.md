---
title: Markdown 标记高亮
published: 2026-08-28
description: 在 XiaoMai Markdown 中使用标记驱动的 marker 语法高亮关键短语。
tags: [演示, Markdown, 排版, XiaoMai]
category: 指南
lang: zh-CN
draft: false
---

标记高亮用于突出某个特定短语，而不会把周围的段落变成一个独立组件。它们在构建时渲染为原生的 `<mark>` 元素，并继承当前活动的 M3E 配色系统。

## 默认强调

当强调应由文章的主色承担时，使用 `==text==`。这对于 ==读者应当记住的一个决定== 很有用，同时他们可以继续阅读普通段落。

标记中可以包含 ==嵌套的 **Markdown 强调**==，当短语需要更强的层级时。

## 语义化颜色

当含义需要不同的色调角色时，使用后缀。可用的变体有 `primary`、`secondary`、`tertiary`、`error` 和 `tip`。

- ==主色将短语连接到当前主题=={.primary}
- ==次色让一个支撑性的区分保持低调=={.secondary}
- ==第三色添加一种独立的编辑信号=={.tertiary}
- ==错误色标识需要修正的状况=={.error}
- ==提示色突出实用建议=={.tip}

## 编写语法

```markdown
==Primary marker==

==Secondary marker=={.secondary}
==Tertiary marker=={.tertiary}
==Error marker=={.error}
==Tip marker=={.tip}
```

诸如 `==literal marker syntax==` 这样的行内代码以及围栏示例会保持原样，因此文档可以解释该语法而不触发它。
