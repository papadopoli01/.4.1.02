'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, getDocs, where, doc, setDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit2, Trash2, GripVertical, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Plan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  order: number;
}

function SortableItem({ item, onEdit, onDelete }: { item: Plan, onEdit: (i: Plan) => void, onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 ${isDragging ? 'shadow-xl rounded-lg border-blue-500' : ''}`}
    >
      <button {...attributes} {...listeners} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing">
        <GripVertical size={20} />
      </button>

      <div className="flex-1 min-w-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</h4>
            {item.isPopular && <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Destaque</span>}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.price} {item.period ? `/ ${item.period}` : ''} • {item.features.length} recursos</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10">
          <Edit2 size={18} />
        </button>
        <button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function PlansAdmin() {
  const { userData } = useAuth();
  const [items, setItems] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Plan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Plan>>({
    name: '', price: '', period: '', description: '', features: [], isPopular: false, ctaText: 'Assinar agora'
  });
  const [featureInput, setFeatureInput] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchItems = async () => {
    setLoading(true);
    try {
      if (!userData) return;
      const q = query(collection(db, 'plans'), where('companyId', '==', userData.companyId), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan));
      setItems(data);
    } catch (error) {
      toast.error('Erro ao buscar planos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [userData]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      try {
        const promises = newItems.map((item, index) => 
          updateDoc(doc(db, 'plans', item.id), { order: index })
        );
        await Promise.all(promises);
        toast.success('Ordem atualizada!');
      } catch (err) {
        toast.error('Erro ao atualizar ordem');
        fetchItems();
      }
    }
  };

  const openModal = (item?: Plan) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', price: '', period: '', description: '', features: [], isPopular: false, ctaText: 'Assinar agora' });
    }
    setFeatureInput('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        order: editingItem ? editingItem.order : items.length,
      };

      if (editingItem) {
        await setDoc(doc(db, 'plans', editingItem.id), dataToSave);
        toast.success('Plano atualizado!');
      } else {
        const newRef = doc(collection(db, 'plans'));
        await setDoc(newRef, {
        companyId: userData?.companyId, id: newRef.id, ...dataToSave });
        toast.success('Plano criado!');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error('Erro ao salvar plano');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'plans', deleteId));
      toast.success('Plano excluído!');
      setDeleteId(null);
      fetchItems();
    } catch (error) {
      toast.error('Erro ao excluir');
    } finally {
      setIsDeleting(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({...formData, features: [...(formData.features || []), featureInput.trim()]});
      setFeatureInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Planos & Preços</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie os planos exibidos na tabela de preços.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Novo Plano
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Arraste para reordenar</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-slate-500">Nenhum plano encontrado.</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map(item => (
                  <SortableItem key={item.id} item={item} onEdit={openModal} onDelete={setDeleteId} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Editar Plano' : 'Novo Plano'} maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Plano</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" placeholder="Ex: Pro" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Texto do Botão (CTA)</label>
              <input required value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" placeholder="Ex: Assinar agora" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preço</label>
              <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" placeholder="Ex: R$ 99" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Período (Opcional)</label>
              <input value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" placeholder="Ex: mês" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição Breve</label>
            <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" placeholder="Para profissionais exigentes." />
          </div>

          <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            <label className="text-sm font-medium">Recursos do Plano</label>
            <div className="flex gap-2">
              <input 
                value={featureInput} 
                onChange={e => setFeatureInput(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                className="flex-1 p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" 
                placeholder="Ex: Suporte 24/7 (Pressione Enter)" 
              />
              <button type="button" onClick={addFeature} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">Adicionar</button>
            </div>
            <ul className="space-y-2 mt-4">
              {(formData.features || []).map((feat, i) => (
                <li key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-blue-500" />
                    <span className="text-sm">{feat}</span>
                  </div>
                  <button type="button" onClick={() => {
                    const newFeats = [...(formData.features || [])];
                    newFeats.splice(i, 1);
                    setFormData({...formData, features: newFeats});
                  }} className="text-slate-400 hover:text-red-500 p-1"><X size={16} /></button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <input type="checkbox" id="isPopular" checked={formData.isPopular} onChange={e => setFormData({...formData, isPopular: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="isPopular" className="text-sm font-medium">Destacar plano (Plano mais popular)</label>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Cancelar</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Salvar Plano'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        title="Excluir Plano" 
        description="Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita."
        isLoading={isDeleting}
      />
    </div>
  );
}
