'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileText, Settings, LogOut, Users } from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Portfólio', href: '/admin/portfolio', icon: Briefcase },
    { name: 'Serviços', href: '/admin/services', icon: FileText },
    { name: 'Clientes / Leads', href: '/admin/leads', icon: Users },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#080E18] border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          Nexora <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">Admin</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut className="w-5 h-5 rotate-180" />
          Voltar ao Site
        </Link>
      </div>
    </aside>
  );
}