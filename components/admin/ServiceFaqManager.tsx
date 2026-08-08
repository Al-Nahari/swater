'use client';

import { useRef, useTransition } from 'react';
import { addServiceFaq, deleteServiceFaq } from '@/features/services/actions';
import type { Faq } from '@prisma/client';

export default function ServiceFaqManager({ serviceId, faqs }: { serviceId: string; faqs: Faq[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const result = await addServiceFaq(serviceId, formData);
      if (result.success) formRef.current?.reset();
    });
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <h2 className="font-semibold text-neutral-900 mb-4">الأسئلة الشائعة</h2>

      <form ref={formRef} action={handleAdd} className="space-y-2 mb-6 border-b border-neutral-100 pb-6">
        <input name="question" placeholder="السؤال" required className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        <textarea name="answer" placeholder="الإجابة" required rows={2} className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" />
        <button type="submit" disabled={isPending} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {isPending ? 'جارٍ الإضافة...' : 'إضافة سؤال'}
        </button>
      </form>

      {faqs.length === 0 ? (
        <p className="text-sm text-neutral-500">لا توجد أسئلة بعد.</p>
      ) : (
        <ul className="space-y-3">
          {faqs.map((faq) => (
            <li key={faq.id} className="border border-neutral-100 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm text-neutral-900">{faq.question}</p>
                  <p className="text-sm text-neutral-600 mt-1">{faq.answer}</p>
                </div>
                <DeleteFaqButton faqId={faq.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DeleteFaqButton({ faqId }: { faqId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => { void deleteServiceFaq(faqId); })}
      className="shrink-0 text-xs text-red-600 hover:underline disabled:opacity-50"
    >
      حذف
    </button>
  );
}
