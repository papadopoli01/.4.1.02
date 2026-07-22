'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Loader2 } from 'lucide-react';
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
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Informações de Contato (Lado Esquerdo) */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Vamos conversar?</h2>
            <p className="text-slate-400 mb-8 text-lg">
              Preencha o formulário e nossa equipe entrará em contato em até 24 horas para entender seu projeto e apresentar uma proposta.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider font-bold">E-mail</p>
                  <p className="font-medium">contato@nexorastudios.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider font-bold">Telefone / WhatsApp</p>
                  <p className="font-medium">+55 (11) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider font-bold">Localização</p>
                  <p className="font-medium">São Paulo, SP - Brasil (Remoto)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário (Lado Direito) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-[#080E18] border border-slate-800 shadow-2xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome Completo</label>
                  <input
                    type="text"
                    {...register('name')}
                    className={`w-full bg-[#050810] border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'}`}
                    placeholder="João Silva"
                  />
                  {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Empresa</label>
                  <input
                    type="text"
                    {...register('company')}
                    className="w-full bg-[#050810] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Sua Empresa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mail</label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full bg-[#050810] border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'}`}
                    placeholder="joao@empresa.com"
                  />
                  {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefone</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className={`w-full bg-[#050810] border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'}`}
                    placeholder="(11) 99999-9999"
                  />
                  {errors.phone && <span className="text-red-400 text-xs mt-1 block">{errors.phone.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Como podemos ajudar?</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className={`w-full bg-[#050810] border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'}`}
                  placeholder="Conte-nos um pouco sobre o seu projeto e objetivos..."
                />
                {errors.message && <span className="text-red-400 text-xs mt-1 block">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] text-white font-bold text-sm uppercase tracking-wider transition-all mt-6 shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Solicitação'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}