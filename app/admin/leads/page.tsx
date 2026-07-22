'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, Filter, Download, Loader2, Trash2, Mail, Phone, Building, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  status?: string;
  createdAt?: any;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      setLeads(data);
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      toast.error('Erro ao buscar leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), { status: newStatus });
      setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
      toast.success('Status atualizado!');
    } catch (err) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'leads', deleteId));
      setLeads(leads.filter(lead => lead.id !== deleteId));
      toast.success('Lead excluído com sucesso');
      setDeleteId(null);
    } catch (error) {
      toast.error('Erro ao excluir lead');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return toast.info('Nenhum dado para exportar');

    const headers = ['Nome', 'Email', 'Telefone', 'Empresa', 'Mensagem', 'Status', 'Data'];
    const csvData = filteredLeads.map(lead => [
      `"${lead.name || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.phone || ''}"`,
      `"${lead.company || ''}"`,
      `"${(lead.message || '').replace(/"/g, '""')}"`,
      `"${lead.status || 'Novo'}"`,
      `"${lead.createdAt?.toDate ? format(lead.createdAt.toDate(), 'dd/MM/yyyy HH:mm') : ''}"`
    ].join(','));

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(lead => {
    const name = lead.name || '';
    const email = lead.email || '';
    const company = lead.company || '';
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Leads e Contatos</h2>
          <p className="text-slate-400 mt-1">Gerencie os contatos recebidos pelo site.</p>
        </div>
        
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
        >
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou empresa..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="sm:w-64 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
          >
            <option value="all">Todos os Status</option>
            <option value="Novo">Novo</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Fechado">Fechado</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-20 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
              Nenhum lead encontrado com os filtros atuais.
            </div>
          ) : (
            filteredLeads.map(lead => {
              const phoneDigits = lead.phone ? lead.phone.replace(/\D/g, '') : '';
              return (
                <div key={lead.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-xl font-bold text-white">{lead.name || 'Sem nome'}</h3>
                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status || 'Novo'}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="text-sm font-medium px-3 py-1.5 rounded-lg border bg-slate-900 border-slate-700 text-blue-400 outline-none"
                        >
                          <option value="Novo">Novo</option>
                          <option value="Em andamento">Em andamento</option>
                          <option value="Fechado">Fechado</option>
                        </select>
                        <button 
                          onClick={() => setDeleteId(lead.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail size={16} /> <a href={`mailto:${lead.email || ''}`} className="hover:text-blue-400">{lead.email || 'Sem e-mail'}</a>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone size={16} /> <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className="hover:text-emerald-400">{lead.phone || 'Sem telefone'}</a>
                      </div>
                      {lead.company && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Building size={16} /> <span>{lead.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={16} /> <span>{lead.createdAt?.toDate ? format(lead.createdAt.toDate(), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR }) : 'Data desconhecida'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 bg-slate-900 rounded-xl p-4 border border-slate-800 text-sm">
                    <span className="font-semibold block mb-2 text-white">Mensagem:</span>
                    <p className="text-slate-400 whitespace-pre-wrap">{lead.message || 'Sem mensagem'}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 text-white">
            <h3 className="text-lg font-bold">Excluir Lead</h3>
            <p className="text-slate-400 text-sm">Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}