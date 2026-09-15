---
title: "Mermaid 图表画廊"
published: 2026-05-02
description: "汇集 Mermaid 图表，涵盖流程、交互、数据模型、排期与项目历程的示例画廊。"
tags: [演示, 示例, Markdown, Mermaid]
category: 示例
lang: zh-CN
draft: false
---

Mermaid 能将 Markdown 中的文字描述转换为图表。下面的示例借助 XiaoMai 的内容工作流，演示技术文章与项目笔记中常用的图表类型。

## 流程图

流程图用于描述一个过程，包括判断分支以及回到较早步骤的路径。

```mermaid
flowchart TD
    accTitle: 文章发布工作流
    accDescr: 文章经过撰写、校验、预览与构建后发布。校验失败会退回修订。
    Draft[撰写 Markdown] --> Check{校验是否通过？}
    Check -->|否| Revise[修订文章]
    Revise --> Check
    Check -->|是| Preview[本地预览]
    Preview --> Build[构建静态页面]
    Build --> Publish[发布]
```

## 时序图

时序图按时间顺序呈现参与者之间的协作。本例跟踪一次从请求到 Mermaid 渲染的 Swup 导航。

```mermaid
sequenceDiagram
    accTitle: 站内导航后的图表渲染
    accDescr: 读者发起导航，Swup 替换文章内容，Mermaid 渲染器在新页面上增强图表。
    actor Reader
    participant Browser
    participant Swup
    participant Content as 文章区域
    participant Renderer as Mermaid 渲染器
    Reader->>Browser: 打开另一篇文章
    Browser->>Swup: 发起站内导航
    Swup->>Content: 替换页面内容
    Swup-->>Renderer: Emit content:replace
    Renderer->>Content: 查找 Mermaid 容器
    Renderer-->>Browser: 插入主题化 SVG
```

## 实体关系图

实体关系图用于建模结构化数据，以及作者、文章、标签与评论之间的关联。

```mermaid
erDiagram
    accTitle: 博客内容关系
    accDescr: 作者撰写文章，文章收到评论，连接记录将文章关联到多个标签。
    AUTHOR ||--o{ POST : 写入
    POST ||--o{ COMMENT : 收到
    POST ||--o{ POST_TAG : 归类于
    TAG ||--o{ POST_TAG : 分组
    AUTHOR {
        string id PK
        string display_name
    }
    POST {
        string slug PK
        string title
        datetime published_at
        string author_id FK
    }
    COMMENT {
        string id PK
        string post_slug FK
        string body
    }
    TAG {
        string id PK
        string label
    }
    POST_TAG {
        string post_slug FK
        string tag_id FK
    }
```

## 类图

类图用于表达软件设计中的职责、公共方法以及依赖方向。

```mermaid
classDiagram
    accTitle: Markdown 渲染模块
    accDescr: 内容管线使用 Mermaid 插件生成回退标记，随后客户端渲染器将其增强为 SVG。
    class ContentPipeline {
        +render(markdown)
        +collectMetadata()
    }
    class MermaidPlugin {
        +transform(codeFence)
        +createFallback()
    }
    class DiagramRenderer {
        +initialize()
        +renderAll()
        +refreshTheme()
    }
    class ThemeTokens {
        +primary
        +surface
        +outline
    }
    ContentPipeline --> MermaidPlugin : 使用
    DiagramRenderer --> MermaidPlugin : 增强输出
    DiagramRenderer --> ThemeTokens : 读取
```

## 状态图

状态图展示对象的生命周期，以及推动其在各状态间跃迁的事件。

```mermaid
stateDiagram-v2
    accTitle: 文章生命周期
    accDescr: 文章从draft经评审到发布，可能退回修订，最终归档。
    [*] --> Draft
    Draft --> InReview : 提交
    InReview --> Draft : 请求修改
    InReview --> Published : 批准
    Published --> Draft : 撤回
    Published --> Archived : 归档
    Archived --> [*]
```

## XY 图表

XY 图表结合柱状与折线，在同一坐标轴上比较数值与趋势。

