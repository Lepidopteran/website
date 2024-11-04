import { defineCollection, reference, z } from "astro:content";
import { glob } from 'astro/loaders';

const baseSchema = {
	title: z.string(),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
};

const baseProjectSchema = {
	...baseSchema,
  featured: z.boolean().optional(),
};

const softwareProjectSchema = z.object({
  ...baseProjectSchema,
  thumbnail: z.string().optional(),
	sourcecode: z.string().optional(),
  demo: z.string().optional(),
	post: reference("projects").optional(),
});

const artProjectSchema = z.object({
  ...baseProjectSchema,
  image: z.string(),
});

const musicTrackSchema = z.object({
  ...baseProjectSchema,
  src: z.string(),
  albumArt: z.string().optional(),
});

export const collections = {
  projects: defineCollection({ 
		loader: glob({pattern: '**\/[^_]*.json', base: "./src/content/projects"}),
		schema: softwareProjectSchema 
	}),
  art: defineCollection({
		loader: glob({pattern: '**\/[^_]*.json', base: "./src/content/art"}),
    schema: artProjectSchema,
  }),
  music: defineCollection({
		loader: glob({pattern: '**\/[^_]*.json', base: "./src/content/music"}),
    schema: musicTrackSchema,
  }),
};
