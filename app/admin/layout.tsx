'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { ProtectedRoute } from '../../components/admin/auth/ProtectedRoute'; // <-- Cão de Guarda Adicionado
import { 
  LayoutDashboard, 
  Briefcase, 
  ImageIcon, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Globe,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Globe, label: 'Pages', href: '/admin/pages' },
  { icon: Briefcase, label: 'Portfolio', href: '/admin/portfolio' },
  { icon: ImageIcon, label: 'Services', href: '/admin/services' },
  { icon: FileText, label: 'Blog', href: '/admin/blog' },
  { icon: Users, label: 'Leads', href: '/admin/leads' },
  { icon: Building2, label: 'Companies', href: '/admin/companies', superAdminOnly: true },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, userData, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // A tela de carregamento continua para garantir que os dados do usuário (nome, cargo) carreguem antes de desenhar a tela
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050810] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium text-slate-400">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  const isSuperAdmin = userData.role === 'SuperAdmin';
  const filteredMenu = menuItems.filter(item => !item.superAdminOnly || isSuperAdmin);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050810] flex text-white">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Escura */}
        <aside 
          className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#080E18] border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Nexora CMS</span>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {filteredMenu.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active 
                      ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {userData.name ? userData.name.charAt(0) : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{userData.name || 'Admin'}</p>
                <p className="text-xs text-slate-400 truncate">{userData.email || ''}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content Escuro */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#050810]">
          <header className="h-16 flex items-center justify-between px-6 bg-[#080E1