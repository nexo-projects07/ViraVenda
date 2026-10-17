import React, { useState } from 'react';
import { Client, Opportunity, FollowUpTask, ActivityLog } from '../types';
import {
  formatBRL,
  formatDateBR,
  formatRelativeTime,
  CLIENT_SEGMENT_LABELS,
} from '../utils/formatters';
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  Building,
  Edit2,
  Trash2,
  MessageSquare,
  Plus,
  Briefcase,
  X,
  Copy,
  CalendarClock,
  Clock,
  CheckCircle2,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

interface ClientsViewProps {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  onNewClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onNewOpportunityForClient: (clientId: string) => void;
  onNewTaskForClient: (clientId: string) => void;
  onOpenMessageWithClient: (client: Client) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type SortOption = 'recent' | 'name_asc' | 'highest_value' | 'no_followup';

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  opportunities,
  tasks,
  activities,
  onNewClient,
  onEditClient,
  onDeleteClient,
  onNewOpportunityForClient,
  onNewTaskForClient,
  onOpenMessageWithClient,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);

  // Filtragem de clientes por busca e segmento
  let filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      client.name.toLowerCase().includes(term) ||
      client.phone.includes(term) ||
      (client.company && client.company.toLowerCase().includes(term)) ||
      (client.email && client.email.toLowerCase().includes(term)) ||
      (client.notes && client.notes.toLowerCase().includes(term));

    const matchesSegment =
      segmentFilter === 'all' || client.segment === segmentFilter;

    return matchesSearch && matchesSegment;
  });

  // Ordenação
  filteredClients.sort((a, b) => {
    if (sortBy === 'name_asc') {
      return a.name.localeCompare(b.name, 'pt-BR');
    }
    if (sortBy === 'highest_value') {
      const valA = opportunities
        .filter((o) => o.clientId === a.id && o.stage !== 'perdido')
        .reduce((sum, o) => sum + (o.value || 0), 0);
      const valB = opportunities
        .filter((o) => o.clientId === b.id && o.stage !== 'perdido')
        .reduce((sum, o) => sum + (o.value || 0), 0);
      return valB - valA;
    }
    if (sortBy === 'no_followup') {
      // Clientes sem retorno agendado pendente
      const hasFollowUpA = tasks.some((t) => t.clientId === a.id && t.status === 'pendente');
      const hasFollowUpB = tasks.some((t) => t.clientId === b.id && t.status === 'pendente');
      return Number(hasFollowUpA) - Number(hasFollowUpB);
    }
    // 'recent'
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCopyPhone = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    onShowToast(`Telefone ${phone} copiado!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search + Segment + Sort + Count + Add button */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-2xl">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, telefone, empresa..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtro por Segmento */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none transition"
            >
              <option value="all">Todos os segmentos</option>
              {Object.entries(CLIENT_SEGMENT_LABELS).map(([k, lbl]) => (
                <option key={k} value={k}>
                  {lbl}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none transition"
            >
              <option value="recent">Mais recentes</option>
              <option value="name_asc">Nome (A-Z)</option>
              <option value="highest_value">Maior valor em propostas</option>
              <option value="no_followup">Sem retorno agendado</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-3 flex-wrap">
          <span className="text-xs font-semibold text-slate-500">
            {filteredClients.length} de {clients.length} cliente{clients.length === 1 ? '' : 's'}
          </span>

          <button
            onClick={onNewClient}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Cliente</span>
          </button>
        </div>
      </div>

      {/* Lista de Clientes em Cards */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm || segmentFilter !== 'all'
              ? 'Nenhum cliente encontrado para estes filtros'
              : 'Nenhum cliente cadastrado ainda'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {searchTerm || segmentFilter !== 'all'
              ? 'Tente ajustar os termos de pesquisa ou o filtro de segmento.'
              : 'Cadastre seus primeiros contatos para criar orçamentos e agendar retornos comerciais.'}
          </p>
          <div className="mt-4">
            {searchTerm || segmentFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSegmentFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition cursor-pointer"
              >
                Limpar filtros
              </button>
            ) : (
              <button
                onClick={onNewClient}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs cursor-pointer"
              >
                + Cadastrar Primeiro Cliente
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const clientOpps = opportunities.filter((o) => o.clientId === client.id);
            const activeOpps = clientOpps.filter(
              (o) => o.stage !== 'ganho' && o.stage !== 'perdido'
            );
            const wonOpps = clientOpps.filter((o) => o.stage === 'ganho');
            const totalActiveValue = activeOpps.reduce((sum, o) => sum + (o.value || 0), 0);
            const totalWonValue = wonOpps.reduce((sum, o) => sum + (o.value || 0), 0);

            const pendingClientTasks = tasks.filter(
              (t) => t.clientId === client.id && t.status === 'pendente'
            );

            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  {/* Top: Name & Quick Edit/Delete */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        onClick={() => setSelectedClientForDetails(client)}
                        className="text-base font-bold text-slate-900 hover:text-emerald-700 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{client.name}</span>
                      </h4>
                      {client.company && (
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{client.company}</span>
                        </p>
                      )}
                      {client.segment && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {CLIENT_SEGMENT_LABELS[client.segment] || client.segment}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditClient(client)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Editar cliente"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteClient(client)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Excluir cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                      <button
                        onClick={(e) => handleCopyPhone(client.phone, e)}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition"
                        title="Copiar telefone"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    {client.email && (
                      <div className="flex items-center gap-2 text-slate-600 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}

                    {client.notes && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic pt-1">
                        "{client.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom: Opportunity stats + Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {clientOpps.length}{' '}
                      {clientOpps.length === 1 ? 'proposta' : 'propostas'}
                    </span>
                    {totalActiveValue > 0 ? (
                      <span className="font-semibold text-emerald-700">
                        {formatBRL(totalActiveValue)} em aberto
                      </span>
                    ) : totalWonValue > 0 ? (
                      <span className="font-semibold text-amber-700">
                        {formatBRL(totalWonValue)} fechado
                      </span>
                    ) : (
                      <span className="text-slate-400">Sem propostas ativas</span>
                    )}
                  </div>

                  {/* Status de Acompanhamento */}
                  {pendingClientTasks.length > 0 && (
                    <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{pendingClientTasks.length} retorno(s) agendado(s)</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenMessageWithClient(client)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => onNewOpportunityForClient(client.id)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-600" />
                      <span>+ Orçamento</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Drawer de Detalhes Completos do Cliente */}
      {selectedClientForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedClientForDetails.name}
                </h3>
                {selectedClientForDetails.company && (
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedClientForDetails.company}
                  </p>
                )}
                {selectedClientForDetails.segment && (
                  <span className="inline-block mt-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {CLIENT_SEGMENT_LABELS[selectedClientForDetails.segment] || selectedClientForDetails.segment}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedClientForDetails(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Informações de contato */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Telefone:</span>
                <span className="font-semibold text-slate-900">
                  {selectedClientForDetails.phone}
                </span>
              </div>
              {selectedClientForDetails.email && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">E-mail:</span>
                  <span className="font-medium text-slate-800">
                    {selectedClientForDetails.email}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cadastrado em:</span>
                <span className="font-medium text-slate-700">
                  {formatDateBR(selectedClientForDetails.createdAt)}
                </span>
              </div>
              {selectedClientForDetails.notes && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Observações:</span>
                  <p className="text-slate-700 italic">
                    {selectedClientForDetails.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Oportunidades do Cliente */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Oportunidades & Orçamentos</span>
                </span>
                <button
                  onClick={() => {
                    const id = selectedClientForDetails.id;
                    setSelectedClientForDetails(null);
                    onNewOpportunityForClient(id);
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs"
                >
                  + Nova Proposta
                </button>
              </h4>

              {(() => {
                const opps = opportunities.filter(
                  (o) => o.clientId === selectedClientForDetails.id
                );
                if (opps.length === 0) {
                  return (
                    <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl">
                      Nenhuma proposta cadastrada para este cliente.
                    </p>
                  );
                }
                return (
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {opps.map((o) => (
                      <div
                        key={o.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800 block">
                            {o.title}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Etapa: {o.stage.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="font-bold text-emerald-700">
                          {formatBRL(o.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Tarefas de Acompanhamento do Cliente */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Acompanhamentos & Tarefas</span>
                </span>
                <button
                  onClick={() => {
                    const id = selectedClientForDetails.id;
                    setSelectedClientForDetails(null);
                    onNewTaskForClient(id);
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs"
                >
                  + Novo Retorno
                </button>
              </h4>

              {(() => {
                const clientTasks = tasks.filter(
                  (t) => t.clientId === selectedClientForDetails.id
                );
                if (clientTasks.length === 0) {
                  return (
                    <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl">
                      Nenhum retorno agendado para este cliente.
                    </p>
                  );
                }
                return (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {clientTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              t.status === 'concluida' ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          />
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              {t.title}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Data: {formatDateBR(t.dueDate)} {t.dueTime ? `às ${t.dueTime}` : ''}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            t.status === 'concluida'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status === 'concluida' ? 'Feito' : 'Pendente'}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Linha do Tempo / Histórico do Cliente */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Histórico de Atividades</span>
              </h4>

              {(() => {
                const clientActs = activities.filter(
                  (a) => a.clientId === selectedClientForDetails.id
                );
                if (clientActs.length === 0) {
                  return (
                    <p className="text-xs text-slate-400 py-2 text-center bg-slate-50 rounded-xl">
                      Sem registros anteriores para este contato.
                    </p>
                  );
                }
                return (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
                    {clientActs.map((act) => (
                      <div key={act.id} className="p-2 bg-slate-50 rounded-lg flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px]">
                            {act.title}
                          </span>
                          <span className="text-[11px] text-slate-600">{act.description}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatRelativeTime(act.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Footer Ações */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  const c = selectedClientForDetails;
                  setSelectedClientForDetails(null);
                  onOpenMessageWithClient(c);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition cursor-pointer"
              >
                Abrir no WhatsApp
              </button>
              <button
                onClick={() => {
                  const c = selectedClientForDetails;
                  setSelectedClientForDetails(null);
                  onEditClient(c);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Editar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
