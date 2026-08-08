export default function EmptyState({ message, actionLabel, actionHref }: { message: string; actionLabel?: string; actionHref?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-300 py-16 text-center">
      <p className="text-neutral-500">{message}</p>
      {actionLabel && actionHref && (
        <a href={actionHref} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          {actionLabel}
        </a>
      )}
    </div>
  );
}
