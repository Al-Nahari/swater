import { notFound } from 'next/navigation';
import { getArticleById, getAllCategories } from '@/features/articles/queries';
import ArticleForm from '@/components/admin/ArticleForm';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, categories] = await Promise.all([getArticleById(id), getAllCategories()]);
  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">تعديل المقال: {article.title}</h1>
      <ArticleForm article={article} categories={categories} />
    </div>
  );
}
