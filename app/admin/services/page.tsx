'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, getDocs, where, doc, setDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit2, Trash2, GripVertical, Loader2 } from 'lucide-react';
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
import * as Icons from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

function SortableItem({ item, onEdit, onDelete }: { item: ServiceItem, onEdit: (i: ServiceItem) => void, onDelete: (id: string) => void }) {
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

  const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 ${isDragging ? 'shadow-xl rounded-lg border-blue-500' : ''}`}
    >
      <button {...attributes} {...listeners} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing">
        <GripVertical size={20} />
      </button>
      
      <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
        <IconComponent size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.description}</p>
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

export default function ServicesAdmin() {
  const { userData } = useAuth();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    title: '', description: '', icon: 'Code'
  });

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
      const q = query(collection(db, 'services'), where('companyId', '==', userData.companyId), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceItem));
      setItems(data);
    } catch (error) {
      toast.error('Erro ao buscar serviços');
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
          updateDoc(doc(db, 'services', item.id), { order: index })
        );
        await Promise.all(promises);
        toast.success('Ordem atualizada!');
      } catch (err) {
        toast.error('Erro ao atualizar ordem');
        fetchItems();
      }
    }
  };

  const openModal = (item?: ServiceItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ title: '', description: '', icon: 'Code' });
    }
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
        await setDoc(doc(db, 'services', editingItem.id), dataToSave);
        toast.success('Serviço atualizado!');
      } else {
        const newRef = doc(collection(db, 'services'));
        await setDoc(newRef, {
        companyId: userData?.companyId, id: newRef.id, ...dataToSave });
        toast.success('Serviço criado!');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error('Erro ao salvar serviço');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'services', deleteId));
      toast.success('Serviço excluído!');
      setDeleteId(null);
      fetchItems();
    } catch (error) {
      toast.error('Erro ao excluir');
    } finally {
      setIsDeleting(false);
    }
  };

  const popularIcons = ['Code', 'Monitor', 'Smartphone', 'Search', 'PenTool', 'Megaphone', 'Settings', 'Database', 'Cloud', 'Lock'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Serviços</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie os serviços oferecidos.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Novo Serviço
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Arraste para reordenar</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-slate-500">Nenhum serviço encontrado.</div>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Editar Serviço' : 'Novo Serviço'}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título do Serviço</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ícone (Lucide React)</label>
            <div className="grid grid-cols-5 gap-2">
              {popularIcons.map(iconName => {
                const IconComponent = (Icons as any)[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setFormData({...formData, icon: iconName})}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border ${formData.icon === iconName ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <IconComponent size={24} className="mb-1" />
                    <span className="text-[10px] truncate max-w-full">{iconName}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Ícone atual selecionado: <span className="font-bold">{formData.icon}</span>. (Pode digitar outros nomes válidos abaixo)
            </div>
            <input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Cancelar</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Salvar Serviço'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        title="Excluir Serviço" 
        description="Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita."
        isLoading={isDeleting}
      />
    </div>
  );
}
