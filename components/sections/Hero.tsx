'use client';

import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      
      {/* Fundo Fluido e Animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Luz Roxa */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-purple-600/30 blur-[120px]"
        />
        
        {/* Luz Azul */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-blue-600/20 blur-[120px]"
        />
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0077FF]/10 border border-[#0077FF]/20 text-secondary text-[10px] font-bold uppercase tracking-widest mb-8">
              <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
              Poder de IA para Pequenas Empresas
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.1] tracking-tight mb-6">
              Criamos sites que ajudam <br className="hidden md:block" />
              <span className="bg-[linear-gradient(90deg,#0077FF_0%,#00BFB3_50%,#8A2BE2_100%)] bg-clip-text text-transparent">sua empresa a crescer.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-md">
              Desenvolvemos sites modernos, rápidos e focados em gerar clientes. Utilizamos Inteligência Artificial para entregar qualidade e velocidade incomparáveis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contato" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-[0_0_30px_-5px_rgba(0,119,255,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,119,255,0.6)]">
                Solicitar orçamento
              </a>
              <a href="#portfolio" className="inline-flex items-center justify-center px-8 py-4 border border-white/10 hover:bg-white/5 text-white font-bold rounded-xl transition-all hover:scale-105">
                Ver portfólio
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-[20px] overflow-hidden border-[12px] border-b-[24px] border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] aspect-[16/10] bg-slate-800 flex flex-col">
              {/* Fake Browser Chrome */}
              <div className="w-full h-6 bg-slate-700/50 flex items-center px-3 gap-1 z-20 shrink-0 relative">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              
              {/* Mockup Content - Sugestão 2: Códigos preenchendo a tela toda */}
              <div className="relative flex-1 bg-[#0d1117] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80"
                  alt="Code interface preview"
                  className="absolute inset-0 w-full h-full object-cover object-left-top opacity-70 mix-blend-luminosity transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 md:-left-12 w-32 h-32 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl z-30"
            >
              <div className="text-[10px] text-gray-400 font-bold uppercase">Performance</div>
              <div className="text-2xl font-bold text-secondary">99.9%</div>
              <div className="h-1 w-full bg-gray-800 rounded-full">
                <div className="h-full w-[99%] bg-secondary rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}