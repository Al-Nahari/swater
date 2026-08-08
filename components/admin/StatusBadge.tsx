const STYLES: Record<string, string> = {
  DRAFT: 'bg-amber-100 text-amber-800',
  PUBLISHED: 'bg-emerald-100 text-emerald-800',
  ARCHIVED: 'bg-neutral-200 text-neutral-600',
};

const LABELS: Record<string, string> = {
  DRAFT: 'مسودة',
  PUBLISHED: 'منشور',
  ARCHIVED: 'مؤرشف',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status] ?? ''}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
