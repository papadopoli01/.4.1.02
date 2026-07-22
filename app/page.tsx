import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Trust } from '@/components/sections/Trust';
import { Services } from '@/components/sections/Services';
import { Differentials } from '@/components/sections/Differentials';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Portfolio } from '@/components/sections/Portfolio';
import { Plans } from '@/components/sections/Plans';
import { FAQ } from '@/components/sections/FAQ';
import { CTA } from '@/components/sections/CTA';
import { Contact } from '@/components/sections/Contact';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

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
