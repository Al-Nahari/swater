export default function SearchFilterBar({
  basePath,
  search,
  status,
}: {
  basePath: string;
  search?: string;
  status?: string;
}) {
  return (
    <form action={basePath} method="get" className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        name="search"
        defaultValue={search}
        placeholder="بحث بالعنوان أو الرابط..."
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-neutral-900"
      />
      <select
        name="status"
        defaultValue={status ?? ''}
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
      >
        <option value="">كل الحالات</option>
        <option value="DRAFT">مسودة</option>
        <option value="PUBLISHED">منشور</option>
        <option value="ARCHIVED">مؤرشف</option>
      </select>
      <button type="submit" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
        بحث
      </button>
    </form>
  );
}
