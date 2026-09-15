# 组件范围

这些规则为仓库的 `AGENTS.md` 增加了组件级局部约束；请阅读 `docs/atomic-structure.md` 和 `docs/m3e-standard.md` 了解完整模型。

- 保持依赖从较低层级流向较高层级的消费者。原子（atom）可以组合原子，但不得导入分子（molecule）、有机体（organism）、布局（layout）或页面（page）。分子可以使用原子以及合理的同层分子（无循环）；它们不得导入有机体。`content/` 和 `system/` 保持其文档化的归属关系，并非绕过层级规则的捷径。
- 将集合访问、浏览器持久化和路由同步排除在原子之外。当某个领域分子（molecule）的文档化用途本来就是如此时，它可以保留已有的构建期适配器；浏览器端状态与 Swup 同步应归属于有机体（organism）或显式命名的工具模块。
- 选择 `.astro` 用于 SSR/静态输出，仅在需要状态或有交互行为时使用 Svelte。只对有需要的孤岛（island）进行水合（hydration）。在仅 SSR 的路径上，使用 `astro-icon` 而非 `@iconify/svelte` 来渲染图标。
- 使用 `@components/<layer>/<file>` 进行跨层导入。保持所在文件的 Svelte 语法模式，避免混用 runes 与旧版语法，并且仅在作用域未使用 CSS 分析需要时，才使用模板字符串类。避免 Stylus 的 `&` 嵌套意外地合并修饰符与元素类名。
- 使用 M3E 语义化令牌（token）表示视觉值与动效。使用 `.m3-state-layer` 提供共享的交互反馈，而不要在各个组件中重复创建悬停/按下叠加层。
- 在新增、移动或移除原子（atom）时，请在同一次改动中更新 `src/components/atoms/manifest.json` 及其层级/落地元数据。运行 `pnpm.cmd check:manifest`；对于 UI 改动，还应在适用时运行相关的站点片段，以及 `npx.cmd playwright test tests/site/icons.spec.ts tests/site/a11y.spec.ts`。
