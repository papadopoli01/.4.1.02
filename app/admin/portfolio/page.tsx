'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Briefcase, Plus, Trash2, Loader2, Image as ImageIcon, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estados do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    try {
      const q = query(collection(db, 'portfolio_items'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(fetchedItems);
    } catch (error) {
      console.error("Erro ao buscar portfólio:", error);
      toast.error("Erro ao carregar os projetos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !imageUrl) {
      toast.error("Preencha todos os campos obrigatórios do projeto.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Atualiza o projeto existente
        await updateDoc(doc(db, 'portfolio_items', editingId), {
          title,
          description,
          imageUrl,
          projectUrl: projectUrl || '#',
        });
        toast.success("Projeto atualizado com sucesso!");
      } else {
        // Cria um novo projeto
        await addDoc(collection(db, 'portfolio_items'), {
          title,
          description,
          imageUrl,
          projectUrl: projectUrl || '#',
          createdAt: serverTimestamp()
        });
        toast.success("Projeto adicionado com sucesso!");
      }
      resetForm();
      fetchPortfolio();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Ocorreu um erro ao salvar o projeto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(item: any) {
    setEditingId(item.id);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setImageUrl(item.imageUrl || '');
    setProjectUrl(item.projectUrl || '');
    // Rola a tela para o topo para a pessoa ver o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setProjectUrl('');
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem a certeza que deseja excluir este projeto?")) return;
    
    try {
      await deleteDoc(doc(db, 'portfolio_items', id));
      toast.success("Projeto excluído com sucesso!");
      if (editingId === id) resetForm(); // Limpa o form se estiver editando o que foi apagado
      fetchPortfolio();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir o projeto.");
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
          <Briefcase className="w-6 h-6 text-blue-500" />
          Gerenciar Portfólio
        </h2>
        <p className="text-slate-400 mt-1">
          Adicione, edite, visualize ou remova os projetos do site.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Formulário */}
        <div className="xl:col-span-1">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Editar Projeto' : 'Novo Projeto'}
              </h3>
              {editingId && (
                <button onClick={resetForm} className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
                  <X className="w-4 h-4" /> Cancelar
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Título do Projeto</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: E-commerce de Roupas"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Descrição Curta</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Breve resumo..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Link da Imagem</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Link de Destino (URL do Projeto)</label>
                <input
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://seusite.com (Opcional)"
                />
                <p className="text-xs text-slate-500 mt-1">Para onde o usuário vai ao clicar na imagem.</p>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-white rounded-xl font-bold transition-colors disabled:opacity-70 mt-4 ${
                  editingId ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                {editingId ? 'Atualizar Projeto' : 'Cadastrar Projeto'}
              </button>
            </form>
          </div>
        </div>

        {/* Lado Direito: Lista de Projetos */}
        <div className="xl:col-span-2">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-sm min-h-[500px]">
            <h3 className="text-lg font-bold mb-6 text-white">Projetos Publicados</h3>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl">
                <ImageIcon className="w-12 h-12 mx-auto text-slate-400 mb-3 opacity-50" />
                <p className="text-slate-400 font-medium">Nenhum projeto no portfólio.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative rounded-xl border overflow-hidden bg-slate-900/50 transition-colors ${
                      editingId === item.id ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-800 hover:border-blue-500/50'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-800 relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      
                      {/* Botões de Ação sobre a imagem */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                          title="Editar Projeto"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          title="Excluir Projeto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-white truncate">{item.title}</h4>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}