'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/auth/actions';

const initialState = { error: undefined as string | undefined };

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, isPending] = useActionState(authenticate, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? '/admin/dashboard'} />
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">البريد الإلكتروني</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">كلمة المرور</label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
      </button>
    </form>
  );
}
