import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			type: z.enum(['note', 'analysis', 'report']).optional().default('analysis'),
			series: z.array(z.string()).optional().default([]),
			tags: z.array(z.string()).optional().default([]),
			game: z.string().optional().default(''),
			region: z.array(z.string()).optional().default([]),
			summary: z.string().optional().default(''),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			image: image().optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { blog };
