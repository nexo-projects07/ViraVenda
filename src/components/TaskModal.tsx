import React, { useState, useEffect } from 'react';
import { Client, Opportunity, FollowUpTask } from '../types';
import { getTodayISODate, addDaysToDate } from '../utils/formatters';
import { X, CalendarClock, Check, Calendar, Clock, User, Briefcase } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  taskToEdit?: FollowUpTask | null;
  clients: Client[];
  opportunities: Opportunity[];
  defaultClientId?: string;
  defaultOpportunityId?: string;
  onSave: (
    taskData: Omit<FollowUpTask, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => void;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  taskToEdit,
  clients,
  opportunities,
  defaultClientId,
  defaultOpportunityId,
  onSave,
  onClose,
}) => {
  const [clientId, setClientId] = useState('');
  const [opportunityId, setOpportunityId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayISODate());
  const [dueTime, setDueTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ clientId?: string; title?: string; dueDate?: string }>({});

  useEffect(() => {
    if (taskToEdit) {
      setClientId(taskToEdit.clientId);
      setOpportunityId(taskToEdit.opportunityId || '');
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate);
      setDueTime(taskToEdit.dueTime || '');
      setNotes(taskToEdit.notes || '');
    } else {
      setClientId(defaultClientId || (clients.length > 0 ? clients[0].id : ''));
      setOpportunityId(defaultOpportunityId || '');
      setTitle('');
      setDescription('');
      setDueDate(getTodayISODate());
      setDueTime('');
      setNotes('');
    }
    setErrors({});
  }, [taskToEdit, defaultClientId, defaultOpportunityId, isOpen, clients]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: { clientId?: string; title?: string; dueDate?: string } = {};
    if (!clientId) errs.clientId = 'Selecione o cliente deste retorno.';
    if (!title.trim()) errs.title = 'Informe o que precisa ser feito.';
    if (!dueDate) errs.dueDate = 'Informe a data prevista.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        clientId,
        opportunityId: opportunityId || undefined,
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        dueTime: dueTime || undefined,
        status: taskToEdit?.status || 'pendente',
        completedAt: taskToEdit?.completedAt,
        notes: notes.trim() || undefined,
      },
      taskToEdit?.id
    );
  };

  const handleQuickDate = (days: number) => {
    setDueDate(addDaysToDate(days));
  };

  const clientOpps = opportunities.filter((o) => !clientId || o.clientId === clientId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {taskToEdit ? 'Editar Acompanhamento' : 'Novo Acompanhamento / Retorno'}
              </h3>
              <p className="text-xs text-slate-500">
                Organize lembretes para nunca esquecer de responder ou cobrar um cliente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Cliente Vinculado *</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setOpportunityId(''); // Limpa opp vinculada se trocar de cliente
                if (errors.clientId) setErrors((prev) => ({ ...prev, clientId: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none transition ${
                errors.clientId ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500'
              }`}
            >
              <option value="" disabled>Selecione um cliente...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ''}
                </option>
              ))}
            </select>
            {errors.clientId && <p className="text-xs text-rose-600 mt-1">{errors.clientId}</p>}
          </div>

          {/* Oportunidade Vinculada (opcional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Oportunidade / Orçamento (opcional)</span>
            </label>
            <select
              value={opportunityId}
              onChange={(e) => setOpportunityId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm text-slate-800 bg-white focus:outline-none transition"
            >
              <option value="">Nenhum / Tarefa geral de contato</option>
              {clientOpps.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
          </div>

          {/* Título da Tarefa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              O que você precisa fazer? *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Mandar WhatsApp cobrando retorno sobre o orçamento"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Data do Retorno *</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
                }}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                  errors.dueDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500'
                }`}
              />
              {/* Atalhos rápidos */}
              <div className="flex items-center gap-1 mt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDate(0)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(1)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(3)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  +3 dias
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(7)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  +1 sem
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Horário Previsto (opcional)</span>
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm text-slate-800 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detalhes ou Contexto (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ex: Lembrar de reforçar que o desconto do Pix é válido até sexta-feira."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm text-slate-800 focus:outline-none transition resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{taskToEdit ? 'Atualizar Acompanhamento' : 'Salvar Acompanhamento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
