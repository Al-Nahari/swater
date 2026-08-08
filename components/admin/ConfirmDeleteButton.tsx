'use client';

import { useTransition } from 'react';

export default function ConfirmDeleteButton({
  action,
  confirmMessage = 'هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.',
  label = 'حذف',
}: {
  action: () => Promise<{ success: boolean; error?: string }>;
  confirmMessage?: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          const result = await action();
          if (!result.success) {
            window.alert(result.error ?? 'حدث خطأ أثناء الحذف');
          }
        });
      }}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {isPending ? 'جارٍ الحذف...' : label}
    </button>
  );
}
