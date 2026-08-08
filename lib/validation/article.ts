import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const articleSchema = z.object({
  slug: z.string().min(3).regex(slugRegex, 'الرابط يجب أن يكون أحرف إنجليزية صغيرة وأرقام وشرطات فقط'),
  title: z.string().min(3),
  excerpt: z.string().min(10).max(300),
  content: z.string().min(50),
  coverImage: z.string().url().optional().or(z.literal('')),
  coverImageAlt: z.string().optional(),
  categoryId: z.string().cuid().optional().or(z.literal('')),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export type ArticleInput = z.infer<typeof articleSchema>;
