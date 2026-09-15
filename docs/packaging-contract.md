# 打包契约

新增的主题代码必须遵守这些规则，才能让主题在通过 npm 安装（而非 clone）时依然正常工作。它们在源码仓库中没有任何体现——代码在那边无论如何都能正常运行——因此必须在编写代码时有意地落实，否则只能在日后以一个损坏的发布形式暴露出来。

请结合 [npm-package-mode.md](./npm-package-mode.md) 阅读，该文档解释了两种模式*如何*共存。本文档是那份清单。

## 一切规则皆由此衍生

> 在包模式下，主题位于 `node_modules/xiaomais/`，而 `process.cwd()` 是**用户的项目**，其中没有任何 `src/`。

因此：任何从 `cwd` 派生出的路径都指向用户的项目，而任何从模块自身位置派生出的路径都指向主题。

## 构建期读取文件

**不要**通过 `process.cwd()` 来定位主题自有的文件：

```ts
// ✗ breaks in package mode: the user's project has no src/styles/
const css = await readFile(resolve(process.cwd(), "src/styles/markdown/trees.css"), "utf8");
```

让打包器把内容内联进来替代。这在两种模式下都正确，并且每次渲染都省去一次磁盘读取：

```ts
// ✓
import treesCss from "../styles/markdown/trees.css?raw";
```

`import.meta.url` **不是**安全的替代方案：页面在构建期由 Node 渲染，而在那份 bundle 中，Rollup 会把 `import.meta.url` 重写为所产出 chunk 的位置，而非源文件的位置。

> **静态站点中的“服务端（Server）”。** XiaoMai 以 SSG 形式交付——每个页面都是磁盘上的 HTML，运行时没有任何服务端。但 Astro 仍然会在构建期通过 Node 执行组件来*渲染*这些页面，而 Vite 把这一构建称为 SSR 构建（因此有了 `src/integration/ssr-node-shims.ts`）。所以构建期的 Node 关切——`__dirname`、`require`、文件系统读取——在这里是真实存在的，即便生产环境没有任何服务端在运行。

当目标确实属于用户时，`process.cwd()` *才*是正确选择——例如 `public/images/albums/`、其配置中指定的某个目录、`.xiaomais/` 下的生成缓存。

### 在两处都存在的文件

随模板一起交付、与配置相关的文件，在用户项目中位于 `xiaomais/config/`，而在源码仓库中位于 `src/config/`。应两者都探测，先探测用户侧位置：

```ts
const found = [
  path.join(process.cwd(), "xiaomais", "config", "FooterConfig.html"),
  path.join(process.cwd(), "src", "config", "FooterConfig.html"),
].find((candidate) => fs.existsSync(candidate));
```

这一点同样适用于写入配置文件中的任何默认路径——它会被针对用户的项目解析。`animeConfig.ts` 把其快照缓存默认设为 `"src/data/anime-snapshots"`，这正是流水线在搭建模板时把该字面量改写为 `xiaomais/config/data/anime-snapshots` 的原因。新增此类默认值，要么需要在 `prepare-templates.mjs` 中加入一条重写规则，要么需要一个在两种布局下都已正确的路径。

## Tailwind

`src/styles/main.css` 必须在其 import 之后立即保留 `@source` 指令：

```css
@import "tailwindcss";
@source "../**/*.{astro,svelte,ts,tsx,js,jsx,mjs,cjs,md,mdx,html}";
```

Tailwind v4 的自动内容检测**永远不会扫描 `node_modules`**。缺少这一行时，包构建会输出主题自身的 CSS 变量与 Stylus 组件样式，却不会输出任何基础工具类（base utilities），最终得到的页面配色正确、布局却已坍塌。该路径相对于 CSS 文件，因此在两种模式下都会解析到主题自身的 `src/`。

## 导入与依赖

- 任何从页面可达的内容——包括经由传递依赖——都必须位于 `dependencies`，而非 `devDependencies`。在源码模式下 devDependencies 会被安装，因此这个错误不可见；而在包模式下用户的构建会直接失败。如果上游确实希望它作为 devDependency，请把它加入流水线的 `scripts/config.mjs` 中的 `EXTRA_DEPENDENCIES`。
- 优先使用主题别名（`@/`、`@components/`、`@utils/`、……），而不是爬出目录的深相对路径。覆盖层（overlay）解析器在任何位置都能理解别名；相对路径的“逃逸”只有在导入方位于包内部时才有效。
- 一个由 Node 而非 Vite 解析的包（`require.resolve`、bundle 之外的动态 `import()`），必须是一个 **peer** 依赖，因为 pnpm 严格的布局会把主题自身的副本对项目根目录隐藏起来。

## 新增内容

| You add | What to do |
| --- | --- |
| 在 `src/pages/` 中新增一个路由 | 无需任何操作。`routes.ts` 会自动发现它并用 `injectRoute` 注入。非 HTML 的端点（`*.txt.ts`、`*.xml.ts`）也能被处理。 |
| 在 `src/config/` 中新增一个配置模块 | 如果遵循既有形态，则无需任何操作——模板会拾取它并重写其相对导入。请让它通过 `src/config/index.ts` 这个聚合入口（barrel）导出。 |
| 在 `src/data/` 中新增一个数据模块 | 无需任何操作。它会被搭建到 `xiaomais/config/data/`。注意在那里对 `../config/x` 的导入会变成 `../x`。 |
| 一个组件或布局 | 无需任何操作即可工作；它会自动变为可覆盖。 |
| 一个新增的 `src/` 顶层目录 | 除了 `content/` 与 `integration/` 之外，无需任何操作。xiaomais 流水线会复制所有不在 `PACKAGE_SRC_EXCLUDES`（`scripts/config.mjs`，当前为 `content` 与 `integration`）中的 `src/` 顶层目录。`content/` 由用户所有、通过模板交付；`integration/` 是主题自身的接线（wiring），由 xiaomais 为 npm 模式重新构建。（这曾经是一个白名单 `PACKAGE_SRC_DIRS`——上游新增了 `src/user/` 却漏掉了它，导致打包构建失败。那种失败模式已经不复存在。） |
| 一个既非源码也非内容的文件（`.html`、`.json`、运行时读取的资源） | 先决定它的归属。属于主题的 → 通过打包器 import 它。属于用户的 → 在模板中交付，并探测两个位置。 |

## 合并进打包分支之前

对流水线运行一次空跑（dry run）：**xiaomais → Actions → Build & Publish → Run workflow**，将 *Upstream branch/tag* 设为你的分支，并勾选 *Build and validate, but do not publish*。它会在一个临时（scratch）项目中进行真实的安装、`xiaomais init`、`astro build` 以及开发服务器冒烟测试（smoke test）——这正是在用户踩坑之前捕获上述失败的方式。

## 对照源码站点校验一次发布

到目前为止，能捕获每一次回归（regression）的检查，是对两个已部署站点——包构建与源码构建——做差异比对，而不是直接去阅读 diff：

1. 两个站点的每条路由都返回相同的状态码。
2. 逐页对比：`data-*` 属性名集合、自定义元素标签名集合以及 `<script>` 数量必须一致。某个静默加载失败的特性，会在这里表现为只有一侧出现了某个属性。
3. 逐页对比：HTML 中使用却未在任何样式表中定义的 CSS 类集合。把包构建缺失的集合**与源码构建缺失的集合**相互比对——只有两者的差异才有意义。在提取选择器之前，要先剥掉 Tailwind 的转义（`.replace("\\","")`），否则结果会出现数百个误报（false positives）。
