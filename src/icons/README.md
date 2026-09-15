# `src/icons`

自定义本地图标的存放目录。

## 为什么这个目录必须存在（哪怕它是空的）

`astro-icon` 的 `iconDir` 选项默认指向 `src/icons`。其 Vite 插件（见
`astro-icon/dist/vite-plugin-astro-icon.js`）在加载虚拟模块 `virtual:astro-icon` 时执行：

```js
try {
  collections = await loadIconifyCollections({ root, include });
  const local = await loadLocalCollection(iconDir, svgoOptions);
  collections["local"] = local;
  logCollections(collections, { ...ctx, iconDir });
  await generateIconTypeDefinitions(Object.values(collections), root); // ← 写 .astro/icon.d.ts
} catch (ex) {
  ctx.logger.warn(`Failed to load icons from "${iconDir}": ${ex.message}`);
}
```

`loadLocalCollection` 内部调用 `@iconify/tools` 的 `importDirectory()`，**目录不存在时会抛 ENOENT**。
由于它处于 `try` 块的第一个调用之后，异常会让第 27 行的 `generateIconTypeDefinitions()` 被整体跳过，导致：

1. 构建日志出现 `[WARN] [astro-icon] Failed to load icons from "src/icons": ENOENT ...`
2. `.astro/icon.d.ts` **无法生成** —— 即 `virtual:astro-icon` 的 `Icon` 联合类型缺失，
   进而影响 `pnpm check` / `pnpm type-check` 对图标名的类型校验

因此本目录用 `.gitkeep` 占位，确保它被 git 跟踪、不会被空目录清理掉。**请勿删除。**

## 用法

把自定义 `.svg` 放进来，然后用 `local:` 前缀引用：

```astro
<Icon name="local:my-custom-logo" />
```

主题内置图标全部来自 `@iconify-json/*` 集合（`material-symbols`、`fa6-brands`、
`fa6-regular`、`fa6-solid` 等），无需放在这里。相关配置见 `astro.config.mjs` 中的 `icon({ include: ... })`。
