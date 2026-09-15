# 为 XiaoMai 做贡献

感谢你对 XiaoMai 的关注。我们欢迎各种规模的贡献，包括缺陷报告、文档改进、翻译、无障碍修复、性能优化，以及惠及整个主题的新功能。

## 贡献方式

- 报告一个可复现的缺陷。
- 改进文档或翻译。
- 修复无障碍、响应式布局或浏览器兼容性问题。
- 为既有行为补充测试。
- 提出契合 XiaoMai 作为富有表现力、以内容为核心的博客主题方向的功能建议。

如果你正在规划大型功能、视觉重设计、破坏性配置变更、新增依赖或第三方集成，请先开启一个 Issue 或讨论。这样维护者与贡献者有机会在实现之前就方向达成一致。

仅替换某一处个人站点的演示资料、文章、链接或美术作品的改动，最好保留在你自己的 Fork 中。

## 本地开发

你需要 Node.js 22.12 或更高版本，以及 pnpm 9.x。仓库当前固定使用 `pnpm@9.14.4`。

```bash
git clone https://github.com/<your-name>/XiaoMai.git
cd XiaoMai
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

开发服务器默认运行在 `http://localhost:4321`。

在 Windows PowerShell 上，若脚本执行策略阻止上述命令运行，请使用 `pnpm.cmd` 与 `npx.cmd`。

## 项目指南

请保持改动聚焦，并遵循周边代码已有的模式。以下指南涵盖了 XiaoMai 中最常影响贡献的部分。

### 组件与数据

XiaoMai 采用原子化组件结构：

```text
atoms -> molecules -> organisms -> layouts -> pages
```

依赖关系应遵循这一方向。可复用的 UI 属于下层，而路由状态、内容查询、浏览器持久化及其他应用行为属于 organisms、工具、layouts 或 pages。

跨层导入请使用 `@components/<layer>/<file>`。当新增、移动或移除一个 atom 时，请在同一改动中更新 `src/components/atoms/manifest.json`。

完整的组件指南请参阅 [`docs/atomic-structure.md`](./docs/atomic-structure.md) 与 [`rules/component-api.md`](./rules/component-api.md)。

### 渲染与导航

静态内容应当在不依赖客户端 JavaScript 的情况下仍可使用。仅当 Astro 组件的交互确实需要浏览器代码时才对其进行水合，并在纯 SSR 路径上使用 `astro-icon` 渲染图标。

XiaoMai 使用 Swup 进行站内导航。`#swup-container` 之外的元素在页面之间保持挂载，因此路由相关的行为必须既能在直接页面加载时工作，也能在客户端导航之后工作。

编辑 Svelte 组件时，请遵循该文件已采用的语法，不要将 runes 与 legacy 响应式语法混用。Stylus 选择器也应遵循既有结构，以避免意外的选择器拼接。

### 设计与无障碍

对于视觉改动，请阅读 [`DESIGN.md`](./DESIGN.md) 与 [`docs/m3e-standard.md`](./docs/m3e-standard.md)。

- 颜色、排版、形状、高度与动效均使用既有的语义化令牌。
- 保持浅色与深色主题一致。
- 尊重减弱动效偏好。
- 保留键盘访问、可见焦点、原生语义与可访问名称。
- 不要在同一 Pull Request 中夹杂无关的视觉或格式改动。

无障碍指引见 [`rules/a11y.md`](./rules/a11y.md)。

### 文本与翻译

面向用户的界面文本必须使用 i18n 系统，而不要直接写死在组件中。请在 `src/i18n/i18nKey.ts` 中新增键，并在 `src/i18n/languages/` 下的每个语言模块中提供译文。各语言的占位符名称应保持一致。

文档翻译应在保留命令、路径、链接与技术含义的同时，读起来符合目标语言的自然表达。

### 配置与可选功能

