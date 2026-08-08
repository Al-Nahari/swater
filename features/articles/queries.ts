import 'server-only';
import { prisma } from '@/lib/db/prisma';
import type { ContentStatus, Prisma } from '@prisma/client';

export async function getPublishedArticles() {
  // لا يوجد fallback ثابت للمدونة (محتوى DB بالكامل)، لذا عند فشل الاتصال
  // نُعيد قائمة فارغة بدل إسقاط الصفحة/البناء بالكامل.
  try {
    return await prisma.article.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    });
  } catch (error) {
    console.warn('[getPublishedArticles] تعذّر الوصول لقاعدة البيانات:', error);
    return [];
  }
}

export async function getPublishedArticleBySlug(slug: string) {
  try {
    return await prisma.article.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { category: true },
    });
  } catch (error) {
    console.warn(`[getPublishedArticleBySlug] تعذّر الوصول لقاعدة البيانات لـ slug="${slug}":`, error);
    return null;
  }
}

export async function getAllPublishedArticleSlugs() {
  // تُستدعى هذه الدالة من generateStaticParams في app/blog/[slug]/page.tsx وقت
  // البناء (Build Time) على Vercel. أي عطل مؤقت في الاتصال بقاعدة البيانات (أو
  // متغير بيئة غير متاح في تلك اللحظة تحديدًا) لا يجب أن يُسقط البناء بالكامل؛
  // الصفحات ستُبنى عند أول طلب (on-demand) بفضل dynamicParams = true في الصفحة.
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: { slug: true, updatedAt: true },
    });
    return articles;
  } catch (error) {
    console.warn('[getAllPublishedArticleSlugs] تعذّر الوصول لقاعدة البيانات أثناء البناء، سيتم توليد صفحات المدونة عند الطلب:', error);
    return [];
  }
}

export async function listArticlesForAdmin({
  page = 1,
  pageSize = 20,
  search,
  status,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ContentStatus;
}) {
  const where: Prisma.ArticleWhereInput = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search
      ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }] }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: { select: { name: true } } },
    }),
    prisma.article.count({ where }),
  ]);

  return { items, total, page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({ where: { id } });
}

export async function getArticleCount() {
  return prisma.article.count({ where: { deletedAt: null } });
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}