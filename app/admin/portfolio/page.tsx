'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import Image from 'next/image';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  accessLink: string;
  createdAt: number;
}

export default function PortfolioAdmin() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    title: '', category: '', imageUrl: '', accessLink: ''
  });

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'portfolio_items'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
      setItems(data);
    } catch (error) {
      console.warn("Unable to fetch portfolio projects", error);
      toast.error('Erro ao buscar projetos do portfólio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '', category: '', imageUrl: '', accessLink: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = {
        title: formData.title,
        category: formData.category,
        imageUrl: formData.imageUrl,
        accessLink: formData.accessLink,
        createdAt: editingItem ? editingItem.createdAt : Date.now(),
      };

      if (editingItem) {
        await setDoc(doc(db, 'portfolio_items', editingItem.id), dataToSave, { merge: true });
        toast.success('Projeto atualizado com sucesso!');
      } else {
        const newRef = doc(collection(db, 'portfolio_items'));
        await setDoc(newRef, { id: newRef.id, ...dataToSave });
        toast.success('Projeto criado com sucesso!');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.warn("Error saving project", error);
      toast.error('Erro ao salvar projeto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'portfolio_items', deleteId));
      toast.success('Projeto excluído com sucesso!');
      setDeleteId(null);
      fetchItems();
    } catch (error) {
      console.warn("Error deleting project", error);
      toast.error('Erro ao excluir projeto');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Portfólio</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie os projetos exibidos no site.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Adicionar Projeto
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">Nenhum projeto cadastrado no momento.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {items.map(item => (
              <div key={item.id} className="group bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-video relative bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="text-slate-400 w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(item)} className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg shadow-sm">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">{item.category}</p>
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate text-lg">{item.title}</h4>
                    </div>
                  </div>
                  {item.accessLink && (
                    <a href={item.accessLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-3">
                      <ExternalLink size={14} />
                      Acessar Projeto
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Editar Projeto' : 'Novo Projeto'}>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Título do Projeto</label>
            <input 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
              placeholder="Ex: E-commerce Nexora"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Categoria</label>
            <input 
              required 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Ex: Desenvolvimento Web"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL da Imagem</label>
            <input 
              required 
              type="url"
              value={formData.imageUrl} 
              onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="https://exemplo.com/imagem.png"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Link de Acesso</label>
            <input 
              type="url"
              value={formData.accessLink} 
              onChange={e => setFormData({...formData, accessLink: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="https://meuprojeto.com (Opcional)"
            />
          </div>

          <div className="flex justify-end pt-5 border-t border-slate-200 dark:border-slate-800 gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">Cancelar</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        title="Excluir Projeto" 
        description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
        isLoading={isDeleting}
      />
    </div>
  );
}

