'use client';

import { companyInfo } from '@/lib/data';

const STATS = [
  { value: '10+', label: 'سنوات خبرة', unit: 'YRS' },
  { value: '500+', label: 'مشروع منجز', unit: 'PRJ' },
  { value: '99%', label: 'رضا العملاء', unit: 'SAT' },
  { value: '05', label: 'سنوات ضمان', unit: 'WRN' },
];

export default function Hero() {
  return (
    <section className="relative bg-ink text-canvas overflow-hidden cut-edge-bottom pb-20 pt-14 md:pt-20 md:pb-28">
      {/* لوح القطع بالليزر — نمط هندسي حقيقي مأخوذ من ألواح السواتر، لا فقاعات ضبابية */}
      <div className="laser-pattern absolute inset-0 opacity-[0.14]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow — لوحة معدنية صغيرة بدل الشارة النبضية المعتادة */}
          <div className="inline-flex items-center gap-3 border border-copper/50 px-5 py-2 mb-8 font-mono-num text-xs tracking-widest text-sun">
            <span className="w-1.5 h-1.5 bg-copper" />
            RIYADH · METAL &amp; SHADE FABRICATION
          </div>

          {/* Main Heading */}
          <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 animate-fade-in-up">
            <span className="block text-canvas">مظلات وسواتر</span>
            <span className="block mt-2 text-copper-light">تُقصّ بدقة الليزر</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-canvas/70 max-w-2xl mx-auto mb-4 leading-relaxed">
            تركيب مظلات سيارات، سواتر حديد وليزر، برجولات، وساندويش بنل في الرياض —
            خامات ممتازة، أسعار شفافة، وضمان على التركيب.
          </p>
          <p className="font-display font-bold text-copper-light mb-10">
            {companyInfo.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href={`tel:${companyInfo.phone}`}
              className="notch-btn group w-full sm:w-auto flex items-center justify-center gap-3 bg-copper text-white px-9 py-4 text-lg font-bold hover:bg-copper-light transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>اتصل الآن</span>
              <span className="font-mono-num bg-black/20 px-3 py-1 text-sm">{companyInfo.phone}</span>
            </a>
            <a
              href={`https://wa.me/${companyInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="notch-btn group w-full sm:w-auto flex items-center justify-center gap-3 border border-canvas/30 text-canvas px-9 py-4 text-lg font-bold hover:border-copper hover:text-copper-light transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>تواصل عبر الواتساب</span>
            </a>
          </div>

          {/* Stats — لوحات مواصفات فنية بدل بطاقات زجاجية دائرية */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="spec-plate bg-ink-2/60 border-canvas/15 px-4 py-6 text-center"
              >
                <div className="font-mono-num text-[10px] text-copper-light/80 mb-2 tracking-widest">
                  {stat.unit}
                </div>
                <div className="font-mono-num text-3xl md:text-4xl font-bold text-canvas mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-canvas/60 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
