'use client';

import { motion } from 'motion/react';
import { CheckCircle2, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Essencial',
    price: 'A partir de R$ 499,90',
    description: 'Ideal para profissionais autônomos e pequenas empresas que precisam de presença online.',
    features: [
      'Site institucional (One Page)',
      'Design responsivo e moderno',
      'SEO Básico (Google)',
      'Formulário de captação',
      'Botão flutuante do WhatsApp',
      'Hospedagem por 1 ano',
    ],
    popular: false,
  },
  {
    name: 'Profissional',
    price: 'A partir de R$ 1.399,90',
    description: 'A solução completa para empresas que buscam autoridade e máxima geração de leads.',
    features: [
      'Site multipáginas (até 5 pág.)',
      'Design Exclusivo focado em UX/UI',
      'SEO Avançado de alta performance',
      'Painel CMS (Gestão de Blog/Notícias)',
      'Integração com CRM / Automação',
      'Hospedagem rápida e Suporte VIP',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: 'Sob Consulta',
    description: 'Para projetos complexos, sistemas web sob medida e lojas virtuais de grande escala.',
    features: [
      'Plataforma completa e 100% escalável',
      'Design Systems e Microinterações',
      'Banco de dados dedicado e seguro',
      'Desenvolvimento Full-Stack',
      'Automações customizadas com IA',
      'Suporte técnico SLA 24/7',
    ],
    popular: false,
  }
];

export function Plans() {
  return (
    <section id="planos" className="py-24 relative bg-[#050810] overflow-hidden">
      {/* Luz de fundo suave */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 text-white">
              Investimento <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Transparente</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl">
              Escolha o plano que melhor se adapta ao momento da sua empresa. Sem taxas ocultas, sem surpresas.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl transition-all duration-500 backdrop-blur-xl ${
                plan.popular 
                  ? 'bg-gradient-to-b from-blue-900/20 to-[#0a0f1a]/80 border border-blue-500/50 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] md:scale-105 z-10' 
                  : 'bg-[#0a0f1a]/80 border border-white/5 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-500/30">
                  <Sparkles size={14} className="text-blue-200" />
                  Mais Escolhido
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-6 min-h-[60px] leading-relaxed">{plan.description}</p>
                <div className="text-2xl md:text-3xl font-heading font-black text-white tracking-tight">
                  {plan.price}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-blue-400' : 'text-gray-500'}`} />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contato"
                className={`w-full flex items-center justify-center py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:from-blue-500 hover:to-blue-400'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
                }`}
              >
                Começar projeto
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}