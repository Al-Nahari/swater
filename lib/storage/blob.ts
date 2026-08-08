import { put, del } from '@vercel/blob';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export class InvalidUploadError extends Error {}

/**
 * يرفع صورة إلى Vercel Blob بعد التحقق من النوع والحجم.
 * يُستدعى فقط من Server Actions / Route Handlers — لا يُستورد أبدًا داخل Client Components.
 */
export async function uploadImage(file: File, folder: 'services' | 'projects' | 'articles') {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new InvalidUploadError('نوع الملف غير مسموح به. الأنواع المسموحة: JPG, PNG, WEBP, AVIF');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new InvalidUploadError('حجم الملف يتجاوز الحد المسموح به (8MB)');
  }

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]/g, '-')
    .replace(/-+/g, '-');

  const pathname = `${folder}/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return {
    url: blob.url,
    blobId: blob.pathname,
  };
}

/** يحذف صورة من Vercel Blob باستخدام رابطها الكامل المخزّن في DB. */
export async function deleteImage(url: string) {
  await del(url);
}
