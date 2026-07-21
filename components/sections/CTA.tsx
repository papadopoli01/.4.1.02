'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-[radial-gradient(circle,rgba(0,119,255,0.15)_0%,rgba(138,43,226,0.05)_50%,transparent_100%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-10 md:p-16 text-center shadow-[0_0_40px_-10px_rgba(0,119,255,0.2)]"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 text-white">
            Pronto para transformar sua presença digital?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Vamos criar um site que represente sua empresa com excelência e gere resultados reais em um mercado competitivo.
          </p>
          
          <a
            href="#contato"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_-5px_rgba(0,119,255,0.4)] hover:scale-105 hover:shadow-[0_0_40px_rgba(0,119,255,0.6)]"
          >
            Solicitar orçamento
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
