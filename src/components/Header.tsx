import React from 'react';
import { ActiveTab, UserSettings, AppMode } from '../types';
import {
  Menu,
  Plus,
  UserPlus,
  Sparkles,
  Building2,
  ArrowRightLeft,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenMobileMenu: () => void;
  onNewClient: () => void;
  onNewOpportunity: () => void;
  isDemo: boolean;
  settings: UserSettings;
  onSwitchMode?: (targetMode: AppMode) => void;
  onResetDemo?: () => void;
  onOpenOnboarding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onNewClient,
  onNewOpportunity,
  isDemo,
  settings,
  onSwitchMode,
  onResetDemo,
  onOpenOnboarding,
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
  const companyDisplayName = settings.businessName || 'Minha Empresa';
  const managerDisplayName = settings.userName
    ? `${settings.userName}${settings.userRole ? ` (${settings.userRole})` : ''}`
    : '';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      {/* Banner de Modo Demonstração */}
      {isDemo ? (
        <div className="bg-amber-700 text-amber-50 text-xs px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>
              <strong>Modo Demonstração:</strong> Você está visualizando dados fictícios de exemplo.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onResetDemo && (
              <button
                type="button"
                onClick={onResetDemo}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-md text-white font-medium transition cursor-pointer text-[11px]"
                title="Restaurar dados iniciais da demonstração"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar exemplos</span>
              </button>
            )}

            {settings.onboardingCompleted ? (
              <button
                type="button"
                onClick={() => onSwitchMode && onSwitchMode('own')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-md text-white font-bold transition cursor-pointer text-[11px] shadow-2xs"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Alternar para Meu Ambiente</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-md text-white font-bold transition cursor-pointer text-[11px] shadow-2xs"
              >
                <Building2 className="w-3 h-3" />
                <span>Configurar Minha Empresa</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-900/90 text-emerald-100 text-[11px] px-4 py-1.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              <strong>Ambiente Próprio:</strong> Seus dados reais estão salvos com segurança neste navegador.
            </span>
          </div>
          {onSwitchMode && (
            <button
              type="button"
              onClick={() => onSwitchMode('demo')}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/10 hover:bg-white/20 rounded-md text-emerald-100 font-medium transition cursor-pointer text-[11px]"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Ver Modo Demonstração</span>
            </button>
          )}
        </div>
      )}

      {/* Main Bar */}
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {current.title}
              </h1>

              {/* Company badge in header */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                <Building2 className="w-3 h-3 text-emerald-600" />
                <span className="truncate max-w-[140px] md:max-w-[200px]" title={companyDisplayName}>
                  {companyDisplayName}
                </span>
                {managerDisplayName && (
                  <span className="text-slate-400 font-normal border-l border-slate-300 pl-1.5 truncate max-w-[120px]" title={managerDisplayName}>
                    {managerDisplayName}
                  </span>
                )}
              </div>
            </div>

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
