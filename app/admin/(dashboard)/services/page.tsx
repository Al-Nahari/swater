import Link from 'next/link';
import { listServicesForAdmin } from '@/features/services/queries';
import { deleteService } from '@/features/services/actions';
import StatusBadge from '@/components/admin/StatusBadge';
import Pagination from '@/components/admin/Pagination';
import EmptyState from '@/components/admin/EmptyState';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import ConfirmDeleteButton from '@/components/admin/ConfirmDeleteButton';
import type { ContentStatus } from '@prisma/client';

export default async function ServicesListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const { page, search, status } = await searchParams;
  const currentPage = Number(page) || 1;

  const { items, pageCount } = await listServicesForAdmin({
    page: currentPage,
    search,
    status: status as ContentStatus | undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">الخدمات</h1>
        <Link
          href="/admin/services/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + إضافة خدمة
        </Link>
      </div>

      <SearchFilterBar basePath="/admin/services" search={search} status={status} />

      {items.length === 0 ? (
        <EmptyState message="لا توجد خدمات مطابقة." actionLabel="إضافة خدمة جديدة" actionHref="/admin/services/new" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-right font-medium">العنوان</th>
                <th className="px-4 py-3 text-right font-medium">الرابط</th>
                <th className="px-4 py-3 text-right font-medium">الصور</th>
                <th className="px-4 py-3 text-right font-medium">الحالة</th>
                <th className="px-4 py-3 text-right font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((service) => (
                <tr key={service.id}>
                  <td className="px-4 py-3 font-medium text-neutral-900">{service.title}</td>
                  <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{service.slug}</td>
                  <td className="px-4 py-3 text-neutral-500">{service._count.images}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={service.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/services/${service.id}`} className="text-sm font-medium text-neutral-700 hover:underline">
                        تعديل
                      </Link>
                      <ConfirmDeleteButton action={deleteService.bind(null, service.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        basePath="/admin/services"
        searchParams={{ search, status }}
      />
    </div>
  );
}
