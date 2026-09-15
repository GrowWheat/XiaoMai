/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare module "virtual:xiaomai-music-sidebar" {
	const component:
		| typeof import("@components/organisms/music/MusicSidebar.astro").default
		| null;
	export default component;
}
