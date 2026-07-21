'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: 'Fintech Dashboard',
    category: 'Plataforma Web',
    image: 'https://picsum.photos/seed/p1/800/600',
  },
  {
    title: 'SaaS Landing Page',
    category: 'Website',
    image: 'https://picsum.photos/seed/p2/800/600',
  },
  {
    title: 'E-commerce Premium',
    category: 'Loja Virtual',
    image: 'https://picsum.photos/seed/p3/800/600',
  },
  {
    title: 'HealthCare App',
    category: 'Aplicação Mobile',
    image: 'https://picsum.photos/seed/p4/800/600',
  }
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-[#080E18] border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Trabalhos Recentes</h2>
            <p className="text-gray-400 text-lg">
              Explore nossa seleção de projetos recentes e veja como ajudamos empresas a elevarem seu padrão digital.
            </p>
          </div>
          <button className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors">
            Ver todos os projetos <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-white/5 border border-white/5 group-hover:border-primary transition-all">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg shadow-primary/30">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-xs text-secondary font-bold uppercase tracking-widest mb-2">{project.category}</div>
                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
