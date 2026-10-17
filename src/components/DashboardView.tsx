import React from 'react';
import { Client, Opportunity, FollowUpTask, ActivityLog, ActiveTab } from '../types';
import { formatBRL, getFollowUpStatus, formatRelativeTime } from '../utils/formatters';
import {
  Users,
  Briefcase,
  DollarSign,
  Trophy,
  CalendarClock,
  ArrowRight,
  MessageSquare,
  Plus,
  AlertTriangle,
  Clock,
  ChevronRight,
  TrendingUp,
  XCircle,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  onNavigate: (tab: ActiveTab) => void;
  onNewClient: () => void;
  onNewOpportunity: () => void;
  onNewTask: () => void;
  onOpenMessageWithOpp: (opp: Opportunity) => void;
  onQuickCompleteFollowUp: (oppId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clients,
  opportunities,
  tasks,
  activities,
  onNavigate,
  onNewClient,
  onNewOpportunity,
  onNewTask,
  onOpenMessageWithOpp,
  onQuickCompleteFollowUp,
}) => {
  // Cálculos comerciais baseados exclusivamente nos dados reais
  const totalClients = clients.length;

  const openOpportunities = opportunities.filter(
    (o) => o.stage !== 'ganho' && o.stage !== 'perdido'
  );
  const openCount = openOpportunities.length;
  const openValue = openOpportunities.reduce((acc, curr) => acc + (curr.value || 0), 0);

  const wonOpportunities = opportunities.filter((o) => o.stage === 'ganho');
  const wonCount = wonOpportunities.length;
  const wonValue = wonOpportunities.reduce((acc, curr) => acc + (curr.value || 0), 0);

  const lostOpportunities = opportunities.filter((o) => o.stage === 'perdido');
  const lostCount = lostOpportunities.length;
  const lostValue = lostOpportunities.reduce((acc, curr) => acc + (curr.value || 0), 0);

  // Retornos prioritários (combina follow-ups de oportunidades e tarefas)
  const clientMap = new Map<string, Client>();
  clients.forEach((c) => clientMap.set(c.id, c));

  let overdueCount = 0;
  let todayCount = 0;

  // Follow-ups das oportunidades
  const urgentFollowUps = openOpportunities
    .filter((opp) => !opp.completedFollowUp && opp.nextFollowUpDate)
    .map((opp) => {
      const status = getFollowUpStatus(opp.nextFollowUpDate, opp.completedFollowUp);
      if (status.isOverdue) overdueCount++;
      if (status.isToday) todayCount++;
      const client = clientMap.get(opp.clientId);
      return {
        id: opp.id,
        opp,
        client,
        status,
        title: opp.title,
        value: opp.value,
      };
    })
    .filter((item) => item.status.isOverdue || item.status.isToday)
    .sort((a, b) => a.status.daysDiff - b.status.daysDiff);

  // Tarefas avulsas atrasadas ou para hoje
  const pendingTasks = tasks.filter((t) => t.status === 'pendente');
  pendingTasks.forEach((t) => {
    const st = getFollowUpStatus(t.dueDate);
    if (st.isOverdue) overdueCount++;
    if (st.isToday) todayCount++;
  });

  // Funil por etapas
  const stagesSummary = [
    {
      id: 'novo_contato',
      name: 'Novo Contato',
      items: opportunities.filter((o) => o.stage === 'novo_contato'),
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'em_negociacao',
      name: 'Em Negociação',
      items: opportunities.filter((o) => o.stage === 'em_negociacao'),
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'orcamento_enviado',
      name: 'Orçamento Enviado',
      items: opportunities.filter((o) => o.stage === 'orcamento_enviado'),
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 text-purple-700',
    },
    {
      id: 'ganho',
      name: 'Ganho (Vendido)',
      items: opportunities.filter((o) => o.stage === 'ganho'),
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'perdido',
      name: 'Perdido',
      items: opportunities.filter((o) => o.stage === 'perdido'),
      color: 'bg-slate-400',
      bgColor: 'bg-slate-100 text-slate-600',
    },
  ];

  const decisionsCount = wonCount + lostCount;
  const conversionRate = decisionsCount > 0 ? Math.round((wonCount / decisionsCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 5 Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total de Clientes */}
        <div
          onClick={() => onNavigate('clientes')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Clientes
            </span>
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 block">
              {totalClients}
            </span>
            <span className="text-xs text-slate-500">contatos salvos</span>
          </div>
        </div>

        {/* Oportunidades Abertas */}
        <div
          onClick={() => onNavigate('oportunidades')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pipeline Aberto
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 block">
              {openCount}
            </span>
            <span className="text-xs text-slate-500">em negociação ativa</span>
          </div>
        </div>

        {/* Valor em Aberto (R$) */}
        <div
          onClick={() => onNavigate('oportunidades')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Valor em Aberto
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-600 block truncate" title={formatBRL(openValue)}>
              {formatBRL(openValue)}
            </span>
            <span className="text-xs text-slate-500">potencial de vendas</span>
          </div>
        </div>

        {/* Vendas Ganhas */}
        <div
          onClick={() => onNavigate('oportunidades')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Vendas Ganhas
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 block">
              {wonCount}{' '}
              <span className="text-xs font-normal text-slate-500">
                ({formatBRL(wonValue)})
              </span>
            </span>
            <span className="text-xs text-emerald-600 font-semibold">fechadas com sucesso</span>
          </div>
        </div>

        {/* Retornos Pendentes */}
        <div
          onClick={() => onNavigate('acompanhamentos')}
          className={`p-4 rounded-2xl border shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
            overdueCount > 0
              ? 'bg-rose-50/70 border-rose-200'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              overdueCount > 0 ? 'text-rose-700' : 'text-slate-500'
            }`}>
              Retornos Pendentes
            </span>
            <div
              className={`p-2 rounded-xl ${
                overdueCount > 0
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-extrabold ${
                  overdueCount > 0 ? 'text-rose-700' : 'text-slate-900'
                }`}
              >
                {overdueCount + todayCount}
              </span>
              {overdueCount > 0 && (
                <span className="text-xs font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                  {overdueCount} atrasado{overdueCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500">
              {todayCount > 0 ? `${todayCount} para hoje` : 'nenhum agendado para hoje'}
            </span>
          </div>
        </div>
      </div>

      {/* Prioridades Comerciais do Dia (Retornos Urgentes) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Próximas Prioridades Comerciais (Atrasados & Hoje)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('acompanhamentos')}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Ver agenda de acompanhamentos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {urgentFollowUps.length === 0 ? (
          <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">
              Tudo em dia por aqui!
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Nenhuma oportunidade atrasada ou retorno pendente para hoje. Cadastre novos orçamentos ou tarefas para manter seu fluxo ativo.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {urgentFollowUps.slice(0, 5).map(({ opp, client, status }) => (
              <div
                key={opp.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      status.isOverdue
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {status.isOverdue ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">
                        {client ? client.name : 'Cliente não informado'}
                      </span>
                      {client?.company && (
                        <span className="text-xs text-slate-500">
                          ({client.company})
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          status.isOverdue
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <span className="font-medium text-slate-800">{opp.title}</span> •{' '}
                      <span className="font-semibold text-emerald-700">
                        {formatBRL(opp.value)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onQuickCompleteFollowUp(opp.id)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition font-medium cursor-pointer"
                    title="Marcar retorno como feito"
                  >
                    Marcar Feito
                  </button>

                  <button
                    onClick={() => onOpenMessageWithOpp(opp)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs transition cursor-pointer"
                    title="Preparar mensagem no WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Funil + Ações Rápidas + Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição por Etapas do Funil (2 colunas) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Funil de Vendas & Etapas
                </h2>
              </div>
              <button
                onClick={() => onNavigate('oportunidades')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Kanban</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {stagesSummary.map((stage) => {
                const count = stage.items.length;
                const totalStageValue = stage.items.reduce(
                  (sum, item) => sum + (item.value || 0),
                  0
                );
                const percent =
                  opportunities.length > 0
                    ? Math.round((count / opportunities.length) * 100)
                    : 0;

                return (
                  <div key={stage.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${stage.bgColor}`}>
                          {stage.name}
                        </span>
                        <span className="text-slate-500 font-medium">
                          {count} {count === 1 ? 'proposta' : 'propostas'}
                        </span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {formatBRL(totalStageValue)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
            <span>
              Total: {opportunities.length} propostas ({wonCount} ganhas / {lostCount} perdidas)
            </span>
            <span className="font-semibold text-slate-800">
              Taxa de Conversão: {conversionRate}%
            </span>
          </div>
        </div>

        {/* Bloco de Ações Rápidas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
              Ações Comerciais
            </h2>
            <div className="space-y-2.5">
              <button
                onClick={onNewOpportunity}
                className="w-full p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 flex items-center justify-between transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Cadastrar Orçamento</span>
                    <span className="text-[11px] text-emerald-700">Registrar proposta comercial</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={onNewClient}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-slate-800 flex items-center justify-between transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Novo Cliente</span>
                    <span className="text-[11px] text-slate-500">Salvar contato com telefone e DDD</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onNewTask}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-slate-800 flex items-center justify-between transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Novo Acompanhamento</span>
                    <span className="text-[11px] text-slate-500">Agendar data e hora de retorno</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('mensagens')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-slate-800 flex items-center justify-between transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Modelos de WhatsApp</span>
                    <span className="text-[11px] text-slate-500">10 modelos prontos nos 3 tons</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('relatorios')}
              className="w-full py-2 px-3 text-xs font-semibold text-center text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Ver Relatórios Completos e CSV</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feed de Atividades Recentes do Negócio */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Histórico & Atividades Recentes
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Registro automático de ações comerciais
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Nenhuma atividade registrada ainda. As alterações em clientes e orçamentos aparecerão aqui.
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 6).map((act) => {
              const isWon = act.type === 'opportunity_won';
              const isLost = act.type === 'opportunity_lost';
              const isFollowUp = act.type === 'followup_completed' || act.type === 'followup_created';

              return (
                <div
                  key={act.id}
                  className="flex items-start justify-between gap-3 text-xs p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        isWon
                          ? 'bg-amber-100 text-amber-800'
                          : isLost
                          ? 'bg-rose-100 text-rose-700'
                          : isFollowUp
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isWon ? (
                        <Trophy className="w-3.5 h-3.5" />
                      ) : isLost ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : isFollowUp ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Activity className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {act.title}
                      </span>
                      <span className="text-slate-600">{act.description}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
