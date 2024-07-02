import { z, defineCollection } from "astro:content";

const projectSchema = z.object({
	title: z.string(),
	id: z.string(),
	description: z.string(),
	thumbnail: z.string(),
	featured: z.boolean().optional(),
	demo: z.string().optional(),
	tags: z.array(z.string()).optional(),
	content: z.array(
		z
			.object({
				type: z.enum(["video", "image", "code", "text"]),
				src: z.string(),
				description: z.string().optional(),
				thumbnail: z.string().optional(),
			})
			,
	).optional(),
});

const projects = defineCollection({
	type: "data",
	schema: projectSchema,
});

export const collections = {
	projects,
};
