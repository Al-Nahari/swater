import Link from 'next/link';
import { listProjectsForAdmin } from '@/features/projects/queries';
import { deleteProject } from '@/features/projects/actions';
import StatusBadge from '@/components/admin/StatusBadge';
import Pagination from '@/components/admin/Pagination';
import EmptyState from '@/components/admin/EmptyState';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import ConfirmDeleteButton from '@/components/admin/ConfirmDeleteButton';
import type { ContentStatus } from '@prisma/client';

export default async function ProjectsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const { page, search, status } = await searchParams;
  const currentPage = Number(page) || 1;

  const { items, pageCount } = await listProjectsForAdmin({
    page: currentPage,
    search,
    status: status as ContentStatus | undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">الأعمال المنفذة</h1>
        <Link href="/admin/projects/new" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          + إضافة عمل جديد
        </Link>
      </div>

      <SearchFilterBar basePath="/admin/projects" search={search} status={status} />

      {items.length === 0 ? (
        <EmptyState message="لا توجد أعمال مطابقة." actionLabel="إضافة عمل جديد" actionHref="/admin/projects/new" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-right font-medium">العنوان</th>
                <th className="px-4 py-3 text-right font-medium">الخدمة</th>
                <th className="px-4 py-3 text-right font-medium">المنطقة</th>
                <th className="px-4 py-3 text-right font-medium">الصور</th>
                <th className="px-4 py-3 text-right font-medium">الحالة</th>
                <th className="px-4 py-3 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((project) => (
                <tr key={project.id}>
                  <td className="px-4 py-3 font-medium text-neutral-900">{project.title}</td>
                  <td className="px-4 py-3 text-neutral-500">{project.service?.title ?? '—'}</td>
                  <td className="px-4 py-3 text-neutral-500">{project.region ?? '—'}</td>
                  <td className="px-4 py-3 text-neutral-500">{project._count.images}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/projects/${project.id}`} className="text-sm font-medium text-neutral-700 hover:underline">
                        تعديل
                      </Link>
                      <ConfirmDeleteButton action={deleteProject.bind(null, project.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={currentPage} pageCount={pageCount} basePath="/admin/projects" searchParams={{ search, status }} />
    </div>
  );
}
