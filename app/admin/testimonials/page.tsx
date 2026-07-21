'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, getDocs, where, doc, setDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon, Loader2, Star } from 'lucide-react';
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
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  avatarUrl: string;
  order: number;
}

function SortableItem({ item, onEdit, onDelete }: { item: Testimonial, onEdit: (i: Testimonial) => void, onDelete: (id: string) => void }) {
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
      
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 relative flex items-center justify-center">
        {item.avatarUrl ? (
          <Image src={item.avatarUrl} alt={item.name} fill className="object-cover" />
        ) : (
          <span className="font-bold text-slate-500">{item.name.charAt(0)}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.role} @ {item.company}</p>
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < item.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'} />
          ))}
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

export default function TestimonialsAdmin() {
  const { userData } = useAuth();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '', company: '', role: '', content: '', rating: 5, avatarUrl: ''
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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
      const q = query(collection(db, 'testimonials'), where('companyId', '==', userData.companyId), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setItems(data);
    } catch (error) {
      toast.error('Erro ao buscar depoimentos');
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
          updateDoc(doc(db, 'testimonials', item.id), { order: index })
        );
        await Promise.all(promises);
        toast.success('Ordem atualizada!');
      } catch (err) {
        toast.error('Erro ao atualizar ordem');
        fetchItems();
      }
    }
  };

  const openModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', company: '', role: '', content: '', rating: 5, avatarUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const fileRef = ref(storage, `${userData?.companyId || 'default'}/avatars/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(fileRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      setFormData({ ...formData, avatarUrl: url });
      toast.success('Foto carregada!');
    } catch (err) {
      toast.error('Erro ao carregar foto');
    } finally {
      setUploadingAvatar(false);
    }
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
        await setDoc(doc(db, 'testimonials', editingItem.id), dataToSave);
        toast.success('Depoimento atualizado!');
      } else {
        const newRef = doc(collection(db, 'testimonials'));
        await setDoc(newRef, {
        companyId: userData?.companyId, id: newRef.id, ...dataToSave });
        toast.success('Depoimento adicionado!');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error('Erro ao salvar depoimento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'testimonials', deleteId));
      toast.success('Depoimento excluído!');
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
          <h2 className="text-2xl font-bold tracking-tight">Depoimentos</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie os depoimentos dos seus clientes.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> Novo Depoimento
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Arraste para reordenar</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-slate-500">Nenhum depoimento encontrado.</div>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Editar Depoimento' : 'Novo Depoimento'}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center relative overflow-hidden shrink-0">
              {formData.avatarUrl ? (
                <Image src={formData.avatarUrl} alt="Avatar" fill className="object-cover" />
              ) : (
                <ImageIcon className="text-slate-400" />
              )}
            </div>
            <label className="cursor-pointer px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 rounded-lg text-sm font-medium transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              {uploadingAvatar ? 'Carregando...' : 'Carregar Foto'}
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Cliente</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Empresa</label>
              <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cargo</label>
              <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium block mb-1">Avaliação</label>
              <div className="flex gap-1 h-[42px] items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className="p-1"
                  >
                    <Star size={24} className={star <= (formData.rating || 5) ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comentário</label>
            <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg resize-none" />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Cancelar</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Salvar Depoimento'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        title="Excluir Depoimento" 
        description="Tem certeza que deseja excluir este depoimento? Esta ação não pode ser desfeita."
        isLoading={isDeleting}
      />
    </div>
  );
}
