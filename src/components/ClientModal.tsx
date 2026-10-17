import React, { useState, useEffect } from 'react';
import { Client, ClientSegment } from '../types';
import { formatPhoneBR, isValidPhoneBR, onlyDigits, CLIENT_SEGMENT_LABELS } from '../utils/formatters';
import { X, User, Phone, Mail, Building, FileText, Check, Briefcase } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  clientToEdit?: Client | null;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  onClose: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  clientToEdit,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [segment, setSegment] = useState<ClientSegment | ''>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setPhone(formatPhoneBR(clientToEdit.phone));
      setEmail(clientToEdit.email || '');
      setCompany(clientToEdit.company || '');
      setSegment((clientToEdit.segment as ClientSegment) || '');
      setNotes(clientToEdit.notes || '');
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setCompany('');
      setSegment('');
      setNotes('');
    }
    setErrors({});
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneBR(e.target.value);
    setPhone(formatted);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'O nome do cliente é obrigatório.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Informe o nome completo do cliente.';
    }

    const digits = onlyDigits(phone);
    if (!digits) {
      newErrors.phone = 'O telefone / WhatsApp é obrigatório.';
    } else if (!isValidPhoneBR(phone)) {
      newErrors.phone = 'Informe um telefone com DDD válido (ex: 11 98765-4321).';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'E-mail em formato inválido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        name: name.trim(),
        phone: formatPhoneBR(phone),
        email: email.trim() || undefined,
        company: company.trim() || undefined,
        segment: segment || undefined,
        notes: notes.trim() || undefined,
        lastInteractionAt: clientToEdit?.lastInteractionAt || new Date().toISOString(),
      },
      clientToEdit?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {clientToEdit ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              <p className="text-xs text-slate-500">
                Campos marcados com * são obrigatórios
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
          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do Cliente *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Ex: Ana Maria Silva"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition ${
                  errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500'
                }`}
                autoFocus
              />
            </div>
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Telefone / WhatsApp (com DDD) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(11) 98765-4321"
                maxLength={15}
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition ${
                  errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500'
                }`}
              />
            </div>
            {errors.phone ? (
              <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Usado para gerar conversas diretas no WhatsApp
              </p>
            )}
          </div>

          {/* Empresa e Segmento em 2 Colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Empresa */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Empresa ou Negócio (opcional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex: Studio Bella"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Segmento */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Segmento / Tipo de Cliente
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={segment}
                  onChange={(e) => setSegment(e.target.value as ClientSegment)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm text-slate-800 bg-white focus:outline-none transition"
                >
                  <option value="">Não informado</option>
                  {Object.entries(CLIENT_SEGMENT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              E-mail (opcional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="cliente@exemplo.com.br"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition ${
                  errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações ou Preferências (opcional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Ex: Prefere atendimento no período da tarde. Tem interesse em contratos recorrentes."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition resize-none"
              />
            </div>
          </div>

          {/* Botões */}
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
              <span>{clientToEdit ? 'Atualizar Cliente' : 'Salvar Cliente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
