import React, { useState } from 'react';
import { Client, Opportunity, FollowUpTask, OpportunityStage } from '../types';
import { formatBRL, formatDateBR, getFollowUpStatus, addDaysToDate } from '../utils/formatters';
import { STAGE_OPTIONS } from './OpportunityModal';
import {
  CalendarClock,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  MessageSquare,
  ChevronDown,
  Building,
  User,
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  RotateCcw,
} from 'lucide-react';

interface FollowUpsViewProps {
  tasks: FollowUpTask[];
  opportunities: Opportunity[];
  clients: Client[];
  onNewTask: () => void;
  onEditTask: (task: FollowUpTask) => void;
  onDeleteTask: (task: FollowUpTask) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onRescheduleTask: (taskId: string, newDate: string) => void;
  onOpenMessageWithOpp: (opp: Opportunity) => void;
  onOpenMessageWithClient: (client: Client) => void;
}

type TabCategory = 'atrasados' | 'hoje' | 'futuros' | 'concluidos' | 'todos';

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  tasks,
  opportunities,
  clients,
  onNewTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
  onRescheduleTask,
  onOpenMessageWithOpp,
  onOpenMessageWithClient,
}) => {
  const [activeTab, setActiveTab] = useState<TabCategory>('atrasados');
  const [selectedTaskForReschedule, setSelectedTaskForReschedule] = useState<string | null>(null);

  const clientMap = new Map<string, Client>();
  clients.forEach((c) => clientMap.set(c.id, c));

  const oppMap = new Map<string, Opportunity>();
  opportunities.forEach((o) => oppMap.set(o.id, o));

  const items = tasks.map((t) => {
    const client = clientMap.get(t.clientId);
    const opp = t.opportunityId ? oppMap.get(t.opportunityId) : undefined;
    const isCompleted = t.status === 'concluida';
    const status = getFollowUpStatus(t.dueDate, isCompleted);
    return {
      task: t,
      client,
      opp,
      status,
      isCompleted,
    };
  });

  const atrasados = items.filter((item) => !item.isCompleted && item.status.isOverdue);
  const hoje = items.filter((item) => !item.isCompleted && item.status.isToday);
  const futuros = items.filter((item) => !item.isCompleted && !item.status.isOverdue && !item.status.isToday);
  const concluidos = items.filter((item) => item.isCompleted);

  const displayedItems =
    activeTab === 'atrasados'
      ? atrasados
      : activeTab === 'hoje'
      ? hoje
      : activeTab === 'futuros'
      ? futuros
      : activeTab === 'concluidos'
      ? concluidos
      : items;

  const handleQuickReschedule = (taskId: string, days: number) => {
    const newDate = addDaysToDate(days);
    onRescheduleTask(taskId, newDate);
    setSelectedTaskForReschedule(null);
  };

  return (
    <div className="space-y-6">
      {/* Resumo e Abas de Navegação */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Abas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('atrasados')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'atrasados'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Atrasados</span>
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-rose-200/80 text-rose-900 font-bold">
              {atrasados.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hoje')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'hoje'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Para Hoje</span>
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-200/80 text-amber-900 font-bold">
              {hoje.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('futuros')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'futuros'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Próximos Dias</span>
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-emerald-200/80 text-emerald-900 font-bold">
              {futuros.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('concluidos')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'concluidos'
                ? 'bg-slate-100 text-slate-800 border border-slate-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-slate-500" />
            <span>Concluídos</span>
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-200 text-slate-700 font-bold">
              {concluidos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('todos')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'todos'
                ? 'bg-slate-200 text-slate-900'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Todos ({items.length})
          </button>
        </div>

        <button
          onClick={onNewTask}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Retorno</span>
        </button>
      </div>

      {/* Lista de Acompanhamentos */}
      {displayedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <CalendarClock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            Nenhum acompanhamento nesta categoria
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'atrasados'
              ? 'Tudo limpo! Não há retornos atrasados no momento.'
              : activeTab === 'hoje'
              ? 'Nenhum retorno agendado para o dia de hoje.'
              : 'Nenhum acompanhamento cadastrado nesta lista.'}
          </p>
          <button
            onClick={onNewTask}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer"
          >
            + Agendar Acompanhamento
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedItems.map(({ task, client, opp, status, isCompleted }) => {
            const isRescheduleOpen = selectedTaskForReschedule === task.id;

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  status.isOverdue && !isCompleted
                    ? 'border-rose-200/90 bg-rose-50/20'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Info Esquerda */}
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`p-2 rounded-xl shrink-0 mt-0.5 transition cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : status.isOverdue
                        ? 'bg-rose-100 text-rose-700 hover:bg-emerald-100 hover:text-emerald-700'
                        : status.isToday
                        ? 'bg-amber-100 text-amber-800 hover:bg-emerald-100 hover:text-emerald-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                    }`}
                    title={isCompleted ? 'Reabrir tarefa' : 'Marcar como concluída'}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </span>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-slate-200 text-slate-700'
                            : status.isOverdue
                            ? 'bg-rose-100 text-rose-800'
                            : status.isToday
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {status.label} {task.dueTime ? `às ${task.dueTime}` : ''}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client ? client.name : 'Cliente não informado'}</span>
                      </span>

                      {client?.company && (
                        <span className="text-slate-400">({client.company})</span>
                      )}

                      {opp && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-slate-700 flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-slate-400" />
                            <span>{opp.title} ({formatBRL(opp.value)})</span>
                          </span>
                        </>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-slate-500 italic pt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ações Direita */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* WhatsApp */}
                  {opp ? (
                    <button
                      onClick={() => onOpenMessageWithOpp(opp)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  ) : client ? (
                    <button
                      onClick={() => onOpenMessageWithClient(client)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  ) : null}

                  {/* Marcar Concluída / Reabrir */}
                  <button
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                  >
                    {isCompleted ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reabrir</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Concluir</span>
                      </>
                    )}
                  </button>

                  {/* Reagendar */}
                  {!isCompleted && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setSelectedTaskForReschedule(
                            isRescheduleOpen ? null : task.id
                          )
                        }
                        className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Adiar</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {isRescheduleOpen && (
                        <div className="absolute right-0 top-full mt-1.5 z-30 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 animate-in fade-in text-xs">
                          <button
                            onClick={() => handleQuickReschedule(task.id, 0)}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                          >
                            Para Hoje
                          </button>
                          <button
                            onClick={() => handleQuickReschedule(task.id, 1)}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                          >
                            Amanhã (+1 dia)
                          </button>
                          <button
                            onClick={() => handleQuickReschedule(task.id, 3)}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                          >
                            Em 3 dias
                          </button>
                          <button
                            onClick={() => handleQuickReschedule(task.id, 7)}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                          >
                            Em 1 semana
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Editar / Excluir */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                      title="Editar acompanhamento"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Excluir acompanhamento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
