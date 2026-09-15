# 测试范围

- 使用仓库的 Playwright 配置：`npx.cmd playwright test ...`、已配置的 Chrome 渠道、单个 worker，以及自动的 Astro 开发服务器。除非有文档化的理由，否则不要在某单个 spec 中引入与之竞争的服务器或浏览器设置。
- 对外部 API 和不稳定的网络/媒体响应进行 Mock。保持测试数据具有确定性，并使用语义化角色、标签、稳定的 `data-*` 契约或作用域选择器，而非偶发的 DOM 位置。
- 在进行计算样式或无障碍（accessibility）断言之前，请等待主题初始化（`--mc-primary`）、必需的孤岛，以及 `onload-animation` 收敛完成。对运动敏感的行为要触发 `prefers-reduced-motion`，并断言减弱动效路径在无动画情况下稳定下来。
- 涉及持久化外壳元素的功能必须同时覆盖直接页面加载和 Swup 导航。在 `content:replace` 之后断言路由契约，而非假设外壳已被重新渲染。
- 将视觉快照保留在本地且应出于明确意图。它们会被 Git 忽略；不要为了让它们吸收无关的视口、字体、页面高度或缓存漂移而去更新它们。在无法获取截图或差异无法归因于本次改动时，请使用 DOM 几何/状态断言。
- 选择最窄的相关片段，然后为页面/组件改动添加 `tests/site/a11y.spec.ts`。当触及这些契约时，使用 `tests/site/albums.spec.ts`、`icons.spec.ts` 或 `motion.spec.ts`。
