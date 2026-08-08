import 'server-only';
import { prisma } from '@/lib/db/prisma';
import type { Prisma } from '@prisma/client';
import { services as staticServices } from '@/lib/data';
import { projects as staticProjects, type Project as StaticProject } from '@/lib/projects';

type StaticServiceItem = (typeof staticServices)[number];

// أنواع مشتقة تلقائيًا من Prisma Schema نفسه (بدل كتابتها يدويًا) — أي تعديل
// مستقبلي على schema.prisma (حقل جديد، حذف حقل) ينعكس هنا تلقائيًا بدون نسيان
// تحديث Type يدوي، وهو بالضبط سبب الخطأ الذي ظهر في بناء Vercel (isCover) سابقًا.
type ServiceWithRelations = Prisma.ServiceGetPayload<{
  include: { images: true; faqs: true };
}>;

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: { images: true; service: { select: { slug: true; title: true } } };
}>;

// ============================================================================
// الشكل القديم (Legacy Shape) الذي تتوقعه صفحات app/[slug] و app/gallery/[project]
// الحالية دون أي تعديل — الهدف: عدم لمس تلك الصفحات كثيرًا، فقط تبديل المصدر.
// ============================================================================

export type ServiceViewModel = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  fullDescription: string;
  keywords: string[];
  features: string[];
  image: string;
  priority: number;
  regions: string[];
  relatedServices: string[]; // legacy: قائمة IDs — يُحلّ لاحقًا بواسطة الصفحة نفسها
  gallery: { image: string; description: string; alt: string }[];
  faq: { question: string; answer: string }[];
  article?: { heading: string; body: string }[];
  comparison?: {
    title: string;
    leftLabel: string;
    rightLabel: string;
    rows: { feature: string; left: string | boolean; right: string | boolean }[];
  };
};

function fromDbService(s: ServiceWithRelations): ServiceViewModel {
  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    shortTitle: s.shortTitle ?? s.title,
    description: s.description,
    fullDescription: s.fullDescription,
    keywords: s.keywords,
    features: s.features,
    image: s.coverImage ?? s.images.find((i) => i.isCover)?.url ?? s.images[0]?.url ?? '/newphoto/mdlat.jpg',
    priority: s.priority,
    regions: s.regions,
    relatedServices: s.relatedServiceIds,
    gallery: s.images.map((i) => ({ image: i.url, description: i.caption ?? i.alt, alt: i.alt })),
    faq: s.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    article: (s.articleBlocks as ServiceViewModel['article']) ?? undefined,
    comparison: (s.comparisonTable as ServiceViewModel['comparison']) ?? undefined,
  };
}

// staticServices عبارة عن مصفوفة كائنات حرفية غير موحّدة الحقول بالكامل (بعض الخدمات
// تملك article/comparison وبعضها لا)، لذا نتعامل معها هنا كـ Record عام بأمان بدل
// فرض Interface صارم قد يكسر البناء لحقول اختيارية غير موجودة في كل عنصر.
function fromStaticService(raw: StaticServiceItem): ServiceViewModel {
  const s = raw as unknown as Record<string, unknown>;
  return {
    id: String(s.id),
    slug: String(s.slug),
    title: String(s.title),
    shortTitle: String(s.shortTitle ?? s.title),
    description: String(s.description),
    fullDescription: String(s.fullDescription),
    keywords: (s.keywords as string[]) ?? [],
    features: (s.features as string[]) ?? [],
    image: String(s.image),
    priority: Number(s.priority ?? 2),
    regions: (s.regions as string[]) ?? [],
    relatedServices: (s.relatedServices as string[]) ?? [],
    gallery: (s.gallery as ServiceViewModel['gallery']) ?? [],
    faq: (s.faq as ServiceViewModel['faq']) ?? [],
    article: s.article as ServiceViewModel['article'],
    comparison: s.comparison as ServiceViewModel['comparison'],
  };
}

/**
 * يجلب كل الخدمات المنشورة: من قاعدة البيانات أولًا، ويكمّل بالخدمات الثابتة
 * القديمة التي لم تُرحَّل بعد (بحيث لا يختفي أي محتوى أثناء فترة الترحيل).
 * بعد تأكيد ترحيل كل الخدمات عبر seed، يمكن حذف جزء "static" من هذه الدالة.
 */
export async function getServiceViewModels(): Promise<ServiceViewModel[]> {
  // نفس مبدأ المرونة: أي عطل في الاتصال بقاعدة البيانات (خصوصًا وقت البناء لو
  // DATABASE_URL غير متاح في تلك اللحظة) لا يجب أن يُسقط تجهيز الصفحة بالكامل —
  // نكتفي بالبيانات الثابتة القديمة كخط دفاع أخير.
  try {
    const dbServices = await prisma.service.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: [{ order: 'asc' }, { priority: 'asc' }],
      include: { images: { orderBy: { order: 'asc' } }, faqs: { orderBy: { order: 'asc' } } },
    });

    const dbSlugs = new Set<string>(dbServices.map((s) => s.slug));
    const staticOnly = staticServices.filter((s) => !dbSlugs.has(s.slug)).map(fromStaticService);

    return [...dbServices.map(fromDbService), ...staticOnly].sort((a, b) => a.priority - b.priority);
  } catch (error) {
    console.warn('[getServiceViewModels] تعذّر الوصول لقاعدة البيانات، سيتم عرض البيانات الثابتة القديمة فقط:', error);
    return staticServices.map(fromStaticService).sort((a, b) => a.priority - b.priority);
  }
}

