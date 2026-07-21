'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, AlertCircle, Loader2 } from 'lucide-react';
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
    <section id="contato" className="py-24 bg-[#080E18] border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Vamos conversar?</h2>
            <p className="text-gray-400 text-lg mb-12">
              Preencha o formulário e nossa equipe entrará em contato em até 24 horas para entender seu projeto e apresentar uma proposta.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">E-mail</div>
                  <div className="text-white font-medium">contato@nexorastudios.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Telefone / WhatsApp</div>
                  <div className="text-white font-medium">+55 (11) 99999-9999</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Localização</div>
                  <div className="text-white font-medium">São Paulo, SP - Brasil (Remoto)</div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-xl bg-white/5 border border-white/5 shadow-2xl"
          >
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome Completo</label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`w-full bg-dark/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'}`}
                    placeholder="João Silva"
                  />
                  {errors.name && <span className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.name.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="company" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa</label>
                  <input
                    type="text"
                    id="company"
                    {...register('company')}
                    className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="Sua Empresa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail Corporativo</label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`w-full bg-dark/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'}`}
                    placeholder="joao@empresa.com"
                  />
                  {errors.email && <span className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.email.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className={`w-full bg-dark/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'}`}
                    placeholder="(11) 99999-9999"
                  />
                  {errors.phone && <span className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.phone.message}</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold text-gray-400 uppercase tracking-wider">Como podemos ajudar?</label>
                <textarea
                  id="message"
                  rows={4}
                  {...register('message')}
                  className={`w-full bg-dark/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'}`}
                  placeholder="Conte-nos um pouco sobre o seu projeto e objetivos..."
                />
                {errors.message && <span className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:scale-105 text-white font-bold text-sm uppercase tracking-wider transition-all mt-6 shadow-[0_0_30px_-5px_rgba(0,119,255,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar solicitação'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

