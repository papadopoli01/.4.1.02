'use client';

import { motion } from 'motion/react';
import { LayoutTemplate, ShoppingBag, Code, Search, Wrench, Sparkles } from 'lucide-react';

const services = [
  {
    icon: LayoutTemplate,
    title: 'Sites Institucionais',
    description: 'Fortaleça a marca da sua empresa com um site profissional, rápido e otimizado para conversão.',
    color: 'from-blue-500/20 to-blue-500/0',
    iconColor: 'text-blue-400'
  },
  {
    icon: LayoutTemplate, // Reusing icon for Landing Pages
    title: 'Landing Pages',
    description: 'Páginas de alta conversão focadas em campanhas de marketing e geração de leads.',
    color: 'from-purple-500/20 to-purple-500/0',
    iconColor: 'text-purple-400'
  },
  {
    icon: ShoppingBag,
    title: 'Lojas Virtuais',
    description: 'E-commerce completo, seguro e fácil de gerenciar para escalar suas vendas online.',
    color: 'from-green-500/20 to-green-500/0',
    iconColor: 'text-green-400'
  },
  {
    icon: Code,
    title: 'Redesign de Sites',
    description: 'Transforme seu site antigo em uma plataforma moderna e alinhada às melhores práticas atuais.',
    color: 'from-orange-500/20 to-orange-500/0',
    iconColor: 'text-orange-400'
  },
  {
    icon: Search,
    title: 'Otimização SEO',
    description: 'Melhore seu ranqueamento no Google e atraia tráfego orgânico qualificado.',
    color: 'from-cyan-500/20 to-cyan-500/0',
    iconColor: 'text-cyan-400'
  },
  {
    icon: Sparkles,
    title: 'Automações com IA',
    description: 'Integração de chatbots, geração de conteúdo e fluxos automatizados com IA.',
    color: 'from-pink-500/20 to-pink-500/0',
    iconColor: 'text-pink-400'
  }
];

export function Services() {
  return (
    <section id="servicos" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Soluções Completas para o Seu Negócio</h2>
          <p className="text-light/70 text-lg">
            Combinamos design sofisticado e tecnologia de ponta para criar plataformas que impulsionam o seu crescimento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-xl bg-white/5 border border-white/5 hover:border-primary hover:bg-[#0077FF]/5 transition-all relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[#0077FF]/10 flex items-center justify-center mb-6 transition-colors`}>
                  <service.icon size={24} className={`group-hover:text-primary transition-colors`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
