const STEPS = [
  {
    n: '01',
    title: 'التواصل والمعاينة',
    desc: 'تتصل بنا أو تراسلنا على واتساب، ونحدد موعد معاينة ميدانية مجانية لموقعك.',
  },
  {
    n: '02',
    title: 'التصميم وعرض السعر',
    desc: 'نقترح المقاس والخامة والتصميم الأنسب، ونرسل عرض سعر واضح دون التزام.',
  },
  {
    n: '03',
    title: 'التنفيذ والتركيب',
    desc: 'فريق فني متخصص ينفّذ العمل في الموقع خلال يوم إلى أيام حسب حجم المشروع.',
  },
  {
    n: '04',
    title: 'التسليم والضمان',
    desc: 'تسليم نهائي مع فحص الجودة، ووثيقة ضمان مكتوبة وصيانة دورية عند الحاجة.',
  },
];

/** مراحل تنفيذ الخدمة — توضح للزائر ماذا يحدث بعد أن يتواصل معنا */
export default function ProcessSteps() {
  return (
    <section className="py-16 md:py-20 bg-paper" aria-labelledby="process-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block text-sm font-semibold text-indigo mb-3">كيف نعمل</span>
          <h2 id="process-heading" className="text-2xl md:text-3xl lg:text-4xl font-display font-extrabold text-foreground">
            من الاتصال إلى التسليم في 4 خطوات
          </h2>
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* خط الربط بين الخطوات — للشاشات الكبيرة */}
          <div className="hidden lg:block absolute top-8 inset-x-16 h-px bg-border" aria-hidden />

          {STEPS.map((step) => (
            <div key={step.n} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-sun text-white font-display font-black text-xl mb-5 shadow-lg">
                {step.n}
              </div>
              <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
