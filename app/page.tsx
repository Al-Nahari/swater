import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import ContactButton from '@/components/Contact';
import ContactSection from '@/components/ContactSection';
import TrustBadges from '@/components/TrustBadges';
import ProcessSteps from '@/components/ProcessSteps';
import { companyInfo } from '@/lib/data';
import { buildPageMetadata } from '@/lib/seo';
import { getServiceViewModels } from '@/lib/legacy-adapter';

const Features = dynamic(() => import('@/components/Features'), {
  loading: () => <div className="h-96 bg-sand-light/20 rounded-xl animate-pulse" />,
});

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => <div className="h-96 bg-sand-light/20 rounded-xl animate-pulse" />,
});

export const metadata: Metadata = buildPageMetadata({
  title: `${companyInfo.name} |  مظلات وسواتر الظل الراقي   — تركيب احترافي بضمان`,
  description: companyInfo.seoDescription,
  path: '/',
  keywords: [
    'مظلات  ',
    'سواتر  ',
    'مظلات سيارات  ',
    'تركيب مظلات',
    'تركيب سواتر',
    'برجولات  ',
    'هناجر  ',
    'شركة مظلات  ',
    'أسعار مظلات  ',
    'سواتر حديد  ',
    'مظلات حدائق  ',
    'مظلات مسابح  ',
  ],
});

export default async function Home() {
  const services = await getServiceViewModels();

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustBadges />
        <Services services={services} />
        <ProcessSteps />
        <Features />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
      <ContactButton />
    </>
  );
}
