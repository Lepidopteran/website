import {
	createHighlighter,
	type Highlighter,
	type CodeToHtmlOptions,
} from "shiki";

// Caches Promise<Highlighter> for reuse when the same theme and langs are provided
const cachedHighlighters = new Map<string, Promise<Highlighter>>();

// Caches HTML results
const cachedHtml = new Map<string, string>();

export interface ShikiConfig {
	langs: string[];
	theme: string;
}

export interface ShikiHighlighter {
	codeToHtml: (code: string, lang: string, options?: any) => Promise<string>;
}

export async function getCachedHighlighter(config: ShikiConfig): Promise<ShikiHighlighter> {
	// Create a unique key for the highlighter config
	const key = JSON.stringify({
		langs: [...config.langs].sort(),
		theme: config.theme,
	});

	// If highlighter already exists, return it
	if (cachedHighlighters.has(key)) {
		return cachedHighlighters.get(key)!;
	}

	// Create new highlighter and cache it
	const highlighter = await createHighlighter({
		themes: [config.theme],
		langs: config.langs,
	});

	cachedHighlighters.set(key, highlighter);

	// Return an object with codeToHtml method
	return {
		codeToHtml: async (code: string, lang: string, options?: any) => {
			const cacheKey = `${lang}-${code}`;
			if (cachedHtml.has(cacheKey)) {
				return cachedHtml.get(cacheKey)!;
			}

			// In shiki v4, codeToHtml takes options as the second parameter
			const html = await highlighter.codeToHtml(code, {
				lang,
				theme: config.theme,
				transformers: options?.transformers || [],
				attributes: options?.attributes || {},
			} as CodeToHtmlOptions);

			cachedHtml.set(cacheKey, html);
			return html;
		}
	};
}
