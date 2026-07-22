'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'motion/react';
import { Briefcase, Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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
      toast.error("Preencha todos os campos do projeto.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'portfolio_items'), {
        title,
        description,
        imageUrl,
        createdAt: serverTimestamp()
      });
      toast.success("Projeto adicionado com sucesso!");
      setTitle('');
      setDescription('');
      setImageUrl('');
      fetchPortfolio(); // Recarrega a lista para mostrar o novo projeto
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      toast.error("Ocorreu um erro ao adicionar o projeto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem a certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.")) return;
    
    try {
      await deleteDoc(doc(db, 'portfolio_items', id));
      toast.success("Projeto excluído com sucesso!");
      fetchPortfolio();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir o projeto.");
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-500" />
          Gerenciar Portfólio
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Adicione, visualize ou remova os projetos que aparecem no seu site.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Formulário de Adição */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Novo Projeto</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título do Projeto</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Ex: E-commerce de Roupas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição Curta</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Breve resumo sobre o que foi feito..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link da Imagem</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="https://..."
                />
                <p className="text-xs text-slate-500 mt-1.5">Cole a URL direta de uma imagem hospedada na web.</p>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-70 mt-4"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Cadastrar Projeto
              </button>
            </form>
          </div>
        </div>

        {/* Lado Direito: Lista de Projetos */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[500px]">
            <h3 className="text-lg font-bold mb-6">Projetos Publicados</h3>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <ImageIcon className="w-12 h-12 mx-auto text-slate-400 mb-3 opacity-50" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhum projeto no portfólio.</p>
                <p className="text-sm text-slate-400 mt-1">Use o formulário ao lado para adicionar o primeiro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900/50 hover:border-blue-500/50 transition-colors"
                  >
                    {/* Imagem do Projeto */}
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      
                      {/* Botão de excluir que aparece ao passar o rato */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </button>
                      </div>
                    </div>
                    
                    {/* Informações */}
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}