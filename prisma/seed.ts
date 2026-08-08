import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { services as staticServices } from '../lib/data';
import { projects as staticProjects } from '../lib/projects';

const prisma = new PrismaClient();

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log(
      '⚠️  تخطّي إنشاء المستخدم الإداري: عرّف SEED_ADMIN_EMAIL و SEED_ADMIN_PASSWORD في .env قبل تشغيل seed.'
    );
    return;
  }

  if (password.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD يجب ألا تقل عن 8 أحرف');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✔️  المستخدم الإداري موجود مسبقًا: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name: 'المدير العام', email, passwordHash, role: 'ADMIN' },
  });
  console.log(`✅ تم إنشاء المستخدم الإداري: ${email}`);
}

async function seedServices() {
  let created = 0;
  for (const [index, raw] of staticServices.entries()) {
    const s = raw as unknown as Record<string, unknown>;
    const slug = String(s.slug);

    const exists = await prisma.service.findUnique({ where: { slug } });
    if (exists) continue;

    const service = await prisma.service.create({
      data: {
        slug,
        title: String(s.title),
        shortTitle: (s.shortTitle as string) ?? String(s.title),
        description: String(s.description),
        fullDescription: String(s.fullDescription),
        keywords: (s.keywords as string[]) ?? [],
        features: (s.features as string[]) ?? [],
        regions: (s.regions as string[]) ?? [],
        priority: Number(s.priority ?? 2),
        coverImage: (s.image as string) ?? null,
        coverImageAlt: String(s.title),
        status: 'PUBLISHED',
        order: index,
        articleBlocks: (s.article as object[] | undefined) ?? undefined,
        comparisonTable: (s.comparison as object | undefined) ?? undefined,
        relatedServiceIds: (s.relatedServices as string[]) ?? [],
      },
    });

    const gallery = (s.gallery as { image: string; description?: string; alt?: string }[]) ?? [];
    for (const [i, g] of gallery.entries()) {
      await prisma.serviceImage.create({
        data: {
          serviceId: service.id,
          url: g.image,
          alt: g.alt ?? g.description ?? service.title,
          caption: g.description,
          isCover: i === 0 && !service.coverImage,
          order: i,
        },
      });
    }

    const faqs = (s.faq as { question: string; answer: string }[]) ?? [];
    for (const [i, f] of faqs.entries()) {
      await prisma.faq.create({
        data: { serviceId: service.id, question: f.question, answer: f.answer, order: i },
      });
    }

    created++;
  }
  console.log(`✅ تم ترحيل ${created} خدمة من lib/data.ts إلى قاعدة البيانات`);
}

async function seedProjects() {
  let created = 0;
  for (const p of staticProjects) {
    const exists = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (exists) continue;

    const relatedService = await prisma.service.findUnique({ where: { slug: p.serviceSlug } });

    const project = await prisma.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        description: p.description,
        region: p.region,
        coverImage: p.coverImage,
        coverImageAlt: p.coverAlt,
        completedAt: p.completedLabel ? new Date(`${p.completedLabel}-06-01`) : undefined,
        status: 'PUBLISHED',
        ...(relatedService ? { service: { connect: { id: relatedService.id } } } : {}),
      },
    });

    for (const [i, g] of p.gallery.entries()) {
      await prisma.projectImage.create({
        data: { projectId: project.id, url: g.image, alt: g.alt, caption: g.caption, order: i },
      });
    }

    created++;
  }
  console.log(`✅ تم ترحيل ${created} مشروع من lib/projects.ts إلى قاعدة البيانات`);
}

async function main() {
  await seedAdminUser();
  await seedServices();
  await seedProjects();
}

main()
  .catch((error) => {
    console.error('❌ فشل تشغيل Seed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
