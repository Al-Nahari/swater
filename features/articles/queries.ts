import 'server-only';
import { prisma } from '@/lib/db/prisma';
import type { ContentStatus, Prisma } from '@prisma/client';

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  });
}

export async function getPublishedArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: 'PUBLISHED', deletedAt: null },
    include: { category: true },
  });
}

export async function getAllPublishedArticleSlugs() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    select: { slug: true, updatedAt: true },
  });
  return articles;
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
