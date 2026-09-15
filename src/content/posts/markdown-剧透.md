---
title: Markdown 剧透
published: 2026-08-28
description: 在隐藏行内答案的同时，保持剧透内容在 XiaoMai Markdown 中可被访问。
tags: [演示, Markdown, 无障碍, XiaoMai]
category: 指南
lang: zh-CN
draft: false
---

剧透用于隐藏一个简短的答案或情节细节，同时不将其从文档中移除。悬停、聚焦或激活原生控件即可揭示内容。

## 行内细节

答案是 :spoiler[**42**]，而这句话在其周围保持为普通 Markdown。

剧透可以包含 `行内代码` 以及 :spoiler[一条带 **强调** 的更长细节]。

## 编写语法

```markdown
The answer is :spoiler[42].
```

生成的 HTML 使用一个带有 `aria-expanded` 状态的原生按钮。即使没有 JavaScript，悬停和聚焦仍能揭示文字；可选的运行时额外提供点击与键盘切换。
