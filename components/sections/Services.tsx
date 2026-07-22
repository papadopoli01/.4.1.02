'use client';

import { motion } from 'motion/react';
import { Monitor, MousePointerClick, ShoppingBag, Palette, TrendingUp, Sparkles } from 'lucide-react';

const services = [
  {
    icon: Monitor,
    title: 'Sites Institucionais',
    description: 'Fortaleça a marca da sua empresa com um site profissional, rápido e otimizado para conversão de ponta a ponta.',
    color: 'from-blue-600/20 via-blue-600/5 to-transparent',
    borderColor: 'group-hover:border-blue-500/50',
    iconColor: 'text-blue-400 group-hover:text-blue-300'
  },
  {
    icon: MousePointerClick,
    title: 'Landing Pages',
    description: 'Páginas de altíssima conversão, focadas estrategicamente em campanhas de marketing e geração de leads.',
    color: 'from-purple-600/20 via-purple-600/5 to-transparent',
    borderColor: 'group-hover:border-purple-500/50',
    iconColor: 'text-purple-400 group-hover:text-purple-300'
  },
  {
    icon: ShoppingBag,
    title: 'Lojas Virtuais',
    description: 'E-commerce completo, seguro e fácil de gerenciar para escalar suas vendas online 24 horas por dia.',
    color: 'from-emerald-600/20 via-emerald-600/5 to-transparent',
    borderColor: 'group-hover:border-emerald-500/50',
    iconColor: 'text-emerald-400 group-hover:text-emerald-300'
  },
  {
    icon: Palette,
    title: 'Redesign de Sites',
    description: 'Transforme seu site antigo em uma plataforma moderna, veloz e alinhada às melhores práticas de UI/UX.',
    color: 'from-orange-600/20 via-orange-600/5 to-transparent',
    borderColor: 'group-hover:border-orange-500/50',
    iconColor: 'text-orange-400 group-hover:text-orange-300'
  },
  {
    icon: TrendingUp,
    title: 'Otimização SEO',
    description: 'Domine as buscas do Google. Melhoramos seu ranqueamento para atrair tráfego orgânico altamente qualificado.',
    color: 'from-cyan-600/20 via-cyan-600/5 to-transparent',
    borderColor: 'group-hover:border-cyan-500/50',
    iconColor: 'text-cyan-400 group-hover:text-cyan-300'
  },
  {
    icon: Sparkles,
    title: 'Automações com IA',
    description: 'Integre o poder da Inteligência Artificial: chatbots inteligentes, geração de conteúdo e fluxos automatizados.',
    color: 'from-pink-600/20 via-pink-600/5 to-transparent',
    borderColor: 'group-hover:border-pink-500/50',
    iconColor: 'text-pink-400 group-hover:text-pink-300'
  }
];

export function Services() {
  return (
    <section id="servicos" className="py-24 relative overflow-hidden bg-[#050810]">
      {/* Luz de fundo suave para a seção */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 text-white">
              Soluções <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Completas</span> para o Seu Negócio
            </h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              Combinamos design sofisticado e tecnologia de ponta para criar plataformas de alta performance que impulsionam o seu crescimento na internet.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative p-8 rounded-2xl bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/5 ${service.borderColor} hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-2xl`}
            >
              {/* Gradiente de luz que aparece no hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-[#050810] border border-white/10 group-hover:border-white/20 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  <service.icon size={28} className={`${service.iconColor} transition-colors duration-500`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
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