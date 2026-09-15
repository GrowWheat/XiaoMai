---
title: "Markdown 文件包含"
published: 2026-08-28
description: "构建期的 Markdown 文件与片段包含。"
tags: [Markdown, XiaoMai]
category: 指南
draft: false
---

XiaoMai 可以包含一个本地 Markdown 文件，或其中一段安全的片段。

<!-- @include: src/content/snippets/include-example.md#public-api -->

完整文件与行范围形式同样受支持：

```markdown
<!-- @include: src/content/snippets/include-example.md -->
<!-- @include: src/content/snippets/include-example.md{1-4} -->
<!-- @include: src/content/snippets/include-example.md{5-} -->
<!-- @include: src/content/snippets/include-example.md{-4} -->
```

位于围栏代码内部的包含注释会保持原样。
