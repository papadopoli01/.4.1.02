'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, getDocs, doc, setDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function BlogPage() {
  const { userData } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      if (!userData) return;
      const isSuperAdmin = userData.role === 'SuperAdmin';
      const constraints = [];
      if (!isSuperAdmin) constraints.push(where('companyId', '==', userData.companyId));
      
      const q = query(collection(db, 'blog'), ...constraints);
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      toast.error('Erro ao buscar Blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [userData]);

  const openModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ title: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = { ...formData, companyId: userData?.companyId || 'default' };
      if (editingItem) {
        await setDoc(doc(db, 'blog', editingItem.id), dataToSave, { merge: true });
        toast.success('Atualizado com sucesso!');
      } else {
        const newRef = doc(collection(db, 'blog'));
        await setDoc(newRef, { id: newRef.id, ...dataToSave });
        toast.success('Criado com sucesso!');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error('Erro ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'blog', deleteId));
      toast.success('Excluído com sucesso!');
      setDeleteId(null);
      fetchItems();
    } catch (error) {
      toast.error('Erro ao excluir');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog</h2>
          <p className="text-slate-500 mt-1">Gerencie os registros.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Novo
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-slate-500">Nenhum registro encontrado.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <span className="font-medium">{item.title}</span>
                <div className="flex gap-2">
                  <button onClick={() => openModal(item)} className="p-2 text-slate-400 hover:text-blue-500"><Edit2 size={18} /></button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Editar' : 'Novo'}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium capitalize">title</label>
            <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" />
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700">Cancelar</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        title="Excluir" 
        description="Tem certeza? Esta ação não pode ser desfeita."
        isLoading={isDeleting}
      />
    </div>
  );
}
