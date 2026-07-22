'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

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
    <section id="faq" className="py-24 relative bg-[#050810] overflow-hidden">
      {/* Luz de fundo suave */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <MessageCircleQuestion className="text-blue-400" size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4 text-white">
              Dúvidas <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Frequentes</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Tudo o que você precisa saber antes de iniciar a transformação digital do seu negócio.
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={index}
              className={`border rounded-2xl transition-all duration-300 backdrop-blur-md overflow-hidden ${
                openIndex === index 
                  ? 'border-blue-500/40 bg-gradient-to-br from-blue-900/20 to-[#0a0f1a]/90 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                  : 'border-white/5 bg-[#0a0f1a]/60 hover:bg-[#0a0f1a]/90 hover:border-white/20'
              }`}
            >
              <button
                className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left font-bold text-white group outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`text-base md:text-lg pr-4 transition-colors duration-300 ${
                  openIndex === index ? 'text-blue-400' : 'group-hover:text-blue-300'
                }`}>
                  {faq.question}
                </span>
                
                <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  openIndex === index ? 'bg-blue-500/20' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180 text-blue-400' : 'text-gray-400 group-hover:text-blue-300'
                    }`}
                  />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 md:px-8 pb-6 text-gray-400 text-sm md:text-base leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}