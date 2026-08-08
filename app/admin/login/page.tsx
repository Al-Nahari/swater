import LoginForm from '@/components/admin/LoginForm';

export const metadata = { title: 'تسجيل الدخول — لوحة الإدارة', robots: { index: false, follow: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4" dir="rtl">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-neutral-900 mb-1">لوحة الإدارة</h1>
        <p className="text-sm text-neutral-500 mb-6">سجّل الدخول لإدارة محتوى الموقع</p>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
