import 'server-only';
import { auth } from '@/auth';

export class UnauthorizedError extends Error {
  constructor(message = 'غير مصرح لك بتنفيذ هذا الإجراء') {
    super(message);
  }
}

/** يتأكد من وجود جلسة صالحة — يُستخدم في بداية كل Server Action إداري. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new UnauthorizedError('يجب تسجيل الدخول أولًا');
  }
  return session;
}

/** يتأكد من أن المستخدم الحالي مدير (ADMIN) — للعمليات الحساسة كالحذف وإدارة المستخدمين. */
export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== 'ADMIN') {
    throw new UnauthorizedError('هذا الإجراء متاح للمدير (ADMIN) فقط');
  }
  return session;
}
