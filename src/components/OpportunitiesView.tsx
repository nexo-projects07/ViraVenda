import React, { useState } from 'react';
import { Client, Opportunity, OpportunityStage, LeadSource } from '../types';
import {
  formatBRL,
  formatDateBR,
  getFollowUpStatus,
  LEAD_SOURCE_LABELS,
  LOST_REASON_LABELS,
} from '../utils/formatters';
import { STAGE_OPTIONS } from './OpportunityModal';
import {
  Kanban,
  List,
  Search,
  Plus,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronLeft,
  X,
  Filter,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  clients: Client[];
  onNewOpportunity: () => void;
  onEditOpportunity: (opp: Opportunity) => void;
  onDeleteOpportunity: (opp: Opportunity) => void;
  onChangeStage: (oppId: string, newStage: OpportunityStage) => void;
  onReopenOpportunity: (oppId: string) => void;
  onRequestLostReason: (opp: Opportunity) => void;
  onOpenMessageWithOpp: (opp: Opportunity) => void;
}

type OppSort = 'date_desc' | 'val_desc' | 'val_asc' | 'urgency';

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  clients,
  onNewOpportunity,
  onEditOpportunity,
  onDeleteOpportunity,
  onChangeStage,
  onReopenOpportunity,
  onRequestLostReason,
  onOpenMessageWithOpp,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<OppSort>('date_desc');

  const clientMap = new Map<string, Client>();
  clients.forEach((c) => clientMap.set(c.id, c));

  // Filtragem
  let filteredOpps = opportunities.filter((opp) => {
    const client = clientMap.get(opp.clientId);
    const clientName = client?.name?.toLowerCase() || '';
    const clientCompany = client?.company?.toLowerCase() || '';
    const title = opp.title.toLowerCase();
    const desc = (opp.description || '').toLowerCase();
    const term = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !term ||
      title.includes(term) ||
      clientName.includes(term) ||
      clientCompany.includes(term) ||
      desc.includes(term);

    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    const matchesSource = sourceFilter === 'all' || opp.source === sourceFilter;

    return matchesSearch && matchesStage && matchesSource;
  });

  // Ordenação
  filteredOpps.sort((a, b) => {
    if (sortBy === 'val_desc') return (b.value || 0) - (a.value || 0);
    if (sortBy === 'val_asc') return (a.value || 0) - (b.value || 0);
    if (sortBy === 'urgency') {
      const dateA = a.nextFollowUpDate || '9999-99-99';
      const dateB = b.nextFollowUpDate || '9999-99-99';
      return dateA.localeCompare(dateB);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalFilteredValue = filteredOpps.reduce((sum, o) => sum + (o.value || 0), 0);

  const stagesList: { id: OpportunityStage; label: string; headerColor: string; dotColor: string }[] = [
    { id: 'novo_contato', label: 'Novo Contato', headerColor: 'border-blue-400 bg-blue-50/60', dotColor: 'bg-blue-500' },
    { id: 'em_negociacao', label: 'Em Negociação', headerColor: 'border-amber-400 bg-amber-50/60', dotColor: 'bg-amber-500' },
    { id: 'orcamento_enviado', label: 'Orçamento Enviado', headerColor: 'border-purple-400 bg-purple-50/60', dotColor: 'bg-purple-500' },
    { id: 'ganho', label: 'Ganho (Fechado)', headerColor: 'border-emerald-500 bg-emerald-50/60', dotColor: 'bg-emerald-500' },
    { id: 'perdido', label: 'Perdido', headerColor: 'border-slate-300 bg-slate-100/60', dotColor: 'bg-slate-400' },
  ];

  const getNextStage = (currentStage: OpportunityStage): OpportunityStage | null => {
    const flow: OpportunityStage[] = ['novo_contato', 'em_negociacao', 'orcamento_enviado', 'ganho'];
    const idx = flow.indexOf(currentStage);
    if (idx >= 0 && idx < flow.length - 1) {
      return flow[idx + 1];
    }
    return null;
  };

  const getPrevStage = (currentStage: OpportunityStage): OpportunityStage | null => {
    const flow: OpportunityStage[] = ['novo_contato', 'em_negociacao', 'orcamento_enviado', 'ganho'];
    const idx = flow.indexOf(currentStage);
    if (idx > 0) {
      return flow[idx - 1];
    }
    return null;
  };

  const handleStageSelect = (opp: Opportunity, newStage: OpportunityStage) => {
    if (newStage === 'perdido') {
      onRequestLostReason(opp);
    } else {
      onChangeStage(opp.id, newStage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros, Ordenação e Alternância de Visualização */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Busca, Etapa, Origem e Ordenação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 flex-1">
          {/* Busca */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar orçamento..."
              className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro Etapa */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none transition"
            >
              <option value="all">Todas as etapas</option>
              {STAGE_OPTIONS.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Origem */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none transition"
            >
              <option value="all">Todas as origens</option>
              {Object.entries(LEAD_SOURCE_LABELS).map(([k, lbl]) => (
                <option key={k} value={k}>
                  {lbl}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as OppSort)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none transition"
            >
              <option value="date_desc">Mais recentes</option>
              <option value="val_desc">Maior valor (R$)</option>
              <option value="val_asc">Menor valor (R$)</option>
              <option value="urgency">Mais urgentes</option>
            </select>
          </div>
        </div>

        {/* Totais + Alternador Kanban/Lista + Botão Adicionar */}
        <div className="flex items-center justify-between xl:justify-end gap-3 flex-wrap">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block">Total filtrado</span>
            <span className="text-sm font-bold text-slate-900">
              {formatBRL(totalFilteredValue)}
            </span>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Visualização em Colunas (Kanban)"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Visualização em Tabela / Lista"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Lista</span>
            </button>
          </div>

          <button
            onClick={onNewOpportunity}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Orçamento</span>
          </button>
        </div>
      </div>

      {/* Conteúdo: Kanban vs Lista */}
      {filteredOpps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Kanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            Nenhuma oportunidade encontrada
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || stageFilter !== 'all' || sourceFilter !== 'all'
              ? 'Tente ajustar os filtros de busca, etapa ou origem.'
              : 'Cadastre sua primeira proposta para acompanhar o ciclo de vendas e retornos.'}
          </p>
          <button
            onClick={onNewOpportunity}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs cursor-pointer"
          >
            + Criar Oportunidade
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        /* Visualização KANBAN em 5 colunas */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
          {stagesList.map((stage) => {
            const oppsInStage = filteredOpps.filter((o) => o.stage === stage.id);
            const totalStageValue = oppsInStage.reduce((sum, o) => sum + (o.value || 0), 0);

            return (
              <div
                key={stage.id}
                className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col gap-3 min-w-[260px]"
              >
                {/* Header da Coluna */}
                <div className={`p-2.5 rounded-xl border ${stage.headerColor} flex flex-col gap-1`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`} />
                      <span className="text-xs font-bold text-slate-900">
                        {stage.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-white/80 text-slate-700">
                      {oppsInStage.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {formatBRL(totalStageValue)}
                  </span>
                </div>

                {/* Cards da Coluna */}
                <div className="space-y-3">
                  {oppsInStage.map((opp) => {
                    const client = clientMap.get(opp.clientId);
                    const followUp = opp.nextFollowUpDate
                      ? getFollowUpStatus(opp.nextFollowUpDate, opp.completedFollowUp)
                      : null;
                    const nextSt = getNextStage(opp.stage);
                    const prevSt = getPrevStage(opp.stage);

                    return (
                      <div
                        key={opp.id}
                        className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col gap-2.5"
                      >
                        {/* Title & Actions */}
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {opp.title}
                          </h4>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => onEditOpportunity(opp)}
                              className="text-slate-400 hover:text-slate-700 p-1 rounded transition"
                              title="Editar orçamento"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteOpportunity(opp)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                              title="Excluir proposta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Cliente e Origem */}
                        <div className="text-[11px] text-slate-600 space-y-0.5">
                          <span className="font-semibold text-slate-800 block">
                            {client ? client.name : 'Cliente removido'}
                          </span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {client?.company && (
                              <span className="text-slate-400 truncate max-w-[140px]">
                                {client.company}
                              </span>
                            )}
                            {opp.source && (
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                                {LEAD_SOURCE_LABELS[opp.source] || opp.source}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Valor em Reais */}
                        <div className="text-sm font-extrabold text-emerald-700">
                          {formatBRL(opp.value)}
                        </div>

                        {/* Motivo de Perda se estiver perdido */}
                        {opp.stage === 'perdido' && (
                          <div className="p-2 bg-rose-50 rounded-lg text-[11px] text-rose-800 border border-rose-200">
                            <span className="font-bold block">Motivo da Perda:</span>
                            <span>{opp.lostReason ? LOST_REASON_LABELS[opp.lostReason] : 'Não especificado'}</span>
                            {opp.lostReasonDetails && (
                              <p className="text-[10px] text-rose-600 italic mt-0.5">
                                "{opp.lostReasonDetails}"
                              </p>
                            )}
                          </div>
                        )}

                        {/* Data de Retorno / Follow-up (apenas se aberto) */}
                        {opp.nextFollowUpDate && opp.stage !== 'ganho' && opp.stage !== 'perdido' && (
                          <div
                            className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-lg ${
                              followUp?.isOverdue
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : followUp?.isToday
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-50 text-slate-600'
                            }`}
                          >
                            {followUp?.isOverdue ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            ) : (
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">
                              {followUp ? followUp.label : formatDateBR(opp.nextFollowUpDate)}
                            </span>
                          </div>
                        )}

                        {/* Botões de Ação do Card */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 flex-wrap">
                          <button
                            onClick={() => onOpenMessageWithOpp(opp)}
                            className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center gap-1 transition cursor-pointer"
                            title="Gerar mensagem no WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Se finalizado (ganho ou perdido), permite Reabrir */}
                          {opp.stage === 'ganho' || opp.stage === 'perdido' ? (
                            <button
                              onClick={() => onReopenOpportunity(opp.id)}
                              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition cursor-pointer"
                              title="Reabrir esta proposta no funil"
                            >
                              <RotateCcw className="w-3 h-3 text-slate-500" />
                              <span>Reabrir</span>
                            </button>
                          ) : (
                            /* Avançar / Voltar etapa */
                            <div className="flex items-center gap-1">
                              {prevSt && (
                                <button
                                  onClick={() => handleStageSelect(opp, prevSt)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                  title="Voltar etapa"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {nextSt && (
                                <button
                                  onClick={() => handleStageSelect(opp, nextSt)}
                                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                  title="Avançar etapa"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => onRequestLostReason(opp)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Marcar como Perdido"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Visualização em LISTA / TABELA */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Oportunidade / Título</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Valor (R$)</th>
                  <th className="py-3.5 px-4">Etapa</th>
                  <th className="py-3.5 px-4">Origem</th>
                  <th className="py-3.5 px-4">Próximo Retorno</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOpps.map((opp) => {
                  const client = clientMap.get(opp.clientId);
                  const followUp = opp.nextFollowUpDate
                    ? getFollowUpStatus(opp.nextFollowUpDate, opp.completedFollowUp)
                    : null;
                  const currentStageOpt = STAGE_OPTIONS.find((s) => s.id === opp.stage);

                  return (
                    <tr key={opp.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block text-sm">
                          {opp.title}
                        </span>
                        {opp.description && (
                          <span className="text-slate-500 text-[11px] line-clamp-1">
                            {opp.description}
                          </span>
                        )}
                        {opp.lostReason && (
                          <span className="text-[10px] text-rose-600 font-semibold block">
                            Motivo perda: {LOST_REASON_LABELS[opp.lostReason]}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {client ? client.name : 'Cliente removido'}
                        </span>
                        {client?.phone && (
                          <span className="text-[11px] text-slate-500">
                            {client.phone}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">
                        {formatBRL(opp.value)}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={opp.stage}
                          onChange={(e) =>
                            handleStageSelect(opp, e.target.value as OpportunityStage)
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                            currentStageOpt?.color || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {STAGE_OPTIONS.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium text-slate-600">
                          {opp.source ? LEAD_SOURCE_LABELS[opp.source] || opp.source : '-'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {opp.stage === 'ganho' ? (
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Venda ganha</span>
                          </span>
                        ) : opp.stage === 'perdido' ? (
                          <span className="text-slate-400 text-[11px]">Encerrado</span>
                        ) : opp.nextFollowUpDate ? (
                          <span
                            className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-md ${
                              followUp?.isOverdue
                                ? 'bg-rose-100 text-rose-800'
                                : followUp?.isToday
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {followUp ? followUp.label : formatDateBR(opp.nextFollowUpDate)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Não agendado</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {opp.stage === 'ganho' || opp.stage === 'perdido' ? (
                            <button
                              onClick={() => onReopenOpportunity(opp.id)}
                              className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                              title="Reabrir proposta"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenMessageWithOpp(opp)}
                              className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditOpportunity(opp)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteOpportunity(opp)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
