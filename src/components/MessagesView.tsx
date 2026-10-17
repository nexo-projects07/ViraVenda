import React, { useState, useEffect } from 'react';
import { Client, Opportunity, UserSettings, MessageTone } from '../types';
import {
  DEFAULT_TEMPLATES,
  fillTemplateVariables,
} from '../utils/messageTemplates';
import {
  formatPhoneBR,
  generateWhatsAppUrl,
  isValidPhoneBR,
} from '../utils/formatters';
import {
  MessageSquareShare,
  Copy,
  ExternalLink,
  Check,
  Sparkles,
  Phone,
  User,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  Search,
} from 'lucide-react';

interface MessagesViewProps {
  clients: Client[];
  opportunities: Opportunity[];
  settings: UserSettings;
  preselectedClientId?: string;
  preselectedOpportunityId?: string;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onLogActivity?: (title: string, desc: string, clientId?: string, oppId?: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  clients,
  opportunities,
  settings,
  preselectedClientId,
  preselectedOpportunityId,
  onShowToast,
  onLogActivity,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    DEFAULT_TEMPLATES[0].id
  );
  const [tone, setTone] = useState<MessageTone>('amigavel');
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>(
    preselectedClientId || (clients.length > 0 ? clients[0].id : '')
  );
  const [selectedOppId, setSelectedOppId] = useState<string>(
    preselectedOpportunityId || ''
  );
  const [customPhone, setCustomPhone] = useState('');
  const [editedMessage, setEditedMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Auto update when preselected props change
  useEffect(() => {
    if (preselectedClientId) {
      setSelectedClientId(preselectedClientId);
    }
    if (preselectedOpportunityId) {
      setSelectedOppId(preselectedOpportunityId);
    }
  }, [preselectedClientId, preselectedOpportunityId]);

  // Se o cliente mudou, atualiza a oportunidade padrão se houver
  useEffect(() => {
    if (selectedClientId) {
      const clientOpps = opportunities.filter((o) => o.clientId === selectedClientId);
      if (clientOpps.length > 0 && !clientOpps.some((o) => o.id === selectedOppId)) {
        setSelectedOppId(clientOpps[0].id);
      }
    }
  }, [selectedClientId, opportunities, selectedOppId]);

  const activeClient = clients.find((c) => c.id === selectedClientId);
  const activeOpp = opportunities.find((o) => o.id === selectedOppId);
  const activeTemplate =
    DEFAULT_TEMPLATES.find((t) => t.id === selectedTemplateId) || DEFAULT_TEMPLATES[0];

  // Gera o texto base e atualiza o campo editável quando o template, tom ou dados mudam
  useEffect(() => {
    const rawTemplate = activeTemplate.variants[tone] || activeTemplate.variants.amigavel;
    const text = fillTemplateVariables(
      rawTemplate,
      activeClient,
      activeOpp,
      settings
    );
    setEditedMessage(text);
  }, [selectedTemplateId, tone, selectedClientId, selectedOppId, settings]);

  const targetPhone = activeClient?.phone || customPhone;
  const isPhoneValid = isValidPhoneBR(targetPhone);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedMessage);
      setCopied(true);
      onShowToast('Mensagem copiada para a área de transferência!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('Não foi possível copiar. Selecione o texto e use Ctrl+C.', 'error');
    }
  };

  const handleOpenWhatsApp = () => {
    if (!isPhoneValid) {
      onShowToast('Informe um número de telefone com DDD válido para abrir o WhatsApp.', 'error');
      return;
    }

    const url = generateWhatsAppUrl(targetPhone, editedMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    onShowToast('WhatsApp aberto! Revise e clique em enviar no aplicativo.', 'info');

    if (onLogActivity && activeClient) {
      onLogActivity(
        'Mensagem WhatsApp Preparada',
        `Mensagem baseada no modelo "${activeTemplate.title}" gerada para ${activeClient.name}`,
        activeClient.id,
        activeOpp?.id
      );
    }
  };

  const handleResetToTemplate = () => {
    const rawTemplate = activeTemplate.variants[tone] || activeTemplate.variants.amigavel;
    const text = fillTemplateVariables(
      rawTemplate,
      activeClient,
      activeOpp,
      settings
    );
    setEditedMessage(text);
    onShowToast('Mensagem redefinida com o modelo original.', 'info');
  };

  const filteredTemplates = DEFAULT_TEMPLATES.filter((tpl) => {
    const q = templateSearch.toLowerCase().trim();
    return !q || tpl.title.toLowerCase().includes(q) || tpl.description.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Banner de Controle e Transparência */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Controle Humano & Sem Disparos Automáticos:</p>
          <p className="text-emerald-800 leading-relaxed">
            O ViraVenda <strong>nunca envia mensagens sem sua autorização expressa</strong>.
            Ao clicar no botão verde, o WhatsApp Web ou aplicativo oficial abrirá em nova aba com o texto digitado
            para você ler, revisar qualquer detalhe e apertar o botão de envio manualmente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Lista de 10 Modelos Comerciais (5 colunas) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Modelos Comerciais ({filteredTemplates.length})</span>
              </h3>
            </div>

            {/* Busca de Modelo */}
            <div className="relative mt-3 mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="Buscar modelo comercial..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Lista com scroll suave */}
            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
              {filteredTemplates.map((tpl) => {
                const isSelected = tpl.id === selectedTemplateId;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-emerald-900' : 'text-slate-800'
                        }`}
                      >
                        {tpl.title}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 leading-snug">
                      {tpl.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Personalização, Tom & Editor (7 colunas) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Seletor de Cliente, Oportunidade e Tom */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Personalização da Mensagem
              </h3>

              {/* Seletor de Tom */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setTone('amigavel')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    tone === 'amigavel'
                      ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Amigável
                </button>
                <button
                  type="button"
                  onClick={() => setTone('direto')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    tone === 'direto'
                      ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Direto
                </button>
                <button
                  type="button"
                  onClick={() => setTone('formal')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    tone === 'formal'
                      ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Formal
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cliente */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cliente</span>
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none transition"
                >
                  <option value="">Nenhum / Informar manualmente</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Oportunidade */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Oportunidade Vinculada</span>
                </label>
                <select
                  value={selectedOppId}
                  onChange={(e) => setSelectedOppId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none transition"
                >
                  <option value="">Geral / Sem proposta específica</option>
                  {opportunities
                    .filter((o) => !selectedClientId || o.clientId === selectedClientId)
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Telefone de Destino */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Telefone de Envio (WhatsApp com DDD)</span>
              </label>

              {activeClient ? (
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
                  <span className="font-semibold">{activeClient.name}:</span>
                  <span className="font-mono text-emerald-800 font-bold">
                    {activeClient.phone}
                  </span>
                </div>
              ) : (
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(formatPhoneBR(e.target.value))}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm text-slate-800 focus:outline-none transition"
                />
              )}
            </div>
          </div>

          {/* Editor de Texto da Mensagem */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquareShare className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Mensagem Preparada ({tone})
                </h3>
              </div>
              <button
                type="button"
                onClick={handleResetToTemplate}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition cursor-pointer"
                title="Restaurar texto original deste modelo"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restaurar modelo</span>
              </button>
            </div>

            <div>
              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                rows={9}
                className="w-full p-4 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition resize-y"
                placeholder="Escreva ou edite sua mensagem aqui..."
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Você pode personalizar livremente o texto acima antes de copiar ou abrir no WhatsApp.
              </p>
            </div>

            {/* Ações: Copiar e Abrir no WhatsApp */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
