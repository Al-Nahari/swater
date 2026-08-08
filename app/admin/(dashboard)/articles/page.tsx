import Link from 'next/link';
import { listArticlesForAdmin } from '@/features/articles/queries';
import { deleteArticle } from '@/features/articles/actions';
import StatusBadge from '@/components/admin/StatusBadge';
import Pagination from '@/components/admin/Pagination';
import EmptyState from '@/components/admin/EmptyState';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import ConfirmDeleteButton from '@/components/admin/ConfirmDeleteButton';
import type { ContentStatus } from '@prisma/client';

export default async function ArticlesListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const { page, search, status } = await searchParams;
  const currentPage = Number(page) || 1;

  const { items, pageCount } = await listArticlesForAdmin({
    page: currentPage,
    search,
    status: status as ContentStatus | undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">المقالات</h1>
        <Link href="/admin/articles/new" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          + إضافة مقال
        </Link>
      </div>

      <SearchFilterBar basePath="/admin/articles" search={search} status={status} />

      {items.length === 0 ? (
        <EmptyState message="لا توجد مقالات مطابقة." actionLabel="إضافة مقال جديد" actionHref="/admin/articles/new" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-right font-medium">العنوان</th>
                <th className="px-4 py-3 text-right font-medium">التصنيف</th>
                <th className="px-4 py-3 text-right font-medium">الحالة</th>
                <th className="px-4 py-3 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((article) => (
                <tr key={article.id}>
                  <td className="px-4 py-3 font-medium text-neutral-900">{article.title}</td>
                  <td className="px-4 py-3 text-neutral-500">{article.category?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/articles/${article.id}`} className="text-sm font-medium text-neutral-700 hover:underline">
                        تعديل
                      </Link>
                      <ConfirmDeleteButton action={deleteArticle.bind(null, article.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={currentPage} pageCount={pageCount} basePath="/admin/articles" searchParams={{ search, status }} />
    </div>
  );
}
