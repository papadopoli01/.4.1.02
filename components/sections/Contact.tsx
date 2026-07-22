'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Loader2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  company: z.string().optional(),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...data,
        status: 'Novo',
        createdAt: serverTimestamp(),
      });
      toast.success('Solicitação enviada com sucesso! Entraremos em contato em breve.');
      reset();
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Ocorreu um erro ao enviar sua solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-24 bg-[#050810] relative overflow-hidden border-t border-white/5">
      {/* Luz de fundo suave */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Informações de Contato (Lado Esquerdo) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-6">
              Vamos <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Conversar?</span>
            </h2>
            <p className="text-gray-400 mb-12 text-lg leading-relaxed max-w-md">
              Preencha o formulário e a nossa equipe entrará em contato em até 24 horas para entender o seu projeto e apresentar a melhor solução tecnológica.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-[#0a0f1a] border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/50 transition-all duration-300 shadow-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">E-mail</p>
                  <p className="text-white font-medium text-lg">contato@nexorastudios.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-[#0a0f1a] border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/50 transition-all duration-300 shadow-lg">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">WhatsApp</p>
                  <p className="text-white font-medium text-lg">+55 (11) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-[#0a0f1a] border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/10 group-hover:border-purple-500/50 transition-all duration-300 shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Localização</p>
                  <p className="text-white font-medium text-lg">São Paulo, SP - Brasil (Remoto)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Formulário (Lado Direito) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-10 rounded-3xl bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
          >
            {/* Brilho decorativo no topo do card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Nome Completo</label>
                  <input
                    type="text"
                    {...register('name')}
                    className={`w-full bg-[#050810] border rounded-xl px-5 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.name ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-blue-500 focus:ring-blue-500/20'}`}
                    placeholder="João Silva"
                  />
                  {errors.name && <span className="text-red-400 text-xs mt-1.5 ml-1 block">{errors.name.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Empresa</label>
                  <input
                    type="text"
                    {...register('company')}
                    className="w-full bg-[#050810] border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Sua Empresa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">E-mail</label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full bg-[#050810] border rounded-xl px-5 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.email ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-blue-500 focus:ring-blue-500/20'}`}
                    placeholder="joao@empresa.com"
                  />
                  {errors.email && <span className="text-red-400 text-xs mt-1.5 ml-1 block">{errors.email.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Telefone</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className={`w-full bg-[#050810] border rounded-xl px-5 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.phone ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-blue-500 focus:ring-blue-500/20'}`}
                    placeholder="(11) 99999-9999"
                  />
                  {errors.phone && <span className="text-red-400 text-xs mt-1.5 ml-1 block">{errors.phone.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Como podemos ajudar?</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className={`w-full bg-[#050810] border rounded-xl px-5 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${errors.message ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-blue-500 focus:ring-blue-500/20'}`}
                  placeholder="Conte-nos um pouco sobre o seu projeto e objetivos..."
                />
                {errors.message && <span className="text-red-400 text-xs mt-1.5 ml-1 block">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 mt-8 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Enviar Solicitação</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}