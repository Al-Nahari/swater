import { PrismaClient } from '@prisma/client';

// نمنع إنشاء اتصال جديد بقاعدة البيانات مع كل Hot Reload في التطوير،
// ونضمن Singleton واحد فقط خلال دورة حياة كل Serverless Function في الإنتاج.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
