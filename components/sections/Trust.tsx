'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const stats = [
  { value: '150+', label: 'Sites desenvolvidos' },
  { value: '100%', label: 'Projetos entregues no prazo' },
  { value: '7 dias', label: 'Tempo médio de entrega' },
  { value: '99/100', label: 'Performance média (Lighthouse)' },
];

export function Trust() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 border-y border-white/5 bg-[#080E18]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className={`text-4xl md:text-5xl font-heading font-bold mb-2 ${index === 1 ? 'text-secondary' : 'text-white'}`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
