import { notFound } from 'next/navigation';
import { getServiceById } from '@/features/services/queries';
import ServiceForm from '@/components/admin/ServiceForm';
import ServiceImageManager from '@/components/admin/ServiceImageManager';
import ServiceFaqManager from '@/components/admin/ServiceFaqManager';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">تعديل الخدمة: {service.title}</h1>
        <ServiceForm service={service} />
      </div>
      <ServiceImageManager serviceId={service.id} images={service.images} />
      <ServiceFaqManager serviceId={service.id} faqs={service.faqs} />
    </div>
  );
}
