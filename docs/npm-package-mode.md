# XiaoMai 作为 npm 包

XiaoMai 从同一棵源码树出发，运行于两种模式：

| Mode | How you get it | Best for |
| --- | --- | --- |
| **源码模板** | `git clone` 本仓库 | 深度自定义、主题开发 |
| **npm 包** | `pnpm add xiaomais` | 快速搭建博客、轻松升级 |

两种模式都执行同一份 `src/`。npm 模式由 `src/integration/` 实现，在你直接使用仓库时它处于惰性（inert）状态。

## 两种模式如何共存

`src/integration/index.ts` 检测自身所处的位置：

```ts
const isPluginMode = import.meta.url.includes("/node_modules/");
```

- **源码模式** —— 本仓库中的 `astro.config.mjs` 驱动一切，Astro 基于文件的路由（file-based routing）会直接拾取 `src/pages/`。集成机制完全未被引用。
- **包模式（npm package mode）** —— 用户的 `astro.config.mjs` 只含 `integrations: [xiaomais()]`。随后集成机制会复刻仓库版 `astro.config.mjs` 的全部行为：注册打包好的集成、构建字体声明、安装 Markdown 处理器，并用 `injectRoute` 注入 `src/pages/` 中的每一页。

## 架构

```text
src/integration/
├── index.ts        integration entry — the package-mode equivalent of astro.config.mjs
├── overlay.ts      override system (Vite resolveId)
├── load-config.ts  Node-side loader for user TypeScript config
├── routes.ts       src/pages scan → injectRoute patterns
├── fonts.ts        font declarations + plugin-mode subsetting
├── collections.ts  defineCollections() for src/content.config.ts
├── cli.mjs         `xiaomais init`
├── paths.ts        directory resolution
└── types.ts        public option types
```

## 覆盖层（overlay）系统

这是最值得理解的部分。用户通过在自己的项目中镜像包的目录结构来覆盖（override）主题内部实现：

| Package file | User file that wins |
| --- | --- |
| `src/config/siteConfig.ts` | `xiaomais/config/siteConfig.ts` |
| `src/data/friends.ts` | `xiaomais/config/data/friends.ts` |
| `src/components/atoms/blog/PostCard.astro` | `src/components/atoms/blog/PostCard.astro` |
| `src/layouts/Layout.astro` | `src/layouts/Layout.astro` |

`overlay.ts` 将此实现为一个 `pre` 阶段的 Vite 插件，仅对恰好两类说明符（specifier）形态作出响应：

1. **主题别名（theme aliases）** —— `@/config/siteConfig`、`@components/...`、`@utils/...`
2. **导入方位于包内部的相对导入** —— 例如来自 `src/config/musicConfig.ts` 的 `../data/music.ts`

其余一切返回 `null`，Vite 的解析过程原封不动。

> **为何不把每个说明符都解析一遍再检查结果？**
> 早期版本把每个说明符都经由 `this.resolve()` 路由，以便检查最终路径。这同时也截获了像 `xiaomais/collections` 这样的裸包说明符（bare package specifier）并将其破坏——content collection 类型因此无法生成。只对可能引用主题内部的说明符形态作出响应，既正确又明显更快。

由于配置值在 Vite 出现*之前*的 Node 环境中就已经需要（站点 URL、字体声明、expressive-code 主题），`load-config.ts` 通过一个 esbuild 插件套用相同的覆盖（override）规则，并 import 打包后的结果。

## 模板中的路径重写

配置模块从 `src/config/` 移动到 `xiaomais/config/`，因此它们的相对导入必须随之改变。流水线（pipeline）仓库中的 `prepare-templates.mjs` 以机械方式完成这一改动：

| Upstream | Template |
| --- | --- |
| `../data/music.ts` | `./data/music.ts` |
| `../types/fontConfig.ts` | `@/types/fontConfig.ts` |
| `../utils/font-options.ts` | `@/utils/font-options.ts` |
| `./siteConfig` | 不变（仍是同级文件） |

`src/config/index.ts` 始终由包所有：它是每个使用者都会 import 的聚合入口（barrel），因此若允许用户覆盖它，就会破坏导出契约。