export async function getServiceViewModelBySlug(slug: string): Promise<ServiceViewModel | null> {
  try {
    const dbService = await prisma.service.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { images: { orderBy: { order: 'asc' } }, faqs: { orderBy: { order: 'asc' } } },
    });
    if (dbService) return fromDbService(dbService);
  } catch (error) {
    console.warn(`[getServiceViewModelBySlug] تعذّر الوصول لقاعدة البيانات لـ slug="${slug}"، سيتم تجربة البيانات الثابتة القديمة:`, error);
  }

  const staticService = staticServices.find((s) => s.slug === slug);
  return staticService ? fromStaticService(staticService) : null;
}

export async function getAllServiceSlugsForStaticParams(): Promise<string[]> {
  // تُستدعى وقت البناء (generateStaticParams). لو تعذّر الاتصال بقاعدة البيانات
  // في تلك اللحظة، لا نُسقط البناء بالكامل — نكتفي بالـ slugs الثابتة القديمة،
  // وبقية الصفحات ستُبنى عند أول طلب بفضل dynamicParams = true في الصفحة.
  try {
    const dbServices = await prisma.service.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: { slug: true },
    });
    const dbSlugs = new Set<string>(dbServices.map((s) => s.slug));
    const staticSlugs = staticServices.map((s) => s.slug).filter((slug) => !dbSlugs.has(slug));
    return [...dbSlugs, ...staticSlugs];
  } catch (error) {
    console.warn('[getAllServiceSlugsForStaticParams] تعذّر الوصول لقاعدة البيانات أثناء البناء:', error);
    return staticServices.map((s) => s.slug);
  }
}

/** يُستخدم لحل related services بعد جلب القائمة الكاملة */
export function resolveRelatedServices(
  ids: string[],
  allServices: ServiceViewModel[]
): ServiceViewModel[] {
  return ids.map((id) => allServices.find((s) => s.id === id || s.slug === id)).filter(Boolean) as ServiceViewModel[];
}

// ============================================================================
// Projects
// ============================================================================

export type ProjectViewModel = {
  id: string;
  slug: string;
  title: string;
  serviceSlug: string;
  serviceLabel: string;
  region: string;
  summary: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  completedLabel: string;
  gallery: { image: string; alt: string; caption: string }[];
  updatedAt: Date;
};

function fromDbProject(p: ProjectWithRelations): ProjectViewModel {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    serviceSlug: p.service?.slug ?? '',
    serviceLabel: p.service?.title ?? '',
    region: p.region ?? '',
    summary: p.summary,
    description: p.description,
    coverImage: p.coverImage,
    coverAlt: p.coverImageAlt,
    completedLabel: p.completedAt ? new Date(p.completedAt).getFullYear().toString() : '',
    gallery: p.images.map((i) => ({ image: i.url, alt: i.alt, caption: i.caption ?? i.alt })),
    updatedAt: p.updatedAt,
  };
}

function fromStaticProject(p: StaticProject): ProjectViewModel {
  return {
    id: p.slug,
    slug: p.slug,
    title: p.title,
    serviceSlug: p.serviceSlug,
    serviceLabel: p.serviceLabel,
    region: p.region,
    summary: p.summary,
    description: p.description,
    coverImage: p.coverImage,
    coverAlt: p.coverAlt,
    completedLabel: p.completedLabel,
    gallery: p.gallery,
    updatedAt: new Date(`${p.completedLabel || '2025'}-06-01`),
  };
}

export async function getProjectViewModels(): Promise<ProjectViewModel[]> {
  try {
    const dbProjects = await prisma.project.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { images: { orderBy: { order: 'asc' } }, service: { select: { slug: true, title: true } } },
    });

    const dbSlugs = new Set<string>(dbProjects.map((p) => p.slug));
    const staticOnly = staticProjects.filter((p) => !dbSlugs.has(p.slug)).map(fromStaticProject);

    return [...dbProjects.map(fromDbProject), ...staticOnly];
  } catch (error) {
    console.warn('[getProjectViewModels] تعذّر الوصول لقاعدة البيانات، سيتم عرض البيانات الثابتة القديمة فقط:', error);
    return staticProjects.map(fromStaticProject);
  }
}

export async function getProjectViewModelBySlug(slug: string): Promise<ProjectViewModel | null> {
  try {
    const dbProject = await prisma.project.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { images: { orderBy: { order: 'asc' } }, service: { select: { slug: true, title: true } } },
    });
    if (dbProject) return fromDbProject(dbProject);
  } catch (error) {
    console.warn(`[getProjectViewModelBySlug] تعذّر الوصول لقاعدة البيانات لـ slug="${slug}"، سيتم تجربة البيانات الثابتة القديمة:`, error);
  }

  const staticProject = staticProjects.find((p) => p.slug === slug);
  return staticProject ? fromStaticProject(staticProject) : null;
}

export async function getAllProjectSlugsForStaticParams(): Promise<{ slug: string; updatedAt: Date }[]> {
  // نفس منطق المرونة وقت البناء المطبّق في getAllServiceSlugsForStaticParams أعلاه.
  try {
    const dbProjects = await prisma.project.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: { slug: true, updatedAt: true },
    });
    const dbSlugs = new Set<string>(dbProjects.map((p) => p.slug));
    const staticOnly = staticProjects
      .filter((p) => !dbSlugs.has(p.slug))
      .map((p) => ({ slug: p.slug, updatedAt: new Date(`${p.completedLabel || '2025'}-06-01`) }));
    return [...dbProjects, ...staticOnly];
  } catch (error) {
    console.warn('[getAllProjectSlugsForStaticParams] تعذّر الوصول لقاعدة البيانات أثناء البناء:', error);
    return staticProjects.map((p) => ({
      slug: p.slug,
      updatedAt: new Date(`${p.completedLabel || '2025'}-06-01`),
    }));
  }
}