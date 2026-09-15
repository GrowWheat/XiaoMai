# XiaoMai 的 Agent 协作指引 — M3E 博客主题

## 概述

XiaoMai 是一套基于 Astro 7、Svelte 5、Tailwind 4、Stylus 与 pnpm 构建的博客主题。它被重构为一个 M3E（Material 3 Extended）组件库，并采用数据驱动的编排。站内导航使用 Swup，因此持久外壳与可替换的页面容器拥有不同的生命周期。开发在 Windows 上进行；调用包命令时请使用 `.cmd` 后缀（`pnpm.cmd`、`npx.cmd`、`npm.cmd`）。

## 必须遵守的规则

- 可选功能与第三方集成（评论、分析、小部件等）必须遵循**零额外负担**原则：当被禁用（`enable: false` 或省略）时，它们不得产生任何外部网络请求、DOM 占用/布局偏移、npm 包膨胀（仅动态加载），并且无需对现有内容的 frontmatter 进行大量修改即可保持完全向后兼容。
- 在改动架构、组件、路由或内容流水线之前，请先阅读 `rules/` 与 `docs/` 中的相关文件。提交前运行 `npx.cmd astro check`；它必须报告 0 个错误。使用形如 `type(scope): subject` 的约定式提交（`feat`、`fix`、`test`、`docs`、`refactor`、`chore` 或其他合理的类型）。
- 对于 UI 与视觉改动，请同时阅读根目录的 `DESIGN.md` 与 `docs/m3e-standard.md`；`DESIGN.md` 是 XiaoMai 视觉识别的机器可读且叙述性的权威来源。
- 切勿在组件中硬编码面向用户的文案。请使用 `src/i18n/i18nKey.ts` 与全部十种区域语言模块；参数化字符串在每个语言版本中保持相同的 `{placeholder}` 名称，并由调用方替换。
- 语义化颜色、圆角、排版与动效必须使用项目设计令牌（`--shape-corner-*`、`--m3e-type-*`、`--m3e-duration-*`、`--m3e-easing-*`，以及 surface/on-surface 令牌）。固定的黑/白取值仅允许用于图片叠加层的可读性，或其他已在文档中说明、与内容相关的例外。官方规范的几何或动效常量需要明确的本地化理由。
- 组件依赖遵循既定方向：atoms 可组合 atoms，molecules 可组合 atoms 与合适的同层 molecules，organisms 可组合下层以及显式拥有的较小 organisms，templates 组合组件，pages 组合 templates/components。下层不得导入上层；跨层导入请使用 `@components/<layer>/<file>` 别名，避免循环依赖。
- atoms 与 molecules 不得直接查询 Astro 集合或自行持有浏览器持久化。某领域 molecule 已使用的构建期数据适配器可保留在原处；路由状态、`localStorage` 与持久外壳同步应置于 organisms，或具有明确运行时契约的专用工具中。
- 在 Astro 中，SSR 独占的输出必须在不进行水合的情况下仍可使用。仅当交互确实需要时，才添加 `client:load`、`client:visible` 或 `client:only="svelte"`。在纯 SSR 路径上，请使用 `astro-icon`；`@iconify/svelte` 在 SSR 期间不会渲染图标。
- 在 Svelte 中，请遵循该文件已采用的语法（runes 或 legacy），绝不在同一组件中混用两种模式。当条件类名与带作用域的未使用 CSS 分析产生交互时，请使用模板字符串类名；其他位置保留有效的 `class:` 指令。在 Stylus 中，当 `&` 会错误地拼接选择器时，请将修饰符与元素选择器拆分为独立的选择器。
- 保持设计的原创性与差异性。`research/` 仅作为参考资料：不得复制其中的 schema、名称、默认值、算法、组件组合或视觉布局。不要在 research 检出目录内进行编辑、安装、构建、格式化或提交；其中下游的 `AGENTS.md` 文件属于上游产物，并非 XiaoMai 的指引。
- `#swup-container` 之外的持久外壳元素不会被 Swup 重新渲染。响应路由变化的逻辑必须使用恰当的 Swup 生命周期钩子（`content:replace`、`page:view` 或事件委托），并且必须针对直接加载与客户端导航两种情况都进行测试。
- XiaoMai 还以 npm 包形式发布（`xiaomais`）；`src/integration/` 会为用户项目重建 `astro.config.mjs`。对主题源码的任何改动都必须让两种模式都能正常工作——将配置变更同步镜像到 `src/integration/`，避免对主题自有文件进行 `process.cwd()` 读取，在清单中注册 Markdown 语法，并遵循覆盖规则。详见 `rules/project-rules.md` 第 12 节与 `docs/packaging-contract.md`。

