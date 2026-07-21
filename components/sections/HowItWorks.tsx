'use client';

import { motion } from 'motion/react';

const steps = [
  { num: '01', title: 'Briefing', desc: 'Entendemos seu negócio, público e objetivos.' },
  { num: '02', title: 'Planejamento', desc: 'Definimos a estrutura e tecnologias ideais.' },
  { num: '03', title: 'Design', desc: 'Criamos layouts modernos e alinhados à sua marca.' },
  { num: '04', title: 'Desenvolvimento', desc: 'Código limpo, rápido e otimizado com IA.' },
  { num: '05', title: 'Revisões', desc: 'Ajustes finos para garantir a perfeição.' },
  { num: '06', title: 'Publicação', desc: 'Lançamento seguro e monitorado.' },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Processo Transparente e Ágil</h2>
          <p className="text-gray-400 text-lg">
            Metodologia testada para entregar projetos de alta qualidade em tempo recorde.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 rounded-xl bg-white/5 border border-white/5 hover:border-primary hover:bg-[#0077FF]/5 transition-all"
            >
              <div className="text-5xl font-heading font-black text-white/5 mb-4 group-hover:text-white/10 transition-colors">{step.num}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
