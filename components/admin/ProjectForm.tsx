'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject, updateProject } from '@/features/projects/actions';
import type { Project } from '@prisma/client';

type Props = {
  project?: Project;
  serviceOptions: { id: string; title: string }[];
};

const initialState = { success: false as boolean, error: undefined as string | undefined };

export default function ProjectForm({ project, serviceOptions }: Props) {
  const router = useRouter();
  const isEdit = !!project;

  const action = async (_prev: typeof initialState, formData: FormData) => {
    const result = isEdit ? await updateProject(project.id, formData) : await createProject(formData);
    if (result.success) {
      router.push('/admin/projects');
      router.refresh();
      return { success: true, error: undefined };
    }
    return { success: false, error: result.error };
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  if (isEdit && !project.coverImage) {
    // نادراً ما يحدث لأن coverImage مطلوب في المخطط، لكن كإجراء احترازي
  }

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {!isEdit && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          أنشئ المشروع أولًا بصورة رئيسية مؤقتة (رابط أي صورة)، ثم بعد الحفظ استخدم قسم &quot;صور المشروع&quot; لرفع الصور الفعلية
          وتحديد الصورة الرئيسية النهائية.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">العنوان *</label>
          <input name="title" defaultValue={project?.title} required className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الرابط (slug) *</label>
          <input name="slug" defaultValue={project?.slug} required dir="ltr" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">الخدمة المرتبطة</label>
          <select name="serviceId" defaultValue={project?.serviceId ?? ''} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
            <option value="">— بدون —</option>
            {serviceOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">المنطقة</label>
          <input name="region" defaultValue={project?.region ?? ''} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ملخص قصير *</label>
        <textarea name="summary" defaultValue={project?.summary} required rows={2} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الوصف الكامل *</label>
        <textarea name="description" defaultValue={project?.description} required rows={8} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">رابط الصورة الرئيسية *</label>
          <input name="coverImage" defaultValue={project?.coverImage} required dir="ltr" placeholder="https://...blob.vercel-storage.com/..." className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Alt Text للصورة الرئيسية *</label>
          <input name="coverImageAlt" defaultValue={project?.coverImageAlt} required className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">تاريخ التنفيذ</label>
          <input
            type="date"
            name="completedAt"
            defaultValue={project?.completedAt ? new Date(project.completedAt).toISOString().slice(0, 10) : ''}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الحالة</label>
          <select name="status" defaultValue={project?.status ?? 'DRAFT'} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
            <option value="DRAFT">مسودة</option>
            <option value="PUBLISHED">منشور</option>
            <option value="ARCHIVED">مؤرشف</option>
          </select>
        </div>
      </div>

      <fieldset className="rounded-lg border border-neutral-200 p-4">
        <legend className="text-sm font-semibold px-1">SEO</legend>
        <div className="space-y-3">
          <input name="metaTitle" placeholder="Meta Title" defaultValue={project?.metaTitle ?? ''} maxLength={70} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
          <textarea name="metaDescription" placeholder="Meta Description" defaultValue={project?.metaDescription ?? ''} maxLength={160} rows={2} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={isPending} className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
        {isPending ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء المشروع'}
      </button>
    </form>
  );
}
