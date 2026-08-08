import 'server-only';
import { prisma } from '@/lib/db/prisma';

/** المفاتيح الأساسية التي تقابل companyInfo القديم في lib/data.ts */
export const SETTINGS_KEYS = [
  'company_name',
  'company_tagline',
  'company_seo_description',
  'company_phone',
  'company_whatsapp',
  'company_email',
] as const;

export type SettingsMap = Record<(typeof SETTINGS_KEYS)[number], string>;

export async function getAllSettings(): Promise<Partial<SettingsMap>> {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Partial<SettingsMap>;
}

export async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return row?.value ?? null;
}