```mermaid
xychart-beta
    accTitle: 六周内容表现
    accDescr: 柱形展示归一化的每周发布量，折线展示归一化的阅读完成度。
    title "六周内容表现"
    x-axis "周" [1, 2, 3, 4, 5, 6]
    y-axis "相对得分" 0 --> 100
    bar [36, 52, 44, 68, 76, 84]
    line [48, 55, 62, 61, 73, 81]
```

## 饼图

饼图以紧凑方式比较各分类在整体中所占的比重。

```mermaid
pie showData
    accTitle: 文章主题占比
    accDescr: 工程占四成，设计系统占两成五，其余由指南与随笔分摊。
    title 文章主题占比
    "工程" : 40
    "设计系统" : 25
    "指南" : 20
    "随笔" : 15
```

## 甘特图

甘特图沿日历时间线排布任务、依赖关系与里程碑。

```mermaid
gantt
    accTitle: 主题发布计划
    accDescr: 发布计划从需求与交互设计，经组件开发、测试，直至发布。
    title 主题发布计划
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    section 设计
    Confirm requirements :done, brief, 2024-05-06, 2d
    Refine interactions :done, interaction, after brief, 3d
    section 实现
    Develop components :active, components, after interaction, 6d
    Write examples :examples, after interaction, 4d
    section 验证
    Automated tests :tests, after components, 3d
    Release :milestone, release, after tests, 0d
```

## 思维导图

思维导图将一个中心主题展开为相关领域与支撑概念。

```mermaid
mindmap
  root((XiaoMai))
    Content experience
      Markdown
      Search
      Diagrams
    Interface system
      M3E tokens
      Responsive layout
      Color schemes
    Engineering quality
      Astro Check
      Playwright
      Accessibility
```

## 时间线

时间线用于概括重要事件或阶段，无需给出精确的日历时长。

```mermaid
timeline
    title Mermaid 支持演进
    管线设计 : 检测 Mermaid 围栏
                    : 保留源码回退
    客户端增强 : 按需加载运行时
                       : 应用主题令牌
    可靠性 : 支持 Swup 导航
                : 校验响应式与无障碍输出
```

## 用户旅程图

用户旅程图结合任务各阶段中的操作、参与者与体验评分。

```mermaid
journey
    accTitle: 读者理解技术文章
    accDescr: 读者发现文章，将正文与图表结合以理解内容，随后探索相关主题。
    title 读者理解技术文章
    section 发现
      Browse the article list: 4: Reader
      Choose a topic: 5: Reader
    section 理解
      Read the article: 4: Reader
      Inspect a relationship diagram: 5: Reader
    section 续读
      Open a related article: 4: Reader
      Bookmark the page: 3: Reader
```

## Git 图

Git 图展示功能分支在合并回主线之前的工作推进过程。

```mermaid
gitGraph
    accTitle: Mermaid 特性分支历史
    accDescr: 特性分支在合并回主分支发布之前，新增渲染器与测试。
    commit id: "base"
    branch mermaid
    checkout mermaid
    commit id: "add-renderer"
    commit id: "add-tests"
    checkout main
    merge mermaid id: "merge-mermaid"
    commit id: "release"
```

## 看板

看板按工作流状态对任务分组，便于快速浏览当前进度。

```mermaid
kanban
  backlog[待办]
    docs[撰写作者文档]
    examples[扩充示例数据]
  active[进行中]
    themes[验证主题适配]
  complete[已完成]
    fallback[源码回退]
    rendering[客户端渲染]
```

## 桑基图

桑基图用连线宽度表示流量或其他数量在节点之间的流动。

```mermaid
sankey-beta
Landing,Reading,720
Discovery,Reading,430
Reading,Explore,360
Reading,Topic,210
Reading,External,140
```

每个示例都使用标准的 `mermaid` 代码围栏。服务端会保留可读的源码标记，浏览器则将其增强为遵循当前主题的 SVG。当主题切换或 Swup 导航到本文时，图表会重新渲染。
