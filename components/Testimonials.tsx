'use client';

import { testimonials } from '@/lib/data';

export default function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gradient-desert scroll-mt-24 texture-grain">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[0.55fr_0.45fr] gap-4 items-end mb-14">
          <div>
            <span className="text-dusk font-semibold text-sm uppercase tracking-[0.2em]">آراء موثّقة</span>
            <h2 className="text-4xl md:text-5xl font-display font-black text-ink mt-3 leading-[1.1]">
              ثقة عملائنا هي أساس عملنا
            </h2>
          </div>
          <p className="text-lg text-muted-foreground lg:pb-2">
            كل رأي هنا من عميل حقيقي تعاملنا معه في   — بلا مبالغة وبلا صياغة تسويقية جاهزة.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
          {/* الشهادة المميزة — بطاقة كبيرة بعلامة اقتباس ضخمة */}
          {featured && (
            <div className="relative bg-night texture-grain rounded-[2rem] p-10 md:p-14 flex flex-col justify-between overflow-hidden">
              <svg className="absolute top-8 left-8 w-20 h-20 text-white/[0.06]" fill="currentColor" viewBox="0 0 32 32">
                <path d="M6 30c-1.1 0-2-.9-2-2V16c0-1.1.9-2 2-2s2 .9 2 2v12c0 1.1-.9 2-2 2zm12 0c-1.1 0-2-.9-2-2V16c0-1.1.9-2 2-2s2 .9 2 2v12c0 1.1-.9 2-2 2zM6 14c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2s2 .9 2 2v6c0 1.1-.9 2-2 2zm12 0c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2s2 .9 2 2v6c0 1.1-.9 2-2 2z" />
              </svg>

              <div className="relative z-10">
                <div className="flex gap-1 mb-8">
                  {[...Array(featured.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-sun" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-2xl md:text-3xl font-display font-medium text-white leading-relaxed mb-10">
                  &ldquo;{featured.text}&rdquo;
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="w-14 h-14 rounded-full bg-gradient-sun flex items-center justify-center shrink-0">
                  <span className="text-night font-black text-xl">{featured.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-lg">{featured.name}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-sun-light bg-sun/10 border border-sun/25 rounded-full px-2 py-0.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      عميل موثّق
                    </span>
                  </div>
                  <p className="text-sm text-white/50">{featured.location}</p>
                </div>
              </div>
            </div>
          )}

          {/* شهادات مساندة — بطاقات أصغر مرصوصة عمودياً */}
          <div className="flex flex-col gap-5">
            {rest.map((testimonial, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-border hover:border-dusk/30 flex gap-5 items-start"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sun-light to-dusk flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-base">{testimonial.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <p className="font-bold text-ink text-sm">{testimonial.name}</p>
                    <div className="flex gap-0.5 shrink-0">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-sun" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{testimonial.location}</p>
                  <p className="text-sm text-ink-soft leading-relaxed line-clamp-3">{testimonial.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}