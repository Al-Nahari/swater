import ArticleForm from '@/components/admin/ArticleForm';
import { getAllCategories } from '@/features/articles/queries';

export default async function NewArticlePage() {
  const categories = await getAllCategories();
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">إضافة مقال جديد</h1>
      <ArticleForm categories={categories} />
    </div>
  );
}
