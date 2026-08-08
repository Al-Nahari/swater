'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { addProjectImage, deleteProjectImage } from '@/features/projects/actions';
import type { ProjectImage } from '@prisma/client';

export default function ProjectImageManager({ projectId, images }: { projectId: string; images: ProjectImage[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleUpload(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addProjectImage(projectId, formData);
      if (!result.success) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <h2 className="font-semibold text-neutral-900 mb-4">صور المشروع</h2>

      <form ref={formRef} action={handleUpload} className="flex flex-wrap items-end gap-3 mb-6 border-b border-neutral-100 pb-6">
        <div>
          <label className="block text-xs font-medium mb-1">الصورة</label>
          <input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/avif" required className="text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Alt Text *</label>
          <input name="alt" required className="rounded-lg border border-neutral-300 px-3 py-2 text-sm w-56" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">وصف (Caption)</label>
          <input name="caption" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm w-56" />
        </div>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" name="isCover" value="true" /> صورة رئيسية
        </label>
        <button type="submit" disabled={isPending} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {isPending ? 'جارٍ الرفع...' : 'رفع الصورة'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {images.length === 0 ? (
        <p className="text-sm text-neutral-500">لا توجد صور بعد. الصورة الرئيسية التي كتبتها كرابط نصي أعلاه ستبقى حتى ترفع صورة وتضعها رئيسية هنا.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative rounded-lg overflow-hidden border border-neutral-200">
              <div className="relative aspect-square">
                <Image src={img.url} alt={img.alt} fill className="object-cover" />
              </div>
              {img.isCover && <span className="absolute top-1 right-1 bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded">رئيسية</span>}
              <div className="p-2">
                <p className="text-xs text-neutral-600 truncate">{img.alt}</p>
                <DeleteImageButton imageId={img.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteImageButton({ imageId }: { imageId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm('حذف هذه الصورة؟')) return;
        startTransition(() => { void deleteProjectImage(imageId); });
      }}
      className="text-xs text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? 'جارٍ الحذف...' : 'حذف'}
    </button>
  );
}
