import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

// Carregamento dinâmico (Lazy Load) para acelerar a abertura no telemóvel
const Trust = dynamic(() => import('@/components/sections/Trust').then(mod => mod.Trust));
const Services = dynamic(() => import('@/components/sections/Services').then(mod => mod.Services));
const Differentials = dynamic(() => import('@/components/sections/Differentials').then(mod => mod.Differentials));
const HowItWorks = dynamic(() => import('@/components/sections/HowItWorks').then(mod => mod.HowItWorks));
const Portfolio = dynamic(() => import('@/components/sections/Portfolio').then(mod => mod.Portfolio));
const Plans = dynamic(() => import('@/components/sections/Plans').then(mod => mod.Plans));
const FAQ = dynamic(() => import('@/components/sections/FAQ').then(mod => mod.FAQ));
const CTA = dynamic(() => import('@/components/sections/CTA').then(mod => mod.CTA));
const Contact = dynamic(() => import('@/components/sections/Contact').then(mod => mod.Contact));
const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer));

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Trust />
      <Services />
      <Differentials />
      <HowItWorks />
      <Portfolio />
      <Plans />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}