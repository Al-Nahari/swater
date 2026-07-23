import Link from 'next/link';
import { services, companyInfo } from '@/lib/data';

export default function Footer() {
  const canopies = services.filter((s) => s.id.includes('mazallat'));
  const shades = services.filter((s) => s.id.includes('sawatr'));
  const additional = services.filter(
    (s) => !s.id.includes('mazallat') && !s.id.includes('sawatr')
  );

  const currentYear = new Date().getFullYear();
  const mapQuery = encodeURIComponent(companyInfo.address);

  return (
    <footer className="bg-night texture-grain text-white/70">
      {/* شريط دعوة ختامي — قبل الأعمدة، ليكون آخر ما يقرأه الزائر فعلياً هو دعوة للتواصل */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-right">
              <h3 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-2">
                جاهز تحوّل الفناء إلى ظل يليق بمنزلك؟
              </h3>
              <p className="text-white/60">معاينة وتسعير مجاني — نرد خلال دقائق على الواتساب</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a
                href={`https://wa.me/${companyInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-gradient-sun text-night px-7 py-3.5 font-bold hover:-translate-y-0.5 transition-transform duration-300"
              >
                تواصل واتساب
              </a>
              <a
                href={`tel:${companyInfo.phone}`}
                className="rounded-2xl border border-white/20 text-white px-7 py-3.5 font-bold hover:border-sun hover:text-sun transition-colors duration-300"
              >
                {companyInfo.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr_1.1fr] gap-10">
          {/* عن الشركة — أوسع عمود، بدل التساوي الآلي */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4 text-white">{companyInfo.name}</h3>
            <p className="text-white/55 mb-6 text-sm leading-relaxed max-w-xs">
              {companyInfo.seoDescription}
            </p>
            <div className="flex items-center gap-2 text-xs text-sun-light/80 border border-white/10 rounded-full px-4 py-2 w-fit">
              <span className="w-2 h-2 rounded-full bg-sun animate-pulse-glow" />
              متاحون الآن — {companyInfo.workingHours}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-5 text-sun-light tracking-wide">مظلات</h4>
            <ul className="space-y-3">
              {canopies.map((service) => (
                <li key={service.id}>
                  <Link href={`/${service.slug}`} className="text-white/55 hover:text-white transition-colors text-sm">
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-5 text-sun-light tracking-wide">سواتر</h4>
            <ul className="space-y-3">
              {shades.map((service) => (
                <li key={service.id}>
                  <Link href={`/${service.slug}`} className="text-white/55 hover:text-white transition-colors text-sm">
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-5 text-sun-light tracking-wide">خدمات أخرى</h4>
            <ul className="space-y-3">
              {additional.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link href={`/${service.slug}`} className="text-white/55 hover:text-white transition-colors text-sm">
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gallery" className="text-white/55 hover:text-white transition-colors text-sm">
                  معرض الأعمال
                </Link>
              </li>
            </ul>
          </div>

          {/* خريطة تفاعلية بدل عمود روابط رابع متكرر الشكل */}
          <div>
            <h4 className="text-sm font-bold mb-5 text-sun-light tracking-wide">موقعنا</h4>
            <div className="rounded-2xl overflow-hidden border border-white/10 h-40 mb-4">
              <iframe
                title="موقع الشركة على الخريطة"
                src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                className="w-full h-full grayscale-[40%] contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <address className="not-italic space-y-1.5 text-sm text-white/55">
              <p>{companyInfo.address}</p>
              <p>
                <a href={`mailto:${companyInfo.email}`} className="hover:text-white transition-colors">
                  {companyInfo.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {currentYear} {companyInfo.name}. جميع الحقوق محفوظة.</p>
          <p>تركيب  مظلات وسواتر الظل الراقي في   وجميع أحياء المنطقة</p>
        </div>
      </div>
    </footer>
  );
}