'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { requireSession, requireAdmin } from '@/lib/auth/guard';
import { serviceSchema, faqSchema } from '@/lib/validation/service';
import { uploadImage, deleteImage } from '@/lib/storage/blob';

export type ActionResult = { success: true } | { success: false; error: string };

function revalidateServicePages(slug?: string) {
  revalidatePath('/admin/services');
  revalidatePath('/'); // الخدمات تظهر في الصفحة الرئيسية
  if (slug) revalidatePath(`/${slug}`);
  revalidatePath('/sitemap.xml');
}

export async function createService(formData: FormData): Promise<ActionResult> {
  await requireSession();

  const raw = Object.fromEntries(formData.entries());
  const parsed = serviceSchema.safeParse({
    ...raw,
    keywords: formData.getAll('keywords'),
    features: formData.getAll('features'),
    regions: formData.getAll('regions'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' };
  }

  const existing = await prisma.service.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { success: false, error: 'الرابط (slug) مستخدم بالفعل، اختر رابطًا آخر' };
  }

  await prisma.service.create({ data: parsed.data });
  revalidateServicePages(parsed.data.slug);
  return { success: true };
}

export async function updateService(id: string, formData: FormData): Promise<ActionResult> {
  await requireSession();

  const raw = Object.fromEntries(formData.entries());
  const parsed = serviceSchema.safeParse({
    ...raw,
    keywords: formData.getAll('keywords'),
    features: formData.getAll('features'),
    regions: formData.getAll('regions'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' };
  }

  const duplicate = await prisma.service.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (duplicate) {
    return { success: false, error: 'الرابط (slug) مستخدم بالفعل، اختر رابطًا آخر' };
  }

  await prisma.service.update({ where: { id }, data: parsed.data });
  revalidateServicePages(parsed.data.slug);
  return { success: true };
}

/** حذف ناعم (Soft Delete) — لا يحذف السجل فعليًا، فقط يخفيه من الموقع ولوحة الإدارة. */
export async function deleteService(id: string): Promise<ActionResult> {
  await requireAdmin();
  const service = await prisma.service.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'ARCHIVED' },
  });
  revalidateServicePages(service.slug);
  return { success: true };
}

export async function setServiceStatus(
  id: string,
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
): Promise<ActionResult> {
  await requireSession();
  const service = await prisma.service.update({ where: { id }, data: { status } });
  revalidateServicePages(service.slug);
  return { success: true };
}

export async function addServiceImage(serviceId: string, formData: FormData): Promise<ActionResult> {
  await requireSession();

  const file = formData.get('file') as File | null;
  const alt = String(formData.get('alt') ?? '');
  const caption = formData.get('caption') ? String(formData.get('caption')) : undefined;
  const isCover = formData.get('isCover') === 'true';

  if (!file || file.size === 0) {
    return { success: false, error: 'لم يتم اختيار ملف' };
  }
  if (!alt || alt.trim().length < 3) {
    return { success: false, error: 'Alt Text مطلوب لكل صورة' };
  }

  try {
    const uploaded = await uploadImage(file, 'services');

    if (isCover) {
      await prisma.serviceImage.updateMany({ where: { serviceId }, data: { isCover: false } });
    }

    await prisma.serviceImage.create({
      data: {
        serviceId,
        url: uploaded.url,
        blobId: uploaded.blobId,
        alt,
        caption,
        isCover,
      },
    });

    if (isCover) {
      await prisma.service.update({
        where: { id: serviceId },
        data: { coverImage: uploaded.url, coverImageAlt: alt },
      });
    }

    revalidatePath('/admin/services');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'فشل رفع الصورة' };
  }
}

export async function deleteServiceImage(imageId: string): Promise<ActionResult> {
  await requireSession();
  const image = await prisma.serviceImage.findUnique({ where: { id: imageId } });
  if (!image) return { success: false, error: 'الصورة غير موجودة' };

  await deleteImage(image.url).catch(() => null); // لا نوقف العملية إن فشل الحذف من التخزين
  await prisma.serviceImage.delete({ where: { id: imageId } });
  revalidatePath('/admin/services');
  return { success: true };
}

export async function addServiceFaq(serviceId: string, formData: FormData): Promise<ActionResult> {
  await requireSession();
  const parsed = faqSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' };
  }
  await prisma.faq.create({ data: { serviceId, ...parsed.data } });
  revalidatePath('/admin/services');
  return { success: true };
}

export async function deleteServiceFaq(faqId: string): Promise<ActionResult> {
  await requireSession();
  await prisma.faq.delete({ where: { id: faqId } });
  revalidatePath('/admin/services');
  return { success: true };
}