配置取值位于 `src/config/`，其共享类型位于 `src/types/`。新增可选字段应具有向后兼容的默认值，使既有站点与文章无需迁移即可继续构建。

可选集成在禁用时必须保持轻量。被禁用的功能不应渲染空容器、请求第三方资源、产生布局偏移，或将自身的 SDK 加入主包。仅在功能已启用且配置有效后，才加载外部代码。

改动配置前请阅读 [`src/config/README.md`](./src/config/README.md)，新增可选集成前请阅读 [`docs/on-demand-loading.md`](./docs/on-demand-loading.md)。

## 测试与格式化你的改动

在提交或发起 Pull Request 之前，你必须格式化代码并确保所有质量检查通过：

### 1. 强制代码格式化

所有源文件在提交前都必须使用 Biome 进行格式化：

```bash
pnpm format
```

要校验格式化（在 CI 或预提交检查中，不写入文件）：

```bash
pnpm exec biome ci ./src
```

### 2. 质量检查与诊断

运行 Astro 诊断：

```bash
npx astro check
```

它必须以零错误完成。在 Windows PowerShell 上，请运行 `npx.cmd astro check`。

选择与你改动相匹配的附加检查：

| 检查 / 任务 | 命令 | 说明 |
| --- | --- | --- |
| **代码格式化** | `pnpm format` | **提交前必须** |
| **格式校验** | `pnpm exec biome ci ./src` | 用于 CI 的只读检查 |
| **Astro 诊断** | `npx astro check` | **必须报告 0 个错误** |
| **TypeScript 检查** | `pnpm type-check` | 用于 TypeScript 或共享 API |
| **Atom 清单** | `pnpm check:manifest` | 当 atoms 被新增、移动或删除时 |
| **Playwright 测试** | `npx playwright test tests/site/<spec>.spec.ts` | 用于页面或组件行为 |
| **无障碍锁定** | `npx playwright test tests/site/a11y.spec.ts` | 用于 UI 与组件更新 |
| **生产构建** | `pnpm build` | 用于内容处理、字体与 schema |
| **性能审计** | `pnpm run perf:measure` | 用于性能敏感的工作 |

UI 改动应在浅色与深色主题下、相关的桌面与移动尺寸处进行检查。请包含 `tests/site/a11y.spec.ts`，并在视觉差异确有必要时，将截图加入 Pull Request。

## 提交

提交前，请确保：
1. 所有文件都已使用 `pnpm format` 格式化；
2. `npx astro check` 报告 0 个错误；
3. 相关测试通过。

使用 [Conventional Commits](https://www.conventionalcommits.org/)，并附上简洁的英文主题：

```text
feat(search): add result filters
fix(sidebar): sync widgets after navigation
docs(config): clarify music provider setup
test(article): cover encrypted post fallback
refactor(theme): simplify token resolution
```

让每次提交聚焦于单一关注点，并在提交前审查已暂存的 diff。不应包含生成的构建产物、测试报告、本地环境文件、凭据，以及无关的个人内容。

## Pull Request

在开启 Pull Request 之前：

1. 使用 `pnpm format` 格式化所有修改过的文件。
2. 将你的分支针对当前默认分支进行变基或更新。
3. 审查完整 diff 并移除无关改动。
4. 运行 `npx astro check` 并确认零错误。
5. 运行与你工作相关的检查。
6. 确认既有配置与内容仍保持兼容。

在 Pull Request 描述中，请说明：

- 该改动解决了什么问题；
- 行为发生了怎样的变化；
- 你使用了哪些命令进行验证；
- 是否影响了配置、无障碍、性能或既有内容；
- 在适用时，它关闭了哪个 Issue。

对于视觉改动，请包含改动前后的截图，并注明所测试的视口与主题。当改动涉及共享组件或公开配置时，审阅者可能会要求补充测试或文档。

通过提交贡献，即表示你同意该贡献可在仓库的 [MIT License](./LICENSE) 下分发。
