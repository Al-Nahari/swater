'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { requireSession, requireAdmin } from '@/lib/auth/guard';
import { projectSchema } from '@/lib/validation/project';
import { uploadImage, deleteImage } from '@/lib/storage/blob';
import type { ActionResult } from '@/features/services/actions';

function revalidateProjectPages(slug?: string) {
  revalidatePath('/admin/projects');
  revalidatePath('/gallery');
  if (slug) revalidatePath(`/gallery/${slug}`);
  revalidatePath('/sitemap.xml');
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  await requireSession();

  const raw = Object.fromEntries(formData.entries());
  const parsed = projectSchema.safeParse({
    ...raw,
    keywords: formData.getAll('keywords'),
    serviceId: raw.serviceId || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' };
  }

  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { success: false, error: 'الرابط (slug) مستخدم بالفعل، اختر رابطًا آخر' };
  }

  const { serviceId, ...data } = parsed.data;
  await prisma.project.create({
    data: { ...data, ...(serviceId ? { service: { connect: { id: serviceId } } } : {}) },
  });

  revalidateProjectPages(parsed.data.slug);
  return { success: true };
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResult> {
  await requireSession();

  const raw = Object.fromEntries(formData.entries());
  const parsed = projectSchema.safeParse({
    ...raw,
    keywords: formData.getAll('keywords'),
    serviceId: raw.serviceId || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' };
  }

  const duplicate = await prisma.project.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (duplicate) {
    return { success: false, error: 'الرابط (slug) مستخدم بالفعل، اختر رابطًا آخر' };
  }

  const { serviceId, ...data } = parsed.data;
  await prisma.project.update({
    where: { id },
    data: {
      ...data,
      service: serviceId ? { connect: { id: serviceId } } : { disconnect: true },
    },
  });

  revalidateProjectPages(parsed.data.slug);
  return { success: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  const project = await prisma.project.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'ARCHIVED' },
  });
  revalidateProjectPages(project.slug);
  return { success: true };
}

export async function setProjectStatus(
  id: string,
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
): Promise<ActionResult> {
  await requireSession();
  const project = await prisma.project.update({ where: { id }, data: { status } });
  revalidateProjectPages(project.slug);
  return { success: true };
}

export async function addProjectImage(projectId: string, formData: FormData): Promise<ActionResult> {
  await requireSession();

  const file = formData.get('file') as File | null;
  const alt = String(formData.get('alt') ?? '');
  const caption = formData.get('caption') ? String(formData.get('caption')) : undefined;
  const isCover = formData.get('isCover') === 'true';

  if (!file || file.size === 0) return { success: false, error: 'لم يتم اختيار ملف' };
  if (!alt || alt.trim().length < 3) return { success: false, error: 'Alt Text مطلوب لكل صورة' };

  try {
    const uploaded = await uploadImage(file, 'projects');

    if (isCover) {
      await prisma.projectImage.updateMany({ where: { projectId }, data: { isCover: false } });
    }

    await prisma.projectImage.create({
      data: { projectId, url: uploaded.url, blobId: uploaded.blobId, alt, caption, isCover },
    });

    if (isCover) {
      await prisma.project.update({
        where: { id: projectId },
        data: { coverImage: uploaded.url, coverImageAlt: alt },
      });
    }

    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'فشل رفع الصورة' };
  }
}

export async function deleteProjectImage(imageId: string): Promise<ActionResult> {
  await requireSession();
  const image = await prisma.projectImage.findUnique({ where: { id: imageId } });
  if (!image) return { success: false, error: 'الصورة غير موجودة' };

  await deleteImage(image.url).catch(() => null);
  await prisma.projectImage.delete({ where: { id: imageId } });
  revalidatePath('/admin/projects');
  return { success: true };
}
