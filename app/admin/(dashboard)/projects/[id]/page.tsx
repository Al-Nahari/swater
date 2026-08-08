import { notFound } from 'next/navigation';
import { getProjectById, getServiceOptions } from '@/features/projects/queries';
import ProjectForm from '@/components/admin/ProjectForm';
import ProjectImageManager from '@/components/admin/ProjectImageManager';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, serviceOptions] = await Promise.all([getProjectById(id), getServiceOptions()]);
  if (!project) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">تعديل المشروع: {project.title}</h1>
        <ProjectForm project={project} serviceOptions={serviceOptions} />
      </div>
      <ProjectImageManager projectId={project.id} images={project.images} />
    </div>
  );
}
