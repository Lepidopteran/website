import { defineCollection, reference, z } from "astro:content";
import { file, glob } from "astro/loaders";

const baseSchema = {
	title: z.string(),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
};

const baseProjectSchema = {
	...baseSchema,
	featured: z.boolean().optional(),
};

export const collections = {
	projects: defineCollection({
		loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/projects" }),
		schema: z.object({
			...baseProjectSchema,
			thumbnail: z.string().optional(),
			sourcecode: z.string().optional(),
			demo: z.string().optional(),
			assets: z.array(
				z.object({
					src: z.string(),
					type: z.enum(["video", "image", "embed", "audio"]),
					altText: z.string().optional(),
				}),
			),
			post: reference("projects").optional(),
			languages: reference("programming-languages").array().optional(),
		}),
	}),
	art: defineCollection({
		loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/art" }),
		schema: z.object({
			...baseProjectSchema,
			image: z.string(),
		}),
	}),
	music: defineCollection({
		loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/music" }),
		schema: z.object({
			...baseProjectSchema,
			src: z.string(),
			albumArt: z.string().optional(),
		}),
	}),
	"programming-languages": defineCollection({
		loader: file("src/data/programming-languages.json"),
		schema: z.object({
			name: z.string(),
			icon: z.string(),
			url: z.string().optional(),
			color: z.string().optional(),
			featured: z.boolean().optional().default(false),
		}),
	}),
};
