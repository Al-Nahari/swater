'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createService, updateService } from '@/features/services/actions';
import type { Service } from '@prisma/client';

type Props = {
  service?: Service;
};

const initialState = { success: false as boolean, error: undefined as string | undefined };

function TagListInput({ name, defaultValue }: { name: string; defaultValue: string[] }) {
  const [items, setItems] = useState<string[]>(defaultValue.length ? defaultValue : ['']);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            name={name}
            defaultValue={item}
            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            className="text-red-600 text-sm px-2"
          >
            حذف
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, ''])}
        className="text-sm text-neutral-600 hover:underline"
      >
        + إضافة عنصر
      </button>
    </div>
  );
}

export default function ServiceForm({ service }: Props) {
  const router = useRouter();
  const isEdit = !!service;

  const action = async (_prev: typeof initialState, formData: FormData) => {
    const result = isEdit ? await updateService(service.id, formData) : await createService(formData);
    if (result.success) {
      router.push('/admin/services');
      router.refresh();
      return { success: true, error: undefined };
    }
    return { success: false, error: result.error };
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">العنوان *</label>
          <input name="title" defaultValue={service?.title} required className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الرابط (slug) *</label>
          <input
            name="slug"
            defaultValue={service?.slug}
            required
            dir="ltr"
            placeholder="mazallat-sayarat-riyadh"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">العنوان المختصر</label>
        <input name="shortTitle" defaultValue={service?.shortTitle ?? ''} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الوصف المختصر *</label>
        <textarea name="description" defaultValue={service?.description} required rows={2} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">المحتوى الكامل *</label>
        <textarea name="fullDescription" defaultValue={service?.fullDescription} required rows={8} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">المميزات</label>
          <TagListInput name="features" defaultValue={service?.features ?? []} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">الكلمات المفتاحية</label>
          <TagListInput name="keywords" defaultValue={service?.keywords ?? []} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">المناطق المخدومة</label>
        <TagListInput name="regions" defaultValue={service?.regions ?? []} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">الأولوية</label>
          <select name="priority" defaultValue={service?.priority ?? 2} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
            <option value={1}>عالية</option>
            <option value={2}>متوسطة</option>
            <option value={3}>منخفضة</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الترتيب</label>
          <input type="number" name="order" defaultValue={service?.order ?? 0} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الحالة</label>
          <select name="status" defaultValue={service?.status ?? 'DRAFT'} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
            <option value="DRAFT">مسودة</option>
            <option value="PUBLISHED">منشور</option>
            <option value="ARCHIVED">مؤرشف</option>
          </select>
        </div>
      </div>

      <fieldset className="rounded-lg border border-neutral-200 p-4">
        <legend className="text-sm font-semibold px-1">SEO</legend>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <input name="metaTitle" defaultValue={service?.metaTitle ?? ''} maxLength={70} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <textarea name="metaDescription" defaultValue={service?.metaDescription ?? ''} maxLength={160} rows={2} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
          {isPending ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء الخدمة'}
        </button>
      </div>

      {isEdit && (
        <p className="text-xs text-neutral-500">
          لإدارة صور هذه الخدمة والأسئلة الشائعة، احفظ التعديلات أولًا ثم استخدم قسم الصور والأسئلة الشائعة أسفل هذه الصفحة (بعد إعادة التحميل).
        </p>
      )}
    </form>
  );
}
