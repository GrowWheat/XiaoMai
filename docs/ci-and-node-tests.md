# CI 与 Node 单元测试规约

本项目直接使用 Node 运行单元测试。CI 使用 Node 22 与 Node 24。开发期由 Astro/Vite 提供 TypeScript、别名与扩展名解析能力，但 `node --test` 并不具备；被测试加载的代码在两种环境下都必须可运行。

## 运行时边界

- 不要让纯 Node 测试路径 import 包含运行时 `enum` 的 TypeScript 模块。Node 仅做剥离（strip-only）的 TypeScript 加载器不支持 `enum`。
- 当 Node 测试需要 enum 形态的键时，通过 `.mjs` 运行时桥接文件暴露字符串键，并把 TypeScript 声明保留在与之对应的 `.d.mts` 文件中。
- 由 Node 直接加载的 TypeScript 文件，其相对导入必须使用显式的 `.ts` 扩展名。不要依赖 `@/` 之类的 Vite 别名。
- 面向用户的文案仍须走 `i18n()` 与 `I18nKey` 注册表。运行时桥接只改变加载方式；它不得复制翻译内容，也不得绕过十个 locale 模块。

## 本地校验顺序

在改动 Markdown 处理、i18n 模块或测试加载路径之后，请运行：

```powershell
pnpm.cmd exec biome ci ./src
npx.cmd astro check
pnpm.cmd check:manifest
node --test "tests/**/*.test.mjs"
git diff --check
```

不要将 `astro check` 与内容同步测试并行运行。astro check 会触发内容同步，而 `tests/content/*` 使用的是临时仓库 fixtures；并发运行可能导致误报（例如空 stderr）。请将完整的单元测试套件单独运行。

## GitHub Actions 诊断

先查看运行摘要（run summary），再查看失败任务的日志：

```powershell
gh run view <run-id> --json status,conclusion,headSha,jobs,url
gh run view <run-id> --job <job-id> --log-failed
```

请使用相同的 Node 主版本与命令在本地复现失败步骤。将构建失败、诊断失败与单元测试失败分开处理；只有当失败能在隔离运行中复现时，再去改动实现。

## 提交前

- 检查 `git diff`，确认 locale 文件仅包含必需的 import 或格式化改动。
- 显式暂存路径。绝不要使用 `git add -A`，它可能把 `XiaoMai-Content/`、临时 fixtures 或构建产物一并纳入。
- 使用约定式提交（conventional commit），例如 `fix(markdown): support direct Node markdown tests`。
