import 'server-only';
import { prisma } from '@/lib/db/prisma';
import type { ContentStatus, Prisma } from '@prisma/client';

/** يُستخدم في الموقع العام — الخدمات المنشورة فقط، مرتبة كما في لوحة الإدارة */
export async function getPublishedServices() {
  return prisma.service.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    orderBy: [{ order: 'asc' }, { priority: 'asc' }],
    include: {
      images: { orderBy: { order: 'asc' } },
      faqs: { orderBy: { order: 'asc' } },
    },
  });
}

export async function getPublishedServiceBySlug(slug: string) {
  return prisma.service.findFirst({
    where: { slug, status: 'PUBLISHED', deletedAt: null },
    include: {
      images: { orderBy: { order: 'asc' } },
      faqs: { orderBy: { order: 'asc' } },
    },
  });
}

export async function getAllPublishedServiceSlugs() {
  const services = await prisma.service.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    select: { slug: true },
  });
  return services.map((s) => s.slug);
}

/** لوحة الإدارة — قائمة مع بحث و Pagination على مستوى قاعدة البيانات */
export async function listServicesForAdmin({
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
  const where: Prisma.ServiceWhereInput = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { images: true, projects: true } } },
    }),
    prisma.service.count({ where }),
  ]);

  return { items, total, page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      faqs: { orderBy: { order: 'asc' } },
    },
  });
}

export async function getServiceCount() {
  return prisma.service.count({ where: { deletedAt: null } });
}
