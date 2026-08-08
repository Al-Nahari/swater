import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const projectSchema = z.object({
  slug: z.string().min(3).regex(slugRegex, 'الرابط يجب أن يكون أحرف إنجليزية صغيرة وأرقام وشرطات فقط'),
  title: z.string().min(3),
  summary: z.string().min(5),
  description: z.string().min(20),
  region: z.string().optional(),
  serviceId: z.string().cuid().optional().or(z.literal('')),
  coverImage: z.string().url('يجب رفع صورة رئيسية أولاً'),
  coverImageAlt: z.string().min(3, 'Alt Text للصورة الرئيسية مطلوب'),
  completedAt: z.coerce.date().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  keywords: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export type ProjectInput = z.infer<typeof projectSchema>;
