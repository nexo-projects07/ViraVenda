import React, { useState, useEffect } from 'react';
import { Client, Opportunity, OpportunityStage, LeadSource, LostReason } from '../types';
import { getTodayISODate, addDaysToDate, LEAD_SOURCE_LABELS, LOST_REASON_LABELS } from '../utils/formatters';
import { X, Briefcase, Calendar, Check, UserPlus, Compass, AlertCircle } from 'lucide-react';

interface OpportunityModalProps {
  isOpen: boolean;
  opportunityToEdit?: Opportunity | null;
  defaultClientId?: string;
  clients: Client[];
  onSave: (
    oppData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => void;
  onClose: () => void;
  onOpenQuickNewClient: () => void;
}

export const STAGE_OPTIONS: { id: OpportunityStage; label: string; color: string }[] = [
  { id: 'novo_contato', label: 'Novo contato', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'em_negociacao', label: 'Em negociação', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'orcamento_enviado', label: 'Orçamento enviado', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'ganho', label: 'Ganho (Vendido)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'perdido', label: 'Perdido', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  isOpen,
  opportunityToEdit,
  defaultClientId,
  clients,
  onSave,
  onClose,
  onOpenQuickNewClient,
}) => {
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [valueStr, setValueStr] = useState('0');
  const [stage, setStage] = useState<OpportunityStage>('novo_contato');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [lostReason, setLostReason] = useState<LostReason | ''>('');
  const [lostReasonDetails, setLostReasonDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ clientId?: string; title?: string; value?: string }>({});

  useEffect(() => {
    if (opportunityToEdit) {
      setClientId(opportunityToEdit.clientId);
      setTitle(opportunityToEdit.title);
      setDescription(opportunityToEdit.description || '');
      setValueStr(String(opportunityToEdit.value));
      setStage(opportunityToEdit.stage);
      setSource(opportunityToEdit.source || '');
      setNextFollowUpDate(opportunityToEdit.nextFollowUpDate || '');
      setLostReason(opportunityToEdit.lostReason || '');
      setLostReasonDetails(opportunityToEdit.lostReasonDetails || '');
      setNotes(opportunityToEdit.notes || '');
    } else {
      setClientId(defaultClientId || (clients.length > 0 ? clients[0].id : ''));
      setTitle('');
      setDescription('');
      setValueStr('0');
      setStage('orcamento_enviado');
      setSource('whatsapp');
      setNextFollowUpDate(addDaysToDate(2));
      setLostReason('');
      setLostReasonDetails('');
      setNotes('');
    }
    setErrors({});
  }, [opportunityToEdit, defaultClientId, isOpen, clients]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { clientId?: string; title?: string; value?: string } = {};

    if (!clientId) {
      newErrors.clientId = 'Selecione o cliente vinculado a esta oportunidade.';
    }
    if (!title.trim()) {
      newErrors.title = 'Informe o título do orçamento ou serviço.';
    }

    const numVal = parseFloat(valueStr.replace(/\./g, '').replace(',', '.'));
    if (isNaN(numVal) || numVal < 0) {
      newErrors.value = 'Informe um valor numérico válido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedValue = parseFloat(valueStr.replace(/\./g, '').replace(',', '.')) || 0;

    onSave(
      {
        clientId,
        title: title.trim(),
        description: description.trim() || undefined,
        value: parsedValue,
        stage,
        source: source || undefined,
        nextFollowUpDate: stage !== 'ganho' && stage !== 'perdido' ? nextFollowUpDate || undefined : undefined,
        completedFollowUp: stage === 'ganho' || stage === 'perdido',
        closedAt: stage === 'ganho' || stage === 'perdido' ? (opportunityToEdit?.closedAt || new Date().toISOString()) : undefined,
        lostReason: stage === 'perdido' ? (lostReason as LostReason) || 'outros' : undefined,
        lostReasonDetails: stage === 'perdido' ? lostReasonDetails.trim() || undefined : undefined,
        notes: notes.trim() || undefined,
      },
      opportunityToEdit?.id
    );
  };

  const handleQuickDate = (days: number) => {
    setNextFollowUpDate(addDaysToDate(days));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {opportunityToEdit ? 'Editar Oportunidade' : 'Nova Oportunidade / Orçamento'}
              </h3>
              <p className="text-xs text-slate-500">
                Preencha os detalhes da proposta comercial
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Cliente Vinculado *
              </label>
              <button
                type="button"
                onClick={onOpenQuickNewClient}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Cadastrar Cliente</span>
              </button>
            </div>

            {clients.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                Nenhum cliente cadastrado ainda. Clique acima para cadastrar seu primeiro cliente.
              </div>
            ) : (
              <select
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  if (errors.clientId) setErrors((prev) => ({ ...prev, clientId: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none transition ${
                  errors.clientId ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500'
                }`}
              >
                <option value="" disabled>
                  Selecione um cliente...
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''} - {c.phone}
                  </option>
                ))}
              </select>
            )}
            {errors.clientId && <p className="text-xs text-rose-600 mt-1">{errors.clientId}</p>}
          </div>

          {/* Título do Orçamento */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título da Oportunidade ou Orçamento *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Confecção de Uniformes de Inverno"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
          </div>

          {/* Valor e Etapa em 2 Colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Valor em R$ */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valor Total (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                  R$
                </span>
                <input
                  type="text"
                  value={valueStr}
                  onChange={(e) => {
                    setValueStr(e.target.value);
                    if (errors.value) setErrors((prev) => ({ ...prev, value: undefined }));
                  }}
                  placeholder="0,00"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 font-semibold focus:outline-none transition ${
                    errors.value ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>
              {errors.value && <p className="text-xs text-rose-600 mt-1">{errors.value}</p>}
            </div>

            {/* Etapa */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Etapa do Funil
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as OpportunityStage)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm text-slate-800 bg-white focus:outline-none transition"
              >
                {STAGE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Origem do Contato */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>Origem do Contato (Canal de Atração)</span>
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as LeadSource)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm text-slate-800 bg-white focus:outline-none transition"
            >
              <option value="">Não especificado</option>
              {Object.entries(LEAD_SOURCE_LABELS).map(([k, lbl]) => (
                <option key={k} value={k}>
                  {lbl}
                </option>
              ))}
            </select>
          </div>

          {/* Se a etapa for 'perdido', exibe seleção do motivo da perda */}
          {stage === 'perdido' && (
            <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Motivo da Perda</span>
              </div>
              <select
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value as LostReason)}
                className="w-full px-3 py-2 rounded-lg border border-rose-300 bg-white text-xs text-slate-800 focus:outline-none"
              >
                <option value="">Selecione o motivo...</option>
                {Object.entries(LOST_REASON_LABELS).map(([k, lbl]) => (
                  <option key={k} value={k}>
                    {lbl}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={lostReasonDetails}
                onChange={(e) => setLostReasonDetails(e.target.value)}
                placeholder="Detalhes adicionais da perda (opcional)..."
                className="w-full px-3 py-1.5 rounded-lg border border-rose-300 bg-white text-xs text-slate-800 focus:outline-none"
              />
            </div>
          )}

          {/* Data do Próximo Contato (apenas se não estiver ganho ou perdido) */}
          {stage !== 'ganho' && stage !== 'perdido' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Data do Próximo Contato (Retorno)</span>
                </label>
                {nextFollowUpDate && (
                  <button
                    type="button"
                    onClick={() => setNextFollowUpDate('')}
                    className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Limpar data
                  </button>
                )}
              </div>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm text-slate-800 focus:outline-none transition"
              />
              {/* Atalhos de data */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[11px] text-slate-400 mr-1">Atalhos:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDate(0)}
                  className="text-[11px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition cursor-pointer"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(1)}
                  className="text-[11px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition cursor-pointer"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(3)}
                  className="text-[11px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition cursor-pointer"
                >
                  +3 dias
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(7)}
                  className="text-[11px] px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition cursor-pointer"
                >
                  +1 semana
                </button>
              </div>
            </div>
          )}

          {/* Descrição e Itens */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição / Itens do Orçamento (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ex: 50 unidades com estampa silk frontal e bordado na manga."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition resize-none"
            />
          </div>

          {/* Observações da Negociação */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações internas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ex: Cliente tem objeção de preço, oferecemos 5% no Pix."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition resize-none"
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
              disabled={clients.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-emerald-600/30 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{opportunityToEdit ? 'Atualizar Oportunidade' : 'Salvar Oportunidade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
