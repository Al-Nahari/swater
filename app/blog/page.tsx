import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactButton from '@/components/Contact';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { getPublishedArticles } from '@/features/articles/queries';
import { breadcrumbSchema, buildPageMetadata, collectionPageSchema } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'المدونة | مظلات وسواتر الظل الراقي',
  description: 'مقالات ونصائح حول المظلات والسواتر والبرجولات — اختيار الخامة، الصيانة، والأسعار.',
  path: '/blog',
});

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema({
            name: 'مدونة مظلات وسواتر الظل الراقي',
            description: 'مقالات تعريفية وإرشادية حول المظلات والسواتر',
            path: '/blog',
            numberOfItems: articles.length,
          }),
          breadcrumbSchema([
            { name: 'الرئيسية', path: '/' },
            { name: 'المدونة', path: '/blog' },
          ]),
        ]}
      />
      <Header />
      <main className="pt-4" id="main-content">
        <section className="bg-gradient-desert py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'المدونة' }]} />
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">المدونة</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                نصائح ومقالات تساعدك على اختيار وصيانة المظلات والسواتر المناسبة لك.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            {articles.length === 0 ? (
              <p className="text-center text-muted-foreground">لا توجد مقالات منشورة حاليًا.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="group flex flex-col bg-gradient-desert rounded-2xl overflow-hidden border border-coffee-medium/15 hover:border-coffee-medium/40 hover:shadow-lg transition-all"
                  >
                    {article.coverImage && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={article.coverImage}
                          alt={article.coverImageAlt ?? article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {article.category && (
                        <span className="inline-block text-xs font-medium text-coffee-medium mb-2">{article.category.name}</span>
                      )}
                      <h2 className="font-bold text-foreground mb-2 group-hover:text-coffee-medium transition-colors">{article.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ContactButton />
    </>
  );
}
