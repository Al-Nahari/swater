import ProjectForm from '@/components/admin/ProjectForm';
import { getServiceOptions } from '@/features/projects/queries';

export default async function NewProjectPage() {
  const serviceOptions = await getServiceOptions();
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">إضافة عمل منفّذ جديد</h1>
      <ProjectForm serviceOptions={serviceOptions} />
    </div>
  );
}
