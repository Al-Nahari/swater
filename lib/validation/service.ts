import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const serviceSchema = z.object({
  slug: z.string().min(3).regex(slugRegex, 'الرابط يجب أن يكون أحرف إنجليزية صغيرة وأرقام وشرطات فقط'),
  title: z.string().min(3, 'العنوان قصير جدًا'),
  shortTitle: z.string().optional(),
  description: z.string().min(10, 'الوصف المختصر قصير جدًا'),
  fullDescription: z.string().min(20, 'المحتوى الكامل قصير جدًا'),
  keywords: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  priority: z.coerce.number().int().min(1).max(3).default(2),
  coverImage: z.string().url().optional().or(z.literal('')),
  coverImageAlt: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  order: z.coerce.number().int().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const faqSchema = z.object({
  question: z.string().min(3),
  answer: z.string().min(3),
  order: z.coerce.number().int().default(0),
});
