import { getAllSettings } from '@/features/settings/queries';
import { updateSettings } from '@/features/settings/actions';
import { companyInfo } from '@/lib/data';

async function handleUpdateSettings(formData: FormData) {
  'use server';
  await updateSettings(formData);
}

const FIELDS: { key: string; label: string; fallback: string }[] = [
  { key: 'company_name', label: 'اسم الشركة', fallback: companyInfo.name },
  { key: 'company_tagline', label: 'الشعار/الوصف القصير', fallback: companyInfo.tagline ?? '' },
  { key: 'company_seo_description', label: 'وصف SEO العام', fallback: companyInfo.seoDescription ?? '' },
  { key: 'company_phone', label: 'رقم الهاتف', fallback: companyInfo.phone ?? '' },
  { key: 'company_whatsapp', label: 'رقم الواتساب', fallback: companyInfo.whatsapp ?? '' },
  { key: 'company_email', label: 'البريد الإلكتروني', fallback: companyInfo.email ?? '' },
];

export default async function SettingsPage() {
  const settings = await getAllSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">إعدادات الموقع</h1>
      <p className="text-sm text-neutral-500 mb-6">
        هذه القيم تحل تدريجيًا محل البيانات الثابتة في الكود. القيم الحالية معروضة كافتراضي حتى تُحفظ من هنا.
      </p>

      <form action={handleUpdateSettings} className="space-y-4 max-w-xl rounded-xl border border-neutral-200 bg-white p-5">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <input
              name={field.key}
              defaultValue={settings[field.key as keyof typeof settings] ?? field.fallback}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        ))}
        <button type="submit" className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">
          حفظ الإعدادات
        </button>
      </form>
    </div>
  );
}
