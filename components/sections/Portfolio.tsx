'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2, Briefcase } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Projetos padrão para carregar instantaneamente enquanto o Firebase responde em segundo plano
const defaultProjects = [
  {
    id: '1',
    title: 'Clínica Ecosaúde',
    description: 'Plataforma digital imersiva focada em saúde integral, unindo inovação, acolhimento humanizado e estética moderna.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    projectUrl: '#'
  }
];

export function Portfolio() {
  const [projects, setProjects] = useState<any[]>(defaultProjects);
  const [loading, setLoading] = useState(false); // Mudado para false para nunca prender a tela

  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(collection(db, 'portfolio_items'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fetchedProjects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setProjects(fetchedProjects);
        }
      } catch (error) {
        console.error("Erro ao buscar projetos do portfólio (usando padrão):", error);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-[#080E18] border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">Trabalhos Recentes</h2>
            <p className="text-gray-400 text-lg">
              Explore nossa seleção de projetos recentes e veja como ajudamos empresas a elevarem seu padrão digital.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const imageSrc = project.imageUrl || project.image;
            const projectLink = project.projectUrl && project.projectUrl.length > 5 ? project.projectUrl : '#';

            return (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <a 
                  href={projectLink} 
                  target={projectLink !== '#' ? "_blank" : "_self"} 
                  rel="noopener noreferrer" 
                  className="group cursor-pointer block"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-white/5 border border-white/5 group-hover:border-primary transition-all">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={project.title || 'Projeto'}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">Sem imagem</div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg shadow-primary/30">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-secondary font-bold uppercase tracking-widest mb-2">Projeto Recente</div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );