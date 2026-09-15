# 上下文菜单（Context Menu）系统

本文档是可选的桌面端上下文菜单增强的项目契约。它描述了未来如何新增一个动作，以及一个作用于 Markdown 渲染内容的动作该如何与 Markdown 管线协同。

## 当前版本

第一版暴露三个扁平的动作：

| Action id | Visible label | Availability | Effect |
| --- | --- | --- | --- |
| `copySelection` | `copy` | 存在与点击元素相交的非空文本选区 | 复制普通选中的文本 |
| `backToTop` | `backToTop` | 页面已发生滚动 | 将文档滚动至顶部 |
| `sharePageLink` | `copyLink` | 在允许的页面上始终可用 | 复制 `window.location.href`，与 `#copy-post-link` 行为完全一致 |

`sharePageLink` 作为配置 id 保留，以兼容旧配置。其行为刻意设计为复制链接行为，而非 `navigator.share()` 行为。

该增强仅在 `contextMenuConfig.enable` 为 true 时才会渲染。调用方可以将其关闭，从而从页面中移除该有机体（organism）、它的监听器以及它的客户端 bundle。

## 源文件映射（Source Map）

| Responsibility | Source |
| --- | --- |
| 公开配置 | `src/config/contextMenuConfig.ts` |
| 动作 id 契约 | `src/types/contextMenuConfig.ts` |
| 菜单有机体（organism）与事件生命周期 | `src/components/organisms/ContextMenu.svelte` |
| 布局挂载与 `client:load` 边界 | `src/layouts/MainGridLayout.astro` |
| 共享的页面链接复制行为 | `src/utils/copy-page-link.ts` |
| 面向用户的标签文案 | `src/i18n/i18nKey.ts` 与全部十个 locale 模块 |
| Markdown 特性注册表 | `src/plugins/markdown/manifest.json` |
| Markdown 运行时加载 | `docs/markdown-on-demand-loading.md` |

## 新增菜单动作

请按以下顺序新增一个动作：

1. 在 `src/types/contextMenuConfig.ts` 中扩展 `ContextMenuAction`。
2. 仅当该动作属于产品默认能力时，才把默认 id 加入 `contextMenuConfig.actions`。该数组应始终代表由用户控制的展示顺序。
3. 在全部十个 locale 模块中新增一个 i18n key 及其翻译。菜单中绝不可出现硬编码的 UI 文案。
4. 把图标加入 `ContextMenu.svelte` 的 `icons` 映射。请使用 `src/generated/local-icon-collections.ts` 已覆盖的本地图标名；引入新的图标名时运行 `pnpm.cmd icons:generate`。
5. 把该动作的可用性规则加入 `availableActions()`。一个没有有效目标的动作，不得渲染出看起来像被禁用的行。
6. 在 `run()` 中加入最小化的处理分支。路由状态、浏览器 API 与 Swup 生命周期相关逻辑应留在有机体（organism）或一个显式命名的工具中。
7. 新增一条聚焦的 Playwright 断言，覆盖顺序、可见性、键盘行为、效果以及禁用配置。运行 `npx.cmd astro check` 以及相关的站点测试。

不要为一级动作新增嵌套子菜单。若某个动作后续需要子项，请在改动扁平的 v1 API 之前，先设计一套独立的 M3E 菜单契约与测试。

## 与 Markdown 的协同

上下文菜单是一个页面级有机体（organism）。Markdown 插件负责解析及其所生成的语义化 DOM；它们不会 import 或调用 `ContextMenu.svelte`。这种分离使得写作语法在没有 JavaScript 时依然可用，也让 Markdown 的按需加载（on-demand loading）由内容驱动。

当某个动作作用于 Markdown 特性时，请通过一套稳定的 DOM 能力契约（capability contract）来协同：

1. remark/rehype 实现需输出一个语义化的特性根节点，例如 `data-md-feature="code-tree"`，以及该动作所需的任何状态属性。
2. `ContextMenu.svelte` 从上下文菜单的目标元素向上捕获最近的特性根节点。它不会扫描整个文档，也不会从某个插件私有的类名推断出特性。
3. 仅当该根节点暴露出所需能力时，该动作才会被纳入。普通段落、没有树根节点的代码块，或没有该语法的页面，都会让该动作保持不出现。
4. 该动作应委派给该特性已有的运行时工具，或在该根节点上派发一个带命名空间的事件。它不得重复实现树解析、状态存储或 Markdown 语法规则。
5. 当可选的上下文菜单被禁用、或其运行时脚本失败时，该特性仍须保持完全可读、可用。

对于未来可能出现的 code-tree（代码树）动作，契约应当如下：

```html
<section
  data-md-feature="code-tree"
  data-code-tree-state="collapsed"
>
  ...
</section>
```

菜单随后可仅针对最近的 code-tree 根节点暴露 `expandCodeTree` 或 `collapseCodeTree`，并调用该根节点对应的 code-tree 控制器。Markdown 清单（manifest）始终是语法、实现、运行时模块、样式与测试的唯一真相来源（source of truth）；上下文菜单文档仅定义集成边界。

不要在文章中使用仅服务于上下文菜单的 frontmatter 标记。一个动作是否可用，必须来自已渲染内容的能力与当前运行时状态，而不是来自作者维护的重复配置。

## 生命周期与 Swup

该有机体（organism）在持久化布局中只水合（hydrate）一次。它会在 `swup:visit:start` 与 `swup:content:replace` 时关闭；一个读取或修改 Markdown 内容的动作，必须在替换之后解析其目标，而不能保留过时的元素引用。对直接加载文章与通过 Swup 导航进入文章这两种情况都要测试。

键盘规则是动作契约的一部分：首项获得焦点，`ArrowUp`/`ArrowDown` 在当前菜单内循环，`Home`/`End` 跳到首尾，`Escape` 关闭；当菜单处理这些按键时，不得触发浏览器滚动。

## 零额外负担与包模式规则

- `enable: false` 意味着没有菜单 DOM、监听器、水合，也没有任何动作专属资源。
- 未出现的 Markdown 语法，不得添加任何动作专属的脚本、样式表、网络请求或轮询循环。
- 第三方代码绝不可被导入基础的上下文菜单有机体（organism）。当清单（manifest）要求时，请使用由 Markdown 特性自身拥有的按需加载（on-demand loading）。
- 保持源码检出（source-checkout）与 `xiaomais` 包模式（npm package mode）行为一致。新增的工具与 DOM 契约必须使用能经受集成覆盖层（integration overlay）的仓库路径。

## 验证清单

- `pnpm.cmd check:manifest`
- `npx.cmd astro check`
- `pnpm.cmd exec biome ci ./src`（既有的诊断信息应当被记录，而非被隐藏）
- 在功能启用与禁用两种情况下运行上下文菜单的 Playwright 测试
- 用 `tests/site/a11y.spec.ts` 验证菜单语义与键盘焦点
- 当动作作用于 Markdown 内容时，运行受影响的 Markdown 插件单元测试/站点测试
- 覆盖直接加载与 Swup 导航两种情况