## 必读文档

- `rules/pitfalls.md` —— Svelte/Astro 集成、Stylus、缓存与测试陷阱。
- `rules/css-important.md` —— 允许的 CSS `!important` 所有权边界、注释与校验。
- `rules/project-rules.md` —— 项目规范与提交策略。
- `docs/atomic-structure.md` —— 组件分层与所有权。
- `docs/m3e-standard.md` —— M3E 令牌与组件标准。
- `docs/markdown-extensions.md` —— Markdown 插件流水线、排版边界、缓存刷新与校验。
- `docs/markdown-on-demand-loading.md` —— 在改动 Markdown 功能探测、条件样式、运行时加载或 Swup 资源生命周期之前必读。
- `docs/markdown-syntax-manifest.md` —— 在新增、改动或弃用面向作者的自定义 Markdown 语法之前必读。
- `docs/sidebar-system.md` —— 侧边栏编排、页面筛选与 Swup 同步。
- `src/config/README.md` —— 在改动配置类型或取值之前必读。
- `rules/ai-skills.md` —— 在新增或改动 AI 技能及其打包工作流之前必读。
- `docs/npm-package-mode.md` —— 主题作为 `xiaomais` 包安装时的行为（配置路径、内容根、init）。
- `docs/packaging-contract.md` —— 每次主题改动都必须遵守的双模式契约；同步清单见 `rules/project-rules.md` 第 12 节。
- `docs/ai-skills-maintenance.md` —— 技能/项目文档拆分与发布清单必读。
- 最近的嵌套 `AGENTS.md` —— 本地规则是对本文件的补充，且更为具体。
- `.agents/skills/README.md` —— 面向开发者与主题用户的、按任务划分的 AI 技能；在其领域工作时请查阅对应技能（并保持其内容同步）。

## 校验

- 常用命令：`pnpm.cmd astro dev --port 4321`、`npx.cmd astro check`、`npx.cmd playwright test tests/site/<spec>.spec.ts`、`pnpm.cmd check:manifest`、`pnpm.cmd exec biome ci ./src`、`pnpm.cmd type-check`，以及 `pnpm.cmd build`。
- `pnpm.cmd lint` 与 `pnpm.cmd format` 包含 `--write`；不要将它们当作只读审查检查来使用。当校验不得修改文件时，请使用 `pnpm.cmd exec biome ci ./src`。
- 针对页面/组件改动，请运行最小相关的 Playwright 片段，外加 `tests/site/a11y.spec.ts`。当这些领域发生变更时，请运行相册、图标或动效片段。可视化套件使用被 Git 忽略的本地快照；只有在确认每一处差异都是有意为之后，才更新它们，且不要吸收无关的页面高度或环境漂移。
- 若 Stylus/Svelte 改动在开发环境中看似未生效，请清除 `node_modules/.vite` 与 `.astro` 后重启。若 Markdown/rehype/remark 改动看似未生效，请清除 `.astro/data-store.json` 后重启。
- 在断言计算样式或运行无障碍检查之前，请等待主题初始化（`--mc-primary`）与 `onload-animation` 收敛完成。

## 仓库上下文

- 侧边栏配置从 `src/config/sidebarConfig.ts` 经 `src/components/organisms/SideBar.astro` 中的 `componentMap` 注册表流向小部件渲染。`src/types/sidebarConfig.ts` 中的 `SidebarPage` 是页面标识符（`home`、`archive`、`friends`、`moments`、`anime`、`compass`、`albums`、`about`、`categories`、`tags`、`post`）的权威来源。`pages` 筛选器在 SSR 时以及 Swup 替换后，从 `#swup-container` 读取 `data-current-page`。
- 动效原语位于 `src/utils/motion.ts`（`fadeOutThenHide`、`flipFromRect`、`revealIn`、`collapse`）；必须尊重 `prefersReducedMotion()`。
- atoms 清单与计数仅以 `src/components/atoms/manifest.json` 为权威；不要在指引或散文中维护第二份硬编码计数。
- 规范的页面模板位于 `src/layouts/` 之下；`src/components/layout/` 并非并行的模板层。
