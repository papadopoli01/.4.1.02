'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'motion/react';
import { Briefcase, Users, ImageIcon, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardHome() {
  const { userData } = useAuth();
  // Removido 'testimonials'
  const [stats, setStats] = useState({ portfolio: 0, services: 0, leads: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return;
    async function fetchDashboard() {
      try {
        const baseQueryPortfolio = query(collection(db, 'portfolio_items'));
        const baseQueryServices = query(collection(db, 'services'));
        const baseQueryLeads = query(collection(db, 'leads'));
        const recentLeadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(5));

        const [portfolioSnap, servicesSnap, leadsSnap, recentLeadsSnap] = await Promise.allSettled([
          getDocs(baseQueryPortfolio),
          getDocs(baseQueryServices),
          getDocs(baseQueryLeads),
          getDocs(recentLeadsQuery)
        ]);

        setStats({
          portfolio: portfolioSnap.status === 'fulfilled' ? portfolioSnap.value.size : 0,
          services: servicesSnap.status === 'fulfilled' ? servicesSnap.value.size : 0,
          leads: leadsSnap.status === 'fulfilled' ? leadsSnap.value.size : 0,
        });

        if (recentLeadsSnap.status === 'fulfilled') {
          setRecentLeads(recentLeadsSnap.value.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          setRecentLeads([]);
        }
      } catch (error) {
        console.warn("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [userData]);

  const statCards = [
    { label: 'Projetos no Portfólio', value: stats.portfolio, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-600/10' },
    { label: 'Serviços Ativos', value: stats.services, icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-600/10' },
    { label: 'Leads Totais', value: stats.leads, icon: Users, color: 'text-orange-600', bg: 'bg-orange-600/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Bem-vindo(a) de volta, {userData?.name || 'Admin'}</h2>
        <p className="text-slate-400 mt-2">Veja um resumo do que está acontecendo no seu site.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Ajustado para 3 colunas (md:grid-cols-3) para os cartões ficarem perfeitos na tela */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">{stat.value}</div>
                  <div className="text-sm font-medium text-black">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-black mb-6">Últimos Leads</h3>
              <div className="space-y-4">
                {recentLeads.length === 0 ? (
                  <div className="text-center py-8 text-black font-medium">
                    Nenhum lead recebido ainda.
                  </div>
                ) : (
                  recentLeads.map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-bold text-black">{lead.name || 'Sem nome'}</p>
                        <p className="text-sm text-black">{lead.email || 'Sem e-mail'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                          lead.status === 'Novo' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'Fechado' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {lead.status || 'Novo'}
                        </span>
                        <span className="text-xs text-black font-medium">
                          {lead.createdAt?.toDate ? format(lead.createdAt.toDate(), "dd 'de' MMM, HH:mm", { locale: ptBR }) : 'Recente'}
                        </span>
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
              className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center h-[400px]"
            >
              <Activity size={48} className="text-blue-600 mb-4 opacity-50" />
              <h3 className="font-bold text-black mb-2">Gráfico de Atividades Recentes</h3>
              <p className="text-sm text-black">Os gráficos e análises detalhadas aparecerão aqui assim que houver volume suficiente de dados.</p>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}