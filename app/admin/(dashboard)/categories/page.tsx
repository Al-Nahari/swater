import { prisma } from '@/lib/db/prisma';
import { createCategory } from '@/features/articles/actions';
import { revalidatePath } from 'next/cache';

async function handleCreate(formData: FormData) {
  'use server';
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  if (!name || !slug) return;
  await createCategory(name, slug);
  revalidatePath('/admin/categories');
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">التصنيفات</h1>

      <form action={handleCreate} className="flex flex-wrap gap-2 mb-6 rounded-xl border border-neutral-200 bg-white p-4">
        <input name="name" placeholder="اسم التصنيف" required className="rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        <input name="slug" placeholder="الرابط (slug)" required dir="ltr" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono" />
        <button type="submit" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          إضافة
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="text-sm text-neutral-500">لا توجد تصنيفات بعد.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-right font-medium">الاسم</th>
                <th className="px-4 py-3 text-right font-medium">الرابط</th>
                <th className="px-4 py-3 text-right font-medium">عدد المقالات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-neutral-900">{c.name}</td>
                  <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-neutral-500">{c._count.articles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
