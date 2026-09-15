import type { ProfileConfig } from "@/types/config";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 */
export const profileConfig: ProfileConfig = withUserConfig("profile", {
	avatar: "assets/images/demo-avatar.webp", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "XiaoMai",
	bio: "The ideal of life is for ideal life.",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://github.com/GrowWheat/XiaoMai",
		},
		{
			name: "Bilibili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/1182196267",
		},
		{
			name: "Email",
			icon: "fa6-regular:envelope",
			url: "mailto:3205894053@qq.com",
		},
		{
			name: "爱发电",
			icon: "fa6-solid:heart",
			url: "https://ifdian.net/a/XiaoMai6",
		},
	],
});
