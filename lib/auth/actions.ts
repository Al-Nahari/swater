'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export async function authenticate(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: (formData.get('callbackUrl') as string) || '/admin/dashboard',
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        default:
          return { error: 'حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى' };
      }
    }
    // NextAuth يستخدم redirect داخليًا عبر رمي خطأ خاص — يجب إعادة رميه ليعمل التوجيه
    throw error;
  }
}
