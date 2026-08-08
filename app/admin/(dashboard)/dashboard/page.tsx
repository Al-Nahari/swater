import { prisma } from '@/lib/db/prisma';
import StatusBadge from '@/components/admin/StatusBadge';
import Link from 'next/link';

async function getDashboardData() {
  const [serviceCount, projectCount, articleCount, serviceImageCount, projectImageCount, userCount, recentProjects, recentArticles] =
    await Promise.all([
      prisma.service.count({ where: { deletedAt: null } }),
      prisma.project.count({ where: { deletedAt: null } }),
      prisma.article.count({ where: { deletedAt: null } }),
      prisma.serviceImage.count(),
      prisma.projectImage.count(),
      prisma.user.count(),
      prisma.project.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, status: true, createdAt: true },
      }),
      prisma.article.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, status: true, createdAt: true },
      }),
    ]);

  return {
    serviceCount,
    projectCount,
    articleCount,
    imageCount: serviceImageCount + projectImageCount,
    userCount,
    recentProjects,
    recentArticles,
  };
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-3xl font-bold text-neutral-900 mt-1">{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="الخدمات" value={data.serviceCount} />
        <StatCard label="الأعمال المنفذة" value={data.projectCount} />
        <StatCard label="المقالات" value={data.articleCount} />
        <StatCard label="الصور" value={data.imageCount} />
        <StatCard label="المستخدمون" value={data.userCount} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold text-neutral-900 mb-3">آخر الأعمال المضافة</h2>
          {data.recentProjects.length === 0 ? (
            <p className="text-sm text-neutral-500">لا توجد أعمال بعد.</p>
          ) : (
            <ul className="space-y-2">
              {data.recentProjects.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <Link href={`/admin/projects/${p.id}`} className="text-neutral-800 hover:underline">
                    {p.title}
                  </Link>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold text-neutral-900 mb-3">آخر المقالات</h2>
          {data.recentArticles.length === 0 ? (
            <p className="text-sm text-neutral-500">لا توجد مقالات بعد.</p>
          ) : (
            <ul className="space-y-2">
              {data.recentArticles.map((a) => (
                <li key={a.id} className="flex items-center justify-between text-sm">
                  <Link href={`/admin/articles/${a.id}`} className="text-neutral-800 hover:underline">
                    {a.title}
                  </Link>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
