'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Serviços', href: '#servicos' },
    { name: 'Diferenciais', href: '#diferenciais' },
    { name: 'Portfólio', href: '#portfolio' },
    { name: 'Planos', href: '#planos' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0B1320]/70 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Link da Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group px-3 py-2 -ml-3 rounded-2xl hover:bg-white/5 active:scale-95 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {/* Container da Logo */}
            <div className="w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center bg-white/5 border border-white/10 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,119,255,0.3)]">
              {!imageError ? (
                <Image 
                  src="/logo.png" 
                  alt="Logo Nexora Studios" 
                  width={40} 
                  height={40} 
                  className="object-contain" 
                  priority 
                  onError={() => setImageError(true)}
                />
              ) : (
                /* Caso a imagem falhe, mostra um ícone brilhante temporário para não quebrar o layout */
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  N
                </div>
              )}
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 font-heading">
              Nexora <span className="text-primary">Studios</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="#contato"
              className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,119,255,0.4)]"
            >
              Solicitar Orçamento
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-light"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-dark/95 backdrop-blur-xl border-b border-white/10 py-6 md:hidden"
          >
            <div className="container mx-auto px-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-light/80 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-6 py-3 text-center rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium"
              >
                Falar com especialista
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}