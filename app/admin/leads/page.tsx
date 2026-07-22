'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, Filter, Download, Loader2, Trash2, Mail, Phone, Building, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  status: 'Novo' | 'Em andamento' | 'Fechado';
  createdAt: any;
}

export default function LeadsAdmin() {
  const { userData } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Removido o filtro restritivo de companyId para buscar todos os leads do site
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      setLeads(data);
    } catch (error) {
      console.error(error);
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
      setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: newStatus as any } : lead));
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
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.phone}"`,
      `"${lead.company || ''}"`,
      `"${lead.message.replace(/"/g, '""')}"`,
      `"${lead.status || 'Novo'}"`,
      `"${lead.createdAt ? format(lead.createdAt.toDate(), 'dd/MM/yyyy HH:mm') : ''}"`
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
    const matchesSearch = 
      (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leads e Contatos</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie os contatos recebidos pelo site.</p>
        </div>
        
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou empresa..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="sm:w-64 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
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
            <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
              Nenhum lead encontrado com os filtros atuais.
            </div>
          ) : (
            filteredLeads.map(lead => (
              <div key={lead.id} className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold">{lead.name}</h3>
                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status || 'Novo'}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-sm font-medium px-3 py-1.5 rounded-lg border outline-none ${
                          lead.status === 'Novo' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                          lead.status === 'Fechado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
                          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                        }`}
                      >
                        <option value="Novo">Novo</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Fechado">Fechado</option>
                      </select>
                      <button 
                        onClick={() => setDeleteId(lead.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded