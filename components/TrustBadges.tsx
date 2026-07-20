const BADGES = [
  {
    title: 'سجل تجاري موثّق',
    desc: 'منشأة مرخّصة تعمل وفق الأنظمة السعودية',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    title: 'ضمان مكتوب',
    desc: 'حتى 10 سنوات على الهيكل والتركيب',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12.75L11.25 15 15 9.75M21 12c0 4.556-3.04 8.4-7.2 9.618a1.5 1.5 0 01-1.6 0C7.04 20.4 4 16.556 4 12V6.6a1.5 1.5 0 01.9-1.373l6.5-2.8a1.5 1.5 0 011.2 0l6.5 2.8a1.5 1.5 0 01.9 1.373V12z" />
    ),
  },
  {
    title: 'خامات مستوردة',
    desc: 'مواد أصلية مقاومة للحرارة والأشعة فوق البنفسجية',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    ),
  },
  {
    title: 'معاينة وعرض سعر مجاناً',
    desc: 'زيارة الموقع وتسعير خلال 24 ساعة بدون التزام',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m-.75 9.75h9a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 005.25 13.5v6.75a2.25 2.25 0 002.25 2.25z" />
    ),
  },
];

/** شارات ثقة سريعة تُبنى بها المصداقية قبل أن يصل الزائر لأي تفاصيل */
export default function TrustBadges() {
  return (
    <section className="py-10 bg-paper border-y border-border" aria-label="شارات الثقة">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BADGES.map((badge) => (
            <div key={badge.title} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dusk/10 text-indigo">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  {badge.icon}
                </svg>
              </span>
              <div>
                <p className="font-bold text-foreground text-sm md:text-base">{badge.title}</p>
                <p className="text-muted-foreground text-xs md:text-sm mt-0.5 leading-relaxed">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
