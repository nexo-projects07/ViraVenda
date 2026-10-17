import React, { useState } from 'react';
import { Opportunity, LostReason } from '../types';
import { LOST_REASON_LABELS } from '../utils/formatters';
import { X, AlertCircle, Check } from 'lucide-react';

interface LostReasonModalProps {
  isOpen: boolean;
  opportunity: Opportunity | null;
  onConfirm: (reason: LostReason, details?: string) => void;
  onCancel: () => void;
}

export const LostReasonModal: React.FC<LostReasonModalProps> = ({
  isOpen,
  opportunity,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState<LostReason>('preco_alto');
  const [details, setDetails] = useState('');

  if (!isOpen || !opportunity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason, details.trim() || undefined);
    setDetails('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Registrar Motivo da Perda
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">
                {opportunity.title}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Entender o motivo de oportunidades perdidas é fundamental para descobrir onde seu negócio pode melhorar a taxa de conversão.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Principal motivo:
            </label>
            <div className="space-y-2">
              {Object.entries(LOST_REASON_LABELS).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${
                    reason === key
                      ? 'border-rose-400 bg-rose-50/60 text-rose-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="lostReason"
                    value={key}
                    checked={reason === key}
                    onChange={() => setReason(key as LostReason)}
                    className="accent-rose-600"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações adicionais (opcional):
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={2}
              placeholder="Ex: O cliente achou o prazo de 15 dias longo pois precisava para esta sexta-feira."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar Perda</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
