import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// ملاحظة: بدءًا من Next.js 16.2.x أصبح ملف middleware.ts يُتجاهل بصمت واستُبدل
// باسم proxy.ts (نفس المنطق تمامًا، فقط تغيير الاسم لتوضيح أنه Network Boundary).
// انظر: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isLoginPage = nextUrl.pathname === '/admin/login';

  // السماح دائمًا بصفحة تسجيل الدخول نفسها
  if (isAdminRoute && isLoginPage) {
    // إن كان المستخدم مسجّلاً دخوله بالفعل، وجّهه مباشرة للوحة التحكم
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
    }
    return NextResponse.next();
  }

  // حماية أي مسار آخر تحت /admin
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL('/admin/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  // نطبّق الـ proxy فقط على مسارات لوحة الإدارة — لا يمس الموقع العام إطلاقًا
  matcher: ['/admin/:path*'],
};
