'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { companyInfo } from '@/lib/data';

const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/#services', label: 'خدماتنا' },
  { href: '/#features', label: 'مميزاتنا' },
  { href: '/#testimonials', label: 'آراء العملاء' },
  { href: '/gallery', label: 'معرض الأعمال' },
  { href: '/#contact', label: 'اتصل بنا' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 10);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-paper/85 backdrop-blur-xl shadow-[0_1px_0_0_var(--border),0_12px_30px_-18px_rgb(169,113,66,0.35)] py-2'
          : 'bg-paper/40 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* الشعار */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-sun flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <span className="text-night font-display font-black text-xl">س</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg text-ink leading-none tracking-tight">
                {companyInfo.name}
              </span>
              <span className="text-[11px] text-muted-foreground mt-1">
                خبراء السواتر والمظلات —  
              </span>
            </div>
          </Link>

          {/* التنقل — سطح المكتب */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink-soft hover:text-dusk transition-colors font-medium text-[15px] relative group py-1"
              >
                {link.label}
                <span className="absolute -bottom-0.5 right-0 w-0 h-[2px] bg-gradient-sun rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* أزرار الدعوة للإجراء */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${companyInfo.phone}`}
              className="flex items-center gap-2 rounded-full border border-border text-ink px-5 py-2.5 hover:border-dusk hover:text-dusk transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="font-medium text-sm">اتصل الآن</span>
            </a>
            <a
              href={`https://wa.me/${companyInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-gradient-sun text-night px-5 py-2.5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="font-medium text-sm">واتساب</span>
            </a>
          </div>

          {/* زر القائمة — جوال */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={isMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* القائمة — جوال */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-1 py-6 border-t border-border mt-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-ink-soft hover:text-dusk transition-colors font-medium py-3 px-4 rounded-xl hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-3 pt-4 mt-2">
                  <a
                    href={`tel:${companyInfo.phone}`}
                    className="flex-1 rounded-2xl border border-border text-ink text-center py-3 font-medium"
                  >
                    اتصال
                  </a>
                  <a
                    href={`https://wa.me/${companyInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-2xl bg-gradient-sun text-night text-center py-3 font-medium"
                  >
                    واتساب
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
