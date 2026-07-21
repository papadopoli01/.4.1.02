'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'motion/react';
import { Briefcase, Users, MessageSquare, ImageIcon, TrendingUp, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardStats {
  portfolio: number;
  services: number;
  testimonials: number;
  leads: number;
}

export default function DashboardHome() {
  const { userData } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ portfolio: 0, services: 0, testimonials: 0, leads: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return;

    async function fetchDashboard() {
      try {
        const isSuperAdmin = userData?.role === 'SuperAdmin';
        const constraints = [];
        
        if (!isSuperAdmin) {
          constraints.push(where('companyId', '==', userData!.companyId));
        }

        const baseQueryPortfolio = query(collection(db, 'portfolio_items'), ...constraints);
        const baseQueryServices = query(collection(db, 'services'), ...constraints);
        const baseQueryTestimonials = query(collection(db, 'testimonials'), ...constraints);
        const baseQueryLeads = query(collection(db, 'leads'), ...constraints);
        
        const recentLeadsQuery = query(
          collection(db, 'leads'), 
          ...constraints,
          orderBy('createdAt', 'desc'), 
          limit(5)
        );

        const [portfolioSnap, servicesSnap, testimonialsSnap, leadsSnap, recentLeadsSnap] = await Promise.allSettled([
          getDocs(baseQueryPortfolio),
          getDocs(baseQueryServices),
          getDocs(baseQueryTestimonials),
          getDocs(baseQueryLeads),
          getDocs(recentLeadsQuery)
        ]);

        setStats({
          portfolio: portfolioSnap.status === 'fulfilled' ? portfolioSnap.value.size : 0,
          services: servicesSnap.status === 'fulfilled' ? servicesSnap.value.size : 0,
          testimonials: testimonialsSnap.status === 'fulfilled' ? testimonialsSnap.value.size : 0,
          leads: leadsSnap.status === 'fulfilled' ? leadsSnap.value.size : 0,
        });

        if (recentLeadsSnap.status === 'fulfilled') {
          setRecentLeads(recentLeadsSnap.value.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          setRecentLeads([]);
        }
      } catch (error) {
        console.warn("Unable to fetch dashboard data. Permissions might be restricted.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [userData]);

  const statCards = [
    { label: 'Projetos no Portfólio', value: stats.portfolio, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Serviços Ativos', value: stats.services, icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Depoimentos', value: stats.testimonials, icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Leads Totais', value: stats.leads, icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bem-vindo(a) de volta, {userData?.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Veja um resumo do que está acontecendo no seu site.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Últimos Leads</h3>
                <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-3">
                {recentLeads.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-8">Nenhum lead recebido ainda.</p>
                ) : (
                  recentLeads.map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                          lead.status === 'Novo' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                          lead.status === 'Fechado' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {lead.status || 'Novo'}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5">
                          {lead.createdAt ? format(lead.createdAt.toDate(), "dd 'de' MMM, HH:mm", { locale: ptBR }) : 'Recente'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 h-[400px]"
            >
              <Activity size={48} className="mb-4 opacity-30 text-blue-500" />
              <p className="font-medium text-slate-700 dark:text-slate-300">Gráfico de Atividades Recentes</p>
              <p className="text-sm mt-2 opacity-70 text-center max-w-xs">Os gráficos e análises detalhadas aparecerão aqui assim que houver volume suficiente de dados.</p>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
