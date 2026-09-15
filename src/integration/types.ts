/**
 * Public option types for the XiaoMai Astro integration (npm package mode).
 *
 * These types are re-exported from the package root so users get full
 * IntelliSense inside `astro.config.mjs`:
 *
 * ```ts
 * import xiaomais from "xiaomais";
 * export default defineConfig({ integrations: [xiaomais({ ... })] });
 * ```
 */

/** Where user-authored content and configuration live, relative to the project root. */
export interface XiaoMaisPaths {
	/**
	 * Root directory holding user config + content.
	 * @default "xiaomais"
	 */
	root?: string;
	/**
	 * Config directory, relative to the project root.
	 * @default "<root>/config"
	 */
	config?: string;
	/**
	 * Data modules directory (friends / projects / skills / ...), relative to project root.
	 * @default "<root>/config/data"
	 */
	data?: string;
	/**
	 * Content directory holding `posts/`, `moments/`, `spec/`.
	 * @default "<root>/content"
	 */
	content?: string;
}

export interface XiaoMaisFontOptions {
	/**
	 * Run the build-time font subsetting pipeline.
	 * When enabled, subset `.woff2` files are emitted into `<root>/.xiaomais/fonts/`.
	 * Falls back to the value of `fontConfig.subsetting.enable` when omitted.
	 */
	subset?: boolean;
	/**
	 * Extra characters to always keep in the subset (e.g. glyphs only produced
	 * at runtime by client-side scripts).
	 */
	extraCharacters?: string;
}

export interface XiaoMaisOptions {
	/** Directory layout overrides. */
	paths?: XiaoMaisPaths;

	/**
	 * Component override map. Keys are package-relative component paths without
	 * extension (e.g. `"atoms/blog/PostCard"`), values are project-relative paths.
	 *
	 * Anything placed in `src/components/**` or `src/layouts/**` of the user's
	 * project that mirrors the package structure is picked up automatically,
	 * so this map is only needed for non-mirrored locations.
	 */
	components?: Record<string, string>;

	/** Font pipeline tuning. */
	fonts?: XiaoMaisFontOptions;

	/**
	 * Generate the Pagefind search index after `astro build`.
	 * @default true
	 */
	pagefind?: boolean;

	/**
	 * Register the bundled Astro integrations (svelte, mdx, sitemap, swup,
	 * astro-icon, expressive-code). Disable only if you register them yourself.
	 * @default true
	 */
	bundledIntegrations?: boolean;

	/**
	 * Inject the theme's page routes. Disable to supply your own `src/pages/`.
	 * @default true
	 */
	injectRoutes?: boolean;

	/**
	 * Route patterns to skip when injecting, e.g. `["/anime", "/devices"]`.
	 * Useful to drop pages whose data you do not maintain.
	 */
	excludeRoutes?: string[];
}

export interface ResolvedXiaoMaisPaths {
	/** Absolute path to the user's project root. */
	projectRoot: string;
	/** Absolute path to the installed package root (or repo root in source mode). */
	packageRoot: string;
	/** Absolute path to the package `src/` directory. */
	packageSrc: string;
	/** Absolute path to the user's config directory. */
	configDir: string;
	/** Absolute path to the user's data directory. */
	dataDir: string;
	/** Absolute path to the user's content directory. */
	contentDir: string;
	/** Absolute path to the package-managed cache dir (`<root>/.xiaomais`). */
	cacheDir: string;
	/** True when running from `node_modules` (npm package mode). */
	isPluginMode: boolean;
}
