import Link from 'next/link';

export default function Pagination({
  page,
  pageCount,
  basePath,
  searchParams,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  function buildHref(targetPage: number) {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v) as [string, string][]
    );
    params.set('page', String(targetPage));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`rounded-md border px-3 py-1.5 text-sm ${
          page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-neutral-100'
        }`}
      >
        السابق
      </Link>
      <span className="text-sm text-neutral-600">
        صفحة {page} من {pageCount}
      </span>
      <Link
        href={buildHref(Math.min(pageCount, page + 1))}
        aria-disabled={page >= pageCount}
        className={`rounded-md border px-3 py-1.5 text-sm ${
          page >= pageCount ? 'pointer-events-none opacity-40' : 'hover:bg-neutral-100'
        }`}
      >
        التالي
      </Link>
    </div>
  );
}
