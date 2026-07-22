'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';

export function Footer() {
  const [imageError, setImageError] = useState(false);

  return (
    <footer className="bg-[#050810] border-t border-white/5 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          
          {/* Logo Oficial e Nome */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 overflow-hidden rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              {!imageError ? (
                <Image 
                  src="/logo.png" 
                  alt="Logo Nexora Studios" 
                  width={40} 
                  height={40} 
                  className="object-contain" 
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  N
                </div>
              )}
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 font-heading">
              Nexora <span className="text-primary">Studios</span>
            </span>
          </Link>

          {/* Links rápidos */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <a href="#servicos" className="hover:text-white transition-colors">Serviços</a>
            <a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portfólio</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          {/* Redes Sociais */}
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-white hover:border-primary transition-all">
              <Github className="w-5 h-5" />
            </a>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Nexora Studios. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}