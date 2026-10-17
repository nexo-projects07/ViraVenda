import React from 'react';
import { ActiveTab } from '../types';
import { Menu, Plus, UserPlus, Sparkles, Trash2 } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenMobileMenu: () => void;
  onNewClient: () => void;
  onNewOpportunity: () => void;
  isDemo: boolean;
  onClearDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onNewClient,
  onNewOpportunity,
  isDemo,
  onClearDemo,
}) => {
  const titles: Record<ActiveTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Painel Comercial',
      subtitle: 'Acompanhe suas vendas, orçamentos e prioridades do dia',
    },
    oportunidades: {
      title: 'Oportunidades & Pipeline',
      subtitle: 'Acompanhe as propostas do primeiro contato até o fechamento',
    },
    clientes: {
      title: 'Base de Clientes',
      subtitle: 'Contatos organizados para rápido atendimento e histórico',
    },
    acompanhamentos: {
      title: 'Acompanhamentos e Retornos',
      subtitle: 'Não perca vendas por esquecer de responder ou cobrar uma proposta',
    },
    mensagens: {
      title: 'Assistente de Mensagens WhatsApp',
      subtitle: 'Modelos profissionais para abordar, acompanhar orçamentos e fechar negócios',
    },
    relatorios: {
      title: 'Relatórios Comerciais & Resultados',
      subtitle: 'Métricas de conversão, faturamento, ticket médio e exportação em planilhas CSV',
    },
    configuracoes: {
      title: 'Configurações & Backup',
      subtitle: 'Gerenciamento de dados locais, exportação e informações do negócio',
    },
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      {/* Top Banner if Demo data is active */}
      {isDemo && (
        <div className="bg-emerald-800 text-emerald-100 text-xs px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>
              <strong>Ambiente de Demonstração:</strong> Os dados exibidos são exemplos para você conhecer o sistema.
            </span>
          </div>
          <button
            onClick={onClearDemo}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-md text-white font-semibold transition cursor-pointer text-[11px]"
          >
            <Trash2 className="w-3 h-3" />
            <span>Limpar exemplos e começar do zero</span>
          </button>
        </div>
      )}

      <div className="px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Abrir menu lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {current.title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewClient}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            title="Cadastrar novo cliente"
          >
            <UserPlus className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Novo Cliente</span>
          </button>

          <button
            onClick={onNewOpportunity}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition cursor-pointer"
            title="Criar nova oportunidade ou orçamento"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Oportunidade</span>
          </button>
        </div>
      </div>
    </header>
  );
};
