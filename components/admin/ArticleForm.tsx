'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle, updateArticle } from '@/features/articles/actions';
import type { Article, Category } from '@prisma/client';

type Props = {
  article?: Article;
  categories: Category[];
};

const initialState = { success: false as boolean, error: undefined as string | undefined };

export default function ArticleForm({ article, categories }: Props) {
  const router = useRouter();
  const isEdit = !!article;

  const action = async (_prev: typeof initialState, formData: FormData) => {
    const result = isEdit ? await updateArticle(article.id, formData) : await createArticle(formData);
    if (result.success) {
      router.push('/admin/articles');
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
          <input name="title" defaultValue={article?.title} required className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الرابط (slug) *</label>
          <input name="slug" defaultValue={article?.slug} required dir="ltr" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">مقتطف قصير (Excerpt) *</label>
        <textarea name="excerpt" defaultValue={article?.excerpt} required rows={2} maxLength={300} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">المحتوى *</label>
        <textarea name="content" defaultValue={article?.content} required rows={14} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        <p className="text-xs text-neutral-500 mt-1">
          يدعم HTML بسيط (فقرات، عناوين، روابط). يُعقَّم تلقائيًا قبل النشر لمنع XSS.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">رابط الصورة الرئيسية</label>
          <input name="coverImage" defaultValue={article?.coverImage ?? ''} dir="ltr" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Alt Text للصورة</label>
          <input name="coverImageAlt" defaultValue={article?.coverImageAlt ?? ''} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">التصنيف</label>
          <select name="categoryId" defaultValue={article?.categoryId ?? ''} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
            <option value="">— بدون —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الحالة</label>
          <select name="status" defaultValue={article?.status ?? 'DRAFT'} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm">
            <option value="DRAFT">مسودة</option>
            <option value="PUBLISHED">منشور</option>
            <option value="ARCHIVED">مؤرشف</option>
          </select>
        </div>
      </div>

      <fieldset className="rounded-lg border border-neutral-200 p-4">
        <legend className="text-sm font-semibold px-1">SEO</legend>
        <div className="space-y-3">
          <input name="metaTitle" placeholder="Meta Title" defaultValue={article?.metaTitle ?? ''} maxLength={70} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
          <textarea name="metaDescription" placeholder="Meta Description" defaultValue={article?.metaDescription ?? ''} maxLength={160} rows={2} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={isPending} className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
        {isPending ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء المقال'}
      </button>
    </form>
  );
}
