# 相册

在 `public/images/albums/<id>/` 下为每个相册创建一个目录。

每个目录都需要一个 `info.json` 文件。本地相册使用 `cover.webp` 或 `cover.jpg`，并自动扫描其余图片文件；请将封面文件排除在带编号的照片序列之外。如果某个基础文件名同时具有 WebP 和另一种图片扩展名，则会优先选择 WebP 文件。诸如 `sunset_beach.webp` 这样的文件名会将 `beach` 作为照片标签暴露出来。

为了获得可预测的本地排序和可读的生成元数据，请使用零填充的数字命名，例如 `01.webp`、`02.webp` 和 `03.webp`。扫描器使用感知数字的 `localeCompare` 对名称排序，而基础文件名会参与生成照片的 `alt`/`title`、标签以及公开图片 URL。除非是有意为之，否则应避免哈希值或混合前缀。重命名现有相册时，请保留扫描顺序，并在之后运行相册回归测试。

```json
{
  "title": "Local album",
  "description": "Album description",
  "date": "2025-08-01",
  "location": "Tokyo",
  "tags": ["travel"],
  "layout": "masonry",
  "columns": 3,
  "hidden": false
}
```

对于远程媒体，请将 `mode` 设为 `external`，并提供 `cover` 以及 `photos` 数组。每张照片都需要 `src`；`thumbnail`、`alt`、`title`、`description`、`tags`、`width`、`height`、`camera`、`lens` 和 `settings` 均为可选。建议提供 `width` 和 `height`：画廊会用它们来保持源宽高比，并按方向对瀑布流照片排序。如果省略，尺寸会在图片加载后测量。

`hidden: true` 会将相册从 `/albums/` 中移除，但保留其静态详情路由。设置 `password` 会创建一个受保护相册。构建过程只向受保护页面输出一份已加密的照片清单；浏览器在密码输入成功后对其进行解密。密码本身永远不会发送到浏览器。这是一个静态站点访问门禁，而非服务端授权。远程 URL 仍由其主机直接控制，而 `public/` 下的本地文件若其 URL 已知，仍可直接寻址。

受保护相册使用与常规相册相同的 `layout` 和 `columns` 契约。当相册应使用从左到右的瀑布流画廊时，请将 `layout` 设为 `masonry`；解锁不应需要单独的布局配置。

随附的示例展示了本地、外部、隐藏和受保护这几种模式。示例图片是从研究夹具（fixture）中复制用于开发的，不主张作为可普遍再分发的媒体。

修改某个相册的 `info.json` 或图片文件后，请从项目根目录运行 `npx.cmd playwright test tests/site/albums.spec.ts`。
