import React from 'react';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarClock,
  MessageSquareShare,
  Settings2,
  TrendingUp,
  BarChart3,
  X,
  HardDrive,
  Info
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  overdueCount: number;
  todayCount: number;
  isDemo: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  overdueCount,
  todayCount,
  isDemo,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Visão Geral',
      icon: LayoutDashboard,
    },
    {
      id: 'oportunidades',
      label: 'Oportunidades & Funil',
      icon: Kanban,
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: Users,
    },
    {
      id: 'acompanhamentos',
      label: 'Acompanhamentos',
      icon: CalendarClock,
      badge: overdueCount > 0 ? overdueCount : todayCount > 0 ? todayCount : undefined,
      badgeColor: overdueCount > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white',
    },
    {
      id: 'mensagens',
      label: 'Mensagens WhatsApp',
      icon: MessageSquareShare,
    },
    {
      id: 'relatorios',
      label: 'Relatórios & CSV',
      icon: BarChart3,
    },
    {
      id: 'configuracoes',
      label: 'Configurações & Backup',
      icon: Settings2,
    },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & App Brand */}
        <div>
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                  Vira<span className="text-emerald-600">Venda</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 tracking-wide">
                  Assistente Comercial
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        item.badgeColor || 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Storage & Demo info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
          {isDemo && (
            <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Modo Demonstração</span>
                <span className="text-amber-700 text-[11px]">
                  Exemplos para testar. Você pode limpar nas configurações.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <HardDrive className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Dados salvos no seu navegador</span>
          </div>
        </div>
      </aside>
    </>
  );
};
