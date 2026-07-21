'use client';

import { motion } from 'motion/react';
import { Zap, Palette, Gauge, SearchCode, Smartphone, Shield, BrainCircuit, HeadphonesIcon } from 'lucide-react';

const differentials = [
  { icon: Zap, title: 'Entrega Rápida' },
  { icon: Palette, title: 'Design Exclusivo' },
  { icon: Gauge, title: 'Alta Performance' },
  { icon: SearchCode, title: 'SEO Otimizado' },
  { icon: Smartphone, title: '100% Responsivo' },
  { icon: Shield, title: 'Segurança' },
  { icon: BrainCircuit, title: 'Inteligência Artificial' },
  { icon: HeadphonesIcon, title: 'Suporte Dedicado' },
];

export function Differentials() {
  return (
    <section id="diferenciais" className="py-24 bg-[#080E18] border-y border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Por que escolher a Nexora?</h2>
            <p className="text-gray-400 text-lg mb-8">
              Não entregamos apenas sites. Construímos ativos digitais desenhados para gerar credibilidade e conversão, utilizando as melhores tecnologias do mercado.
            </p>
            <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-[#0077FF]/10 flex items-center justify-center flex-shrink-0">
                <BrainCircuit className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Powered by IA</div>
                <div className="text-sm text-gray-400">Processos acelerados por Inteligência Artificial</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {differentials.map((diff, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/5 hover:border-primary transition-all text-center gap-3 group"
              >
                <diff.icon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-gray-300">{diff.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
