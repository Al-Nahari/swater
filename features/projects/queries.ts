import 'server-only';
import { prisma } from '@/lib/db/prisma';
import type { ContentStatus, Prisma } from '@prisma/client';

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { order: 'asc' } }, service: true },
  });
}

export async function getPublishedProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, status: 'PUBLISHED', deletedAt: null },
    include: { images: { orderBy: { order: 'asc' } }, service: true },
  });
}

export async function getAllPublishedProjectSlugs() {
  const projects = await prisma.project.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    select: { slug: true, updatedAt: true },
  });
  return projects;
}

export async function listProjectsForAdmin({
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
  const where: Prisma.ProjectWhereInput = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { region: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { service: { select: { title: true, slug: true } }, _count: { select: { images: true } } },
    }),
    prisma.project.count({ where }),
  ]);

  return { items, total, page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  });
}

export async function getProjectCount() {
  return prisma.project.count({ where: { deletedAt: null } });
}

/** يُستخدم في نموذج المشروع لاختيار الخدمة المرتبطة */
export async function getServiceOptions() {
  return prisma.service.findMany({
    where: { deletedAt: null },
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  });
}
