'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Quanto tempo demora para meu site ficar pronto?',
    answer: 'O tempo de desenvolvimento varia de acordo com o plano escolhido. Para sites institucionais (Plano Essencial), o prazo médio é de 7 a 14 dias. Projetos mais complexos podem levar de 4 a 8 semanas.'
  },
  {
    question: 'Como a Inteligência Artificial acelera o desenvolvimento?',
    answer: 'Utilizamos ferramentas de IA para gerar wireframes rápidos, otimizar estruturas de código base, e auxiliar na criação de copy inicial. Isso nos permite focar mais tempo no refinamento do design e na experiência do usuário.'
  },
  {
    question: 'Vocês oferecem manutenção após a entrega?',
    answer: 'Sim! Nossos planos Profissional e Premium incluem períodos de suporte e manutenção. Também oferecemos planos de manutenção mensais avulsos para manter seu site sempre atualizado e seguro.'
  },
  {
    question: 'O site será otimizado para o Google (SEO)?',
    answer: 'Com certeza. Todos os sites desenvolvidos pela Nexora incluem otimização de SEO On-page estrutural, garantindo que seu site siga as melhores práticas exigidas pelos motores de busca.'
  },
  {
    question: 'Posso alterar o conteúdo do site depois de pronto?',
    answer: 'Sim. Em projetos multipáginas ou blogs, integramos um Painel CMS (Content Management System) intuitivo para que você ou sua equipe possam atualizar textos, imagens e criar novas postagens facilmente.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Dúvidas Frequentes</h2>
          <p className="text-gray-400 text-lg">
            Tudo o que você precisa saber antes de iniciar seu projeto.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-xl transition-colors ${openIndex === index ? 'border-primary/50 bg-primary/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-white"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === index ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
