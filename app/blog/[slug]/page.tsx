import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactButton from '@/components/Contact';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { getAllPublishedArticleSlugs, getPublishedArticleBySlug } from '@/features/articles/queries';
import { articleSchema, breadcrumbSchema, buildPageMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  const slugs = await getAllPublishedArticleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return buildPageMetadata({ title: 'مقال غير موجود', description: 'الصفحة غير متوفرة', path: `/blog/${slug}`, noIndex: true });
  }

  return buildPageMetadata({
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    path: `/blog/${article.slug}`,
    keywords: article.keywords,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = [
    articleSchema({
      headline: article.title,
      description: article.excerpt,
      path: `/blog/${article.slug}`,
      image: article.coverImage ?? undefined,
      datePublished: (article.publishedAt ?? article.createdAt).toISOString(),
    }),
    breadcrumbSchema([
      { name: 'الرئيسية', path: '/' },
      { name: 'المدونة', path: '/blog' },
      { name: article.title, path: `/blog/${article.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="pt-4" id="main-content">
        <section className="bg-gradient-desert py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Breadcrumbs
                items={[{ label: 'الرئيسية', href: '/' }, { label: 'المدونة', href: '/blog' }, { label: article.title }]}
              />
              {article.category && (
                <span className="inline-block rounded-full bg-coffee-medium/95 px-3 py-1 text-xs font-medium text-white mb-4">
                  {article.category.name}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">{article.title}</h1>
              {article.coverImage && (
                <figure className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl mb-4">
                  <Image src={article.coverImage} alt={article.coverImageAlt ?? article.title} fill className="object-cover" priority />
                </figure>
              )}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div
              className="max-w-3xl mx-auto prose-content text-lg text-muted-foreground leading-relaxed space-y-5"
              // المحتوى معقّم مسبقًا (sanitize-html) في features/articles/actions.ts قبل الحفظ في قاعدة البيانات
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </section>
      </main>
      <Footer />
      <ContactButton />
    </>
  );
}
