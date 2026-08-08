'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'لوحة التحكم', icon: '📊' },
  { href: '/admin/services', label: 'الخدمات', icon: '🛠️' },
  { href: '/admin/projects', label: 'الأعمال المنفذة', icon: '🏗️' },
  { href: '/admin/articles', label: 'المقالات', icon: '📝' },
  { href: '/admin/categories', label: 'التصنيفات', icon: '🏷️' },
  { href: '/admin/settings', label: 'إعدادات الموقع', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-l border-neutral-200 bg-white min-h-screen p-4 hidden md:block">
      <div className="mb-8 px-2">
        <p className="font-bold text-lg text-neutral-900">لوحة الإدارة</p>
        <p className="text-xs text-neutral-500">مظلات وسواتر</p>
      </div>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
