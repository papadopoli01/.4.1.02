'use client';

import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const plans = [
  {
    name: 'Essencial',
    price: 'R$ 2.500',
    description: 'Ideal para profissionais autônomos e pequenas empresas que precisam de presença online.',
    features: [
      'Site institucional (One Page)',
      'Design responsivo',
      'SEO Básico',
      'Formulário de contato',
      'Integração com WhatsApp',
      'Hospedagem por 1 ano',
    ],
    popular: false,
  },
  {
    name: 'Profissional',
    price: 'R$ 5.000',
    description: 'A solução completa para empresas que buscam autoridade e geração de leads.',
    features: [
      'Site multipáginas (até 5 pág.)',
      'Design Exclusivo UX/UI',
      'SEO Avançado',
      'Painel CMS (Blog)',
      'Integração com CRM/Marketing',
      'Hospedagem e Suporte premium',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: 'Sob Consulta',
    description: 'Para projetos complexos, sistemas web sob medida e grandes e-commerces.',
    features: [
      'Plataforma completa e escalável',
      'Design Systems e Microinterações',
      'Banco de dados dedicado',
      'Desenvolvimento Full-Stack',
      'Automações customizadas com IA',
      'Suporte SLA 24/7',
    ],
    popular: false,
  }
];

export function Plans() {
  return (
    <section id="planos" className="py-24 bg-[#080E18] border-y border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Investimento Transparente</h2>
          <p className="text-gray-400 text-lg">
            Escolha o plano que melhor se adapta ao momento da sua empresa. Sem taxas ocultas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-xl border ${
                plan.popular 
                  ? 'bg-gradient-to-b from-primary/10 to-transparent border-primary/50 shadow-[0_0_40px_-10px_rgba(0,119,255,0.3)] scale-105 z-10' 
                  : 'bg-white/5 border-white/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                  Mais Escolhido
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{plan.description}</p>
                <div className="text-4xl font-heading font-black text-white">
                  {plan.price}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-primary' : 'text-secondary'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contato"
                className={`w-full block text-center py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-[#005ecb] shadow-lg shadow-primary/25 hover:shadow-primary/40'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
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
