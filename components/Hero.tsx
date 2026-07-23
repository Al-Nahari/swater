'use client';

import { motion, type Variants } from 'framer-motion';
import { companyInfo } from '@/lib/data';

const STATS = [
  { value: '10+', label: 'سنوات خبرة' },
  { value: '500+', label: 'مشروع منجز' },
  { value: '99%', label: 'رضا العملاء' },
  { value: '5', label: 'سنوات ضمان' },
];

const TRUST_BADGES = [
  'خامات ألمنيوم وحديد مجلفن أصلي',
  'تركيب معتمد بضمان مكتوب',
  'معاينة وتسعير مجاني بنفس اليوم',
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const itemLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section className="relative bg-night-sky texture-grain text-white pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* قرص الشمس الذهبي المتحرك — تعبير حرفي عن هوية "ظل الواحة" */}
      <motion.div
        className="sun-orb absolute -top-28 right-[6%] w-[380px] h-[380px] rounded-full opacity-70"
        animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="shadow-orb absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-50 blur-3xl"
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* خط أفقي زخرفي مستوحى من فتحات السواتر الليزرية */}
      <div
        className="absolute inset-y-0 left-1/2 w-px opacity-[0.06] hidden lg:block"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, var(--sun-light) 0 10px, transparent 10px 22px)',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-10 items-center">
          {/* ============ العمود الأيمن: النص والدعوة للإجراء ============ */}
          <motion.div initial="hidden" animate="visible" variants={container} className="text-center lg:text-right">
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 glass-card text-sun-light px-5 py-2.5 rounded-full text-sm font-semibold mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-pulse-glow absolute inline-flex h-full w-full rounded-full bg-sun" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sun" />
              </span>
              خبراء السواتر والمظلات   
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display font-black text-5xl md:text-6xl lg:text-[4.6rem] leading-[1.06] mb-6"
            >
              <span className="block text-gradient-sun">ظل يليق بمنزلك</span>
              <span className="block mt-2 text-white">وهندسة تدوم لسنوات</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-lg md:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              تصميم وتنفيذ مظلات سيارات، سواتر حديد وليزر، برجولات وهناجر    —
              خامات فاخرة، تصنيع دقيق، وضمان حقيقي مكتوب على كل عمل.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-10"
            >
              <a
                href={`tel:${companyInfo.phone}`}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-sun text-night px-9 py-4 rounded-2xl text-lg font-bold glow-dusk hover:-translate-y-1 transition-transform duration-300"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>اتصل الآن</span>
                <span className="bg-night/15 px-3 py-1 rounded-full text-sm">{companyInfo.phone}</span>
              </a>
              <a
                href={`https://wa.me/${companyInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto flex items-center justify-center gap-3 glass-card text-white px-9 py-4 rounded-2xl text-lg font-bold hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>تواصل عبر الواتساب</span>
              </a>
            </motion.div>

            {/* شارات ثقة نصية — بديل عملي لا يعتمد على صور خارجية */}
            <motion.ul variants={item} className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-3 justify-center lg:justify-start text-sm text-white/60">
              {TRUST_BADGES.map((badge) => (
                <li key={badge} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-sun shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  {badge}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ============ العمود الأيسر: بطاقات عائمة بدل صورة واحدة كبيرة ============ */}
          <motion.div initial="hidden" animate="visible" variants={container} className="relative hidden lg:block h-[520px]">
            <motion.div
              variants={itemLeft}
              className="absolute inset-0 rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#2F241D] via-[#201A14] to-[#161616] overflow-hidden"
            >
              {/* نمط شرائح معدنية/خشبية يوحي بالسواتر دون الحاجة لصورة حقيقية */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(100deg, transparent 0 26px, rgb(217 164 65 / 0.5) 26px 30px)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
            </motion.div>

            {/* بطاقة ضمان عائمة */}
            <motion.div
              variants={itemLeft}
              whileHover={{ y: -6 }}
              className="absolute top-8 -right-6 glass-card rounded-2xl p-5 w-56 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-sun flex items-center justify-center text-night font-black">
                  ٥
                </div>
                <div className="text-sm font-bold text-white">سنوات ضمان</div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">على التصنيع والتركيب لكل مشروع نسلّمه</p>
            </motion.div>

            {/* بطاقة إحصائية عائمة */}
            <motion.div
              variants={itemLeft}
              whileHover={{ y: -6 }}
              className="absolute bottom-10 -left-8 glass-card rounded-2xl p-6 w-64 shadow-2xl"
            >
              <div className="text-4xl font-display font-extrabold text-gradient-sun mb-1">+500</div>
              <div className="text-sm text-white/70">مشروع تم تسليمه في   وضواحيها خلال ١٠ سنوات</div>
            </motion.div>
          </motion.div>
        </div>

        {/* شريط الإحصائيات أسفل الهيرو */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto mt-16 lg:mt-24"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <div className="text-4xl md:text-5xl font-display font-extrabold text-gradient-sun mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-white/70 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* حافة ناعمة تتدرج إلى لون خلفية الموقع الفاتح */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent to-canvas pointer-events-none" />
    </section>
  );
}