## 字体

源码模式把子集写到 `src/assets/fonts/.subset/`。一旦安装，该路径就位于 `node_modules` 内部，因此包模式改为写入 `<project>/.xiaomais/fonts/`，并向 Astro 提供绝对路径。子集会依据所收集字符集的哈希进行缓存，因此重复构建会跳过这部分工作。

## 需要保持同步的事项

- `routes.ts` 与流水线的 `generate-manifest.mjs` 都从文件名推导出路由模式。改动其一，就要改动其二。
- 页面 import 的任何内容都必须位于 `dependencies` 而非 `devDependencies`——若发现未声明的裸导入（bare import），包构建会让发布失败。`@iconify-json/simple-icons` 正是踩中了这个坑。

## 包模式下曾让我们耗费一整天的坑

这些坑无一例外，只有当主题在 pnpm 严格（strict）的布局下从 `node_modules` 运行时才会发作，因此源码仓库永远不会遇到它们：

- **包内部的裸导入（bare imports）** —— Vite 会从*项目*根目录解析它们并失败（`@astrojs/svelte/server.js`、所有 `@swup/astro/*` 项）。`src/integration/fallback-resolver.ts` 会以包自身作为导入方，对失败的项重试。
- **Node 层的 `require.resolve`** —— astro-icon 在 Vite 之外加载图标集，因此 `@iconify-json/*` 必须真实地存在于用户的项目中。它们是 peer 依赖（peer dependencies），由 `init` 安装。`sharp` 同理，Astro 的图片服务会动态 import 它。
- **被内联进 SSR bundle 的 CommonJS 依赖** —— `stylus` 会读取 `__dirname`，再从磁盘加载 `lib/functions/index.styl`。`src/integration/ssr-node-shims.ts` 会把每个被打入包内的 CJS 模块真实的 `__dirname` / `__filename` 还给它。
- **紧邻内容的图片** —— 组件内部 `import.meta.glob("../../**")` 永远无法触及 `<project>/xiaomais/…`。`src/utils/project-images.ts` 增加了一个根绝对路径（root-absolute）glob，在源码模式下它只是为空。
- **`optimizeDeps.include`** —— 它只提示*项目*能够解析的包；在包模式下，这份列表会被丢弃，而不是在每次冷启动时发出警告。
- **pnpm 构建审批** —— pnpm 11 会从 `pnpm-workspace.yaml` 读取 `allowBuilds`，并忽略 `package.json` 中的 `pnpm.onlyBuiltDependencies`。`init` 会写入这两个键，并重写 pnpm 的 `set this to true or false` 占位符。
- **npm provenance（来源溯源）** —— 发布的 `repository.url` 必须指向发布用的仓库，而非本仓库。

## 编写能跨越两种模式的主题代码

上面这些坑都是已经交过学费的。而能防止下一批问题出现的规则——`process.cwd()` 与模块相对路径的区别、Tailwind 的 `@source` 行、新依赖该归属于何处、新增路由或配置模块时会自动发生什么——都汇总在 [packaging-contract.md](./packaging-contract.md) 中。任何合并进打包分支（packaged branch）的内容都应遵循它。

## 发布

构建与发布都在 [`xiaomais`](https://github.com/yCENzh/xiaomais) 仓库中进行。该仓库克隆本仓库、转换源码并发布。其中不包含任何主题代码。

发布完全由人工驱动、且在该仓库中发起——任何地方都没有推送触发器（push trigger），因此在本仓库合并并不会触发任何发布：

1. 把改动合并进打包分支（`feat/npm-package`），并在此提升 `package.json` 的版本。**npm 版本即本仓库的版本**；流水线自身没有任何版本号。
2. 在 xiaomais 中进入 **Actions** → **Build & Publish** → **Run workflow**，所有输入保持默认。

各输入项的说明见 [xiaomais/docs/releasing.md](https://github.com/yCENzh/xiaomais/blob/main/docs/releasing.md)；简而言之，默认值已经指向本仓库的打包分支与当前包名，而值得使用的是 *Build and validate, but do not publish*（构建并校验，但不发布），用于合并前的预演（rehearsal）。
