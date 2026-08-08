'use server';

import { revalidatePath } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import { prisma } from '@/lib/db/prisma';
import { requireSession, requireAdmin } from '@/lib/auth/guard';
import { articleSchema } from '@/lib/validation/article';
import type { ActionResult } from '@/features/services/actions';

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['h2', 'h3', 'h4', 'p', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'br', 'img'],
  allowedAttributes: {
    a: ['href', 'rel', 'target'],
    img: ['src', 'alt'],
  },
  allowedSchemes: ['https'],
};

function revalidateArticlePages(slug?: string) {
  revalidatePath('/admin/articles');
  revalidatePath('/blog');
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath('/sitemap.xml');
}

export async function createArticle(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();
  const authorId = session.user.id;

  const raw = Object.fromEntries(formData.entries());
  const parsed = articleSchema.safeParse({
    ...raw,
    keywords: formData.getAll('keywords'),
    categoryId: raw.categoryId || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' };
  }

  const existing = await prisma.article.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { success: false, error: 'الرابط (slug) مستخدم بالفعل' };

  const { categoryId, ...data } = parsed.data;
  data.content = sanitizeHtml(data.content, SANITIZE_OPTIONS);
  await prisma.article.create({
    data: {
      ...data,
      authorId,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
    },
  });

  revalidateArticlePages(parsed.data.slug);
  return { success: true };
}

export async function updateArticle(id: string, formData: FormData): Promise<ActionResult> {
  await requireSession();

  const raw = Object.fromEntries(formData.entries());
  const parsed = articleSchema.safeParse({
    ...raw,
    keywords: formData.getAll('keywords'),
    categoryId: raw.categoryId || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' };
  }

  const duplicate = await prisma.article.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (duplicate) return { success: false, error: 'الرابط (slug) مستخدم بالفعل' };

  const current = await prisma.article.findUnique({ where: { id }, select: { publishedAt: true } });
  const { categoryId, ...data } = parsed.data;
  data.content = sanitizeHtml(data.content, SANITIZE_OPTIONS);

  await prisma.article.update({
    where: { id },
    data: {
      ...data,
      publishedAt:
        data.status === 'PUBLISHED' ? current?.publishedAt ?? new Date() : current?.publishedAt ?? null,
      category: categoryId ? { connect: { id: categoryId } } : { disconnect: true },
    },
  });

  revalidateArticlePages(parsed.data.slug);
  return { success: true };
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  await requireAdmin();
  const article = await prisma.article.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'ARCHIVED' },
  });
  revalidateArticlePages(article.slug);
  return { success: true };
}

export async function createCategory(name: string, slug: string): Promise<ActionResult> {
  await requireSession();
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { success: false, error: 'التصنيف موجود بالفعل' };
  await prisma.category.create({ data: { name, slug } });
  revalidatePath('/admin/categories');
  return { success: true };
}
