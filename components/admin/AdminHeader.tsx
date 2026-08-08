import { auth, signOut } from '@/auth';

export default async function AdminHeader() {
  const session = await auth();

  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
      <p className="text-sm text-neutral-600">
        مرحبًا، <span className="font-semibold text-neutral-900">{session?.user?.name}</span>
      </p>
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/admin/login' });
        }}
      >
        <button
          type="submit"
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          تسجيل الخروج
        </button>
      </form>
    </header>
  );
}
