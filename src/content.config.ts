import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    summary: z.string().optional(),

    // ✅ 关键：兼容 string/date，并统一转 Date
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    type: z.string().optional(),
    game: z.string().optional(),

    region: z.array(z.string()).optional(),
    regions: z.array(z.string()).optional(),

    tags: z.array(z.string()).optional(),
    series: z.array(z.string()).optional(),

    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = { blog };