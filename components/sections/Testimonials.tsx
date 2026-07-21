'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Roberto Almeida',
    role: 'CEO, TechNova',
    content: 'A Nexora transformou completamente nossa presença online. O novo site não apenas é lindo, mas converte 3x mais que o anterior. O processo foi impecável.',
    avatar: 'https://picsum.photos/seed/t1/100/100',
  },
  {
    name: 'Juliana Costa',
    role: 'Diretora de Mkt, Lumina',
    content: 'Velocidade e qualidade excepcionais. A utilização de IA no processo realmente fez diferença no tempo de entrega sem comprometer nenhum detalhe do design.',
    avatar: 'https://picsum.photos/seed/t2/100/100',
  },
  {
    name: 'Marcelo Silva',
    role: 'Founder, StartUpX',
    content: 'O suporte e a atenção aos detalhes são incomparáveis. Eles entenderam perfeitamente a visão do nosso produto e executaram com maestria.',
    avatar: 'https://picsum.photos/seed/t3/100/100',
  }
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">O que dizem nossos clientes</h2>
          <p className="text-gray-400 text-lg">
            Histórias de sucesso de empresas que confiaram na Nexora Studios.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-xl bg-white/5 border border-white/5 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5" />
              <p className="text-gray-300 leading-relaxed mb-8 relative z-10 text-sm">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
