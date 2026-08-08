'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/guard';
import { SETTINGS_KEYS } from './queries';
import type { ActionResult } from '@/features/services/actions';

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const updates = SETTINGS_KEYS.filter((key) => formData.has(key)).map((key) =>
    prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: String(formData.get(key)) },
      update: { value: String(formData.get(key)) },
    })
  );

  await prisma.$transaction(updates);

  // الإعدادات تُستخدم في كل صفحات الموقع (Header, Footer, LocalBusiness Schema...)
  revalidatePath('/', 'layout');
  return { success: true };
}
