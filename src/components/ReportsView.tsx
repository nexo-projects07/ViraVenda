import React, { useState } from 'react';
import { Client, Opportunity, FollowUpTask } from '../types';
import {
  formatBRL,
  LEAD_SOURCE_LABELS,
  LOST_REASON_LABELS,
} from '../utils/formatters';
import { exportClientsCSV, exportOpportunitiesCSV } from '../utils/storage';
import {
  BarChart3,
  TrendingUp,
  Award,
  DollarSign,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  PieChart,
} from 'lucide-react';

interface ReportsViewProps {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: FollowUpTask[];
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type PeriodFilter = 'all' | 'month' | '30days' | '7days';

export const ReportsView: React.FC<ReportsViewProps> = ({
  clients,
  opportunities,
  tasks,
  onShowToast,
}) => {
  const [period, setPeriod] = useState<PeriodFilter>('all');

  // Filtro de data
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const filteredOpps = opportunities.filter((o) => {
    if (period === 'all') return true;
    const oppDate = new Date(o.createdAt);
    if (period === 'month') return oppDate >= startOfMonth;
    if (period === '30days') return oppDate >= thirtyDaysAgo;
    if (period === '7days') return oppDate >= sevenDaysAgo;
    return true;
  });

  // Métricas calculadas
  const totalCount = filteredOpps.length;
  const openOpps = filteredOpps.filter((o) => o.stage !== 'ganho' && o.stage !== 'perdido');
  const openValue = openOpps.reduce((sum, o) => sum + (o.value || 0), 0);

  const wonOpps = filteredOpps.filter((o) => o.stage === 'ganho');
  const wonCount = wonOpps.length;
  const wonValue = wonOpps.reduce((sum, o) => sum + (o.value || 0), 0);

  const lostOpps = filteredOpps.filter((o) => o.stage === 'perdido');
  const lostCount = lostOpps.length;
  const lostValue = lostOpps.reduce((sum, o) => sum + (o.value || 0), 0);

  const completedDecisions = wonCount + lostCount;
  const conversionRate =
    completedDecisions > 0 ? Math.round((wonCount / completedDecisions) * 100) : 0;

  const averageTicket = wonCount > 0 ? wonValue / wonCount : 0;

  // Motivos de perda
  const lostReasonCounts: Record<string, number> = {};
  lostOpps.forEach((o) => {
    const r = o.lostReason || 'outros';
    lostReasonCounts[r] = (lostReasonCounts[r] || 0) + 1;
  });

  // Origem dos leads
  const sourceCounts: Record<string, { count: number; wonCount: number; wonValue: number }> = {};
  filteredOpps.forEach((o) => {
    const src = o.source || 'outros';
    if (!sourceCounts[src]) {
      sourceCounts[src] = { count: 0, wonCount: 0, wonValue: 0 };
    }
    sourceCounts[src].count++;
    if (o.stage === 'ganho') {
      sourceCounts[src].wonCount++;
      sourceCounts[src].wonValue += o.value || 0;
    }
  });

  // Tarefas concluídas
  const completedTasks = tasks.filter((t) => t.status === 'concluida').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pendente').length;

  const handleExportClients = () => {
    exportClientsCSV(clients, opportunities);
    onShowToast('Relatório de Clientes (CSV) baixado com sucesso!', 'success');
  };

  const handleExportOpps = () => {
    exportOpportunitiesCSV(opportunities, clients);
    onShowToast('Relatório de Oportunidades (CSV) baixado com sucesso!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header com Filtros de Período e Botões de Exportação CSV */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-700">Período de análise:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                period === 'all' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todo o Histórico
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                period === 'month' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setPeriod('30days')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                period === '30days' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Últimos 30 Dias
            </button>
            <button
              onClick={() => setPeriod('7days')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                period === '7days' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Últimos 7 Dias
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportClients}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
            title="Baixar lista completa de clientes em formato CSV (Excel)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar Clientes CSV</span>
          </button>
          <button
            onClick={handleExportOpps}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
            title="Baixar lista de propostas comerciais em CSV (Excel)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar Oportunidades CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Cards Principais de Indicadores Comerciais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Faturado / Vendido */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Faturado
            </span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-600 block">
              {formatBRL(wonValue)}
            </span>
            <span className="text-xs text-slate-500">
              {wonCount} venda{wonCount === 1 ? '' : 's'} fechada{wonCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ticket Médio Ganho
            </span>
            <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 block">
              {formatBRL(averageTicket)}
            </span>
            <span className="text-xs text-slate-500">por negócio fechado</span>
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <span>Taxa de Conversão</span>
              <span title="Fórmula: Ganhas / (Ganhas + Perdidas)">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </span>
            </span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 block">
              {conversionRate}%
            </span>
            <span className="text-xs text-slate-500">
              {completedDecisions > 0
                ? `${wonCount} de ${completedDecisions} decisões concluídas`
                : 'Sem propostas finalizadas'}
            </span>
          </div>
        </div>

        {/* Em Aberto vs Perdido */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Em Aberto (Pipeline)
            </span>
            <div className="p-2 bg-purple-100 text-purple-800 rounded-xl">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-purple-700 block truncate">
              {formatBRL(openValue)}
            </span>
            <span className="text-xs text-slate-500">
              {openOpps.length} oportunidade{openOpps.length === 1 ? '' : 's'} ativas
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Motivos de Perda e Desempenho por Origem do Lead */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Motivos de Perda */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Análise de Motivos de Perda
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {lostCount} {lostCount === 1 ? 'perda' : 'perdas'} ({formatBRL(lostValue)})
            </span>
          </div>

          {lostCount === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
              Nenhuma oportunidade registrada como perdida neste período.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(LOST_REASON_LABELS).map(([key, label]) => {
                const count = lostReasonCounts[key] || 0;
                const pct = lostCount > 0 ? Math.round((count / lostCount) * 100) : 0;
                if (count === 0) return null;

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{label}</span>
                      <span className="text-slate-500">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Desempenho por Canal de Atração (Origem) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Origem dos Contatos & Vendas
              </h3>
            </div>
            <span className="text-xs text-slate-500">Onde seus clientes chegam</span>
          </div>

          {filteredOpps.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
              Nenhuma oportunidade cadastrada no período.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(LEAD_SOURCE_LABELS).map(([key, label]) => {
                const item = sourceCounts[key];
                if (!item || item.count === 0) return null;
                const conversion = item.count > 0 ? Math.round((item.wonCount / item.count) * 100) : 0;

                return (
                  <div
                    key={key}
                    className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{label}</span>
                      <span className="text-[11px] text-slate-500">
                        {item.count} propostas • {item.wonCount} ganhas ({conversion}% conversão)
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700">
                      {formatBRL(item.wonValue)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bloco de Atividades de Acompanhamento */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Esforço Comercial & Tarefas de Retorno</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 block">Tarefas Concluídas</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-1 block">
              {completedTasks}
            </span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 block">Tarefas Pendentes</span>
            <span className="text-xl font-extrabold text-amber-700 mt-1 block">
              {pendingTasks}
            </span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 block">Total de Clientes no Banco</span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">
              {clients.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
