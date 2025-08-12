import { defineCollection, reference, z } from "astro:content";
import { file, glob } from "astro/loaders";

const baseSchema = {
	title: z.string(),
	description: z.string(),
	created: z.coerce.date(),
	tags: z.array(z.string()).optional(),
};

const baseProjectSchema = {
	...baseSchema,
	featured: z.boolean().optional(),
};

const skillSchema = {
	name: z.string(),
	icon: z.string(),
	url: z.string().optional(),
	color: z.string().optional(),
	featured: z.boolean().optional().default(false),
};

export const collections = {
	projects: defineCollection({
		loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/projects" }),
		schema: z.object({
			...baseProjectSchema,
			thumbnail: z.string().optional(),
			sourcecode: z.string().optional(),
			website: z.string().optional(),
			demo: z.string().optional(),
			category: z
				.enum(["library", "software", "component", "website", "game", "mod", "plugin", "other"])
				.optional()
				.default("other"),
			assets: z.array(
				z.object({
					src: z.string(),
					type: z.enum(["video", "image", "embed", "audio"]),
					altText: z.string().optional(),
				}),
			),
			roles: z.array(z.string()).optional(),
			assisted: z.boolean().optional().default(false),
			commercial: z.boolean().optional().default(false),
			inProgress: z.boolean().optional().default(false),
			released: z.coerce.date().optional(),
			tools: reference("software").array().optional(),
			technologies: reference("technologies").array().optional(),
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
	software: defineCollection({
		loader: file("src/data/software.json"),
		schema: z.object(skillSchema),
	}),
	technologies: defineCollection({
		loader: file("src/data/technologies.json"),
		schema: z.object(skillSchema),
	}),
	"programming-languages": defineCollection({
		loader: file("src/data/programming-languages.json"),
		schema: z.object(skillSchema),
	}),
};
