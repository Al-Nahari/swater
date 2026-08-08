import type { MetadataRoute } from 'next';
import { getServiceViewModels, getProjectViewModels } from '@/lib/legacy-adapter';
import { getPublishedArticles } from '@/features/articles/queries';
import { SITE_URL } from '@/lib/site';

const LAST_UPDATED = new Date('2025-06-01');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, articles] = await Promise.all([
    getServiceViewModels(),
    getProjectViewModels(),
    getPublishedArticles().catch(() => []), // لا نوقف بناء الـ sitemap لو DB غير جاهزة بعد
  ]);

  const servicePages = services.map((service) => ({
    url: `${SITE_URL}/${service.slug}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: service.priority === 1 ? 0.85 : service.priority === 2 ? 0.75 : 0.65,
  }));

  const projectPages = projects.map((project) => ({
    url: `${SITE_URL}/gallery/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const articlePages = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [
    { url: SITE_URL, lastModified: LAST_UPDATED, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${SITE_URL}/gallery`, lastModified: LAST_UPDATED, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: LAST_UPDATED, changeFrequency: 'weekly' as const, priority: 0.7 },
    ...servicePages,
    ...projectPages,
    ...articlePages,
  ];
}
