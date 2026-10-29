import React, { useState, useRef } from 'react';
import {
  Client,
  Opportunity,
  FollowUpTask,
  ActivityLog,
  UserSettings,
  AppMode,
  CompanySize,
  ClientSegment,
} from '../types';
import {
  exportBackupJSON,
  validateAndPreviewJSON,
  exportClientsCSV,
  exportOpportunitiesCSV,
} from '../utils/storage';
import {
  formatPhoneBR,
  isValidEmail,
  CLIENT_SEGMENT_LABELS,
  COMPANY_SIZE_LABELS,
} from '../utils/formatters';
import {
  Settings2,
  HardDrive,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Check,
  Shield,
  Sparkles,
  User,
  Building,
  Phone,
  Mail,
  FileSpreadsheet,
  AlertTriangle,
  X,
  Briefcase,
  Users2,
  ArrowRightLeft,
  Building2,
} from 'lucide-react';

interface SettingsBackupViewProps {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  settings: UserSettings;
  isDemo: boolean;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onClearDemoData: () => void;
  onReloadDemoData: () => void;
  onResetAllData: () => void;
  onSwitchMode?: (targetMode: AppMode) => void;
  onImportData: (data: {
    clients: Client[];
    opportunities: Opportunity[];
    tasks: FollowUpTask[];
    activities: ActivityLog[];
    settings: UserSettings;
  }) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const SettingsBackupView: React.FC<SettingsBackupViewProps> = ({
  clients,
  opportunities,
  tasks,
  activities,
  settings,
  isDemo,
  onUpdateSettings,
  onClearDemoData,
  onReloadDemoData,
  onResetAllData,
  onSwitchMode,
  onImportData,
  onShowToast,
}) => {
  const [userName, setUserName] = useState(settings.userName || '');
  const [userRole, setUserRole] = useState(settings.userRole || '');
  const [businessName, setBusinessName] = useState(settings.businessName || '');
  const [businessPhone, setBusinessPhone] = useState(settings.businessPhone || '');
  const [businessEmail, setBusinessEmail] = useState(settings.businessEmail || '');
  const [businessSegment, setBusinessSegment] = useState<string>(settings.businessSegment || 'servicos');
  const [companySize, setCompanySize] = useState<CompanySize>(settings.companySize || 'somente_eu');
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Modal de pré-visualização de importação
  const [importPreview, setImportPreview] = useState<{
    isOpen: boolean;
    preview?: {
      clientsCount: number;
      opportunitiesCount: number;
      tasksCount: number;
      activitiesCount: number;
      businessName?: string;
    };
    data?: {
      clients: Client[];
      opportunities: Opportunity[];
      tasks: FollowUpTask[];
      activities: ActivityLog[];
      settings: UserSettings;
    };
  }>({ isOpen: false });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (businessEmail.trim() && !isValidEmail(businessEmail.trim())) {
      setEmailError('Formato de e-mail inválido. Exemplo: contato@suaempresa.com.br');
      return;
    }
    setEmailError('');

    onUpdateSettings({
      ...settings,
      userName: userName.trim(),
      userRole: userRole.trim() || undefined,
      businessName: businessName.trim(),
      businessPhone: businessPhone.trim(),
      businessEmail: businessEmail.trim() || undefined,
      businessSegment,
      companySize,
    });

    setSavedSettingsSuccess(true);
    onShowToast('Dados comerciais da empresa atualizados com sucesso!', 'success');
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    exportBackupJSON(clients, opportunities, tasks, activities, settings);
    onShowToast('Arquivo de backup completo (JSON) baixado com sucesso!', 'success');
  };

  const handleExportClients = () => {
    exportClientsCSV(clients, opportunities);
    onShowToast('Arquivo de clientes (CSV) baixado com sucesso!', 'success');
  };

  const handleExportOpps = () => {
    exportOpportunitiesCSV(opportunities, clients);
    onShowToast('Arquivo de oportunidades (CSV) baixado com sucesso!', 'success');
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = validateAndPreviewJSON(text);

      if (res.success && res.data && res.preview) {
        setImportPreview({
          isOpen: true,
          preview: res.preview,
          data: res.data,
        });
      } else {
        onShowToast(res.message || 'Arquivo de backup inválido.', 'error');
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (importPreview.data) {
      onImportData(importPreview.data);
      setImportPreview({ isOpen: false });
      onShowToast(
        `Importação concluída: ${importPreview.data.clients.length} clientes e ${importPreview.data.opportunities.length} orçamentos restaurados!`,
        'success'
      );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Ambiente Ativo & Alternância */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Ambiente de Trabalho
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Separação completa entre sua empresa e demonstração
          </span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ambiente Atual:
              </span>
              {isDemo ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Modo Demonstração (Dados Fictícios)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Building2 className="w-3 h-3 text-emerald-600" />
                  <span>Ambiente Próprio ({settings.businessName || 'Minha Empresa'})</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600">
              {isDemo
                ? 'Você está explorando dados de exemplo. Suas alterações aqui não afetam sua empresa real.'
                : 'Você está no ambiente real da sua empresa. Todos os clientes e orçamentos cadastrados são seus.'}
            </p>
          </div>

          {onSwitchMode && (
            <button
              type="button"
              onClick={() => onSwitchMode(isDemo ? 'own' : 'demo')}
              className={`shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer ${
                isDemo
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{isDemo ? 'Ir para Meu Ambiente' : 'Alternar para Demonstração'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Dados Comerciais da Empresa */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Settings2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Dados do Seu Negócio
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Personaliza mensagens no WhatsApp e cabeçalhos
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Seu Nome */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Nome completo do responsável <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ex: Mariana Silva"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-sm text-slate-800 focus:outline-none transition"
              />
            </div>

            {/* Cargo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cargo / Função</span>
                </span>
                <span className="text-[11px] text-slate-400">Opcional</span>
              </label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="Ex: Proprietária, Diretor Comercial"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-sm text-slate-800 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome da Empresa */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Nome da Sua Empresa / Negócio <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Silva Móveis Planejados"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-sm text-slate-800 focus:outline-none transition"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Telefone com DDD / WhatsApp <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(formatPhoneBR(e.target.value))}
                placeholder="(11) 98765-4321"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-sm text-slate-800 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* E-mail */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>E-mail profissional</span>
                </span>
                <span className="text-[11px] text-slate-400">Opcional</span>
              </label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => {
                  setBusinessEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="contato@empresa.com.br"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                  emailError ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                }`}
              />
              {emailError && (
                <span className="text-[11px] text-rose-600 mt-1 block">{emailError}</span>
              )}
            </div>

            {/* Segmento */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Segmento de Atuação</span>
              </label>
              <select
                value={businessSegment}
                onChange={(e) => setBusinessSegment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-sm text-slate-800 bg-white focus:outline-none transition cursor-pointer"
              >
                <option value="servicos">Prestação de Serviços</option>
                <option value="comercio">Comércio / Varejo</option>
                <option value="industria">Indústria / Fabricação</option>
                <option value="autonomo">Profissional Autônomo</option>
                <option value="outro">Outro segmento</option>
              </select>
            </div>

            {/* Tamanho da Empresa */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Porte da Empresa</span>
              </label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value as CompanySize)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-sm text-slate-800 bg-white focus:outline-none transition cursor-pointer"
              >
                <option value="somente_eu">Somente eu (Autônomo / MEI)</option>
                <option value="2_10">2 a 10 funcionários (Microempresa)</option>
                <option value="11_50">11 a 50 funcionários (Pequena empresa)</option>
                <option value="mais_50">Mais de 50 funcionários</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Dados Comerciais</span>
            </button>
            {savedSettingsSuccess && (
              <span className="text-xs text-emerald-700 font-semibold">
                Salvo com sucesso!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Armazenamento Local & Privacidade */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
            <HardDrive className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Armazenamento Local & Privacidade dos Dados
          </h2>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Seus dados ficam 100% neste navegador (localStorage)</span>
          </div>
          <p>
            O ViraVenda não envia seus clientes nem seus orçamentos para servidores remotos de terceiros.
            Tudo é gravado de forma estritamente local e confidencial no seu computador ou celular.
          </p>
          <p className="text-slate-500 text-[11px]">
            <strong>Atenção:</strong> Se você limpar o cache ou histórico do navegador, os dados podem ser perdidos.
            Por esse motivo, utilize a opção de <strong>Exportar Backup Completo</strong> abaixo regularmente para guardar uma cópia em segurança.
          </p>
        </div>

        {/* Estatísticas de Armazenamento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Clientes Salvos</span>
            <span className="text-lg font-bold text-slate-900">{clients.length}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Oportunidades</span>
            <span className="text-lg font-bold text-slate-900">{opportunities.length}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Tarefas de Retorno</span>
            <span className="text-lg font-bold text-slate-900">{tasks.length}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Atividades Registradas</span>
            <span className="text-lg font-bold text-slate-900">{activities.length}</span>
          </div>
        </div>
      </div>

      {/* Backup e Exportação */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            Backup, Restauração & Planilhas (CSV)
          </h2>
          <span className="text-xs text-slate-500">JSON e CSV Excel</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Exportar JSON */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Download className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Backup Completo (JSON)
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Salva todos os clientes, orçamentos, tarefas de retorno e histórico em um arquivo único.
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Backup Completo (.json)</span>
            </button>
          </div>

          {/* Importar JSON com Prévia */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Upload className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Restaurar Backup (JSON)
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Carrega um arquivo de backup previamente exportado, com visualização prévia antes de aplicar.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelected}
                className="hidden"
                id="import-backup-file"
              />
              <label
                htmlFor="import-backup-file"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-2xs transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Selecionar Arquivo de Backup</span>
              </label>
            </div>
          </div>
        </div>

        {/* Exportações CSV */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar tabelas para abrir no Microsoft Excel ou Google Planilhas:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportClients}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              Exportar Clientes (.csv)
            </button>
            <button
              onClick={handleExportOpps}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              Exportar Oportunidades (.csv)
            </button>
          </div>
        </div>
      </div>

      {/* Demonstração & Zerar Dados */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
          Gerenciamento de Dados & Demonstração
        </h2>

        <div className="space-y-3">
          {/* Se estiver no modo demo */}
          {isDemo ? (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Você está utilizando os dados demonstrativos do sistema.</span>
              </div>
              <button
                onClick={onReloadDemoData}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition cursor-pointer"
              >
                Restaurar Exemplos Padrão
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Restaurar Exemplos da Demonstração
                </span>
                <span className="text-[11px] text-slate-500">
                  Restaura o conjunto fictício da demonstração (não apaga os dados da sua empresa).
                </span>
              </div>
              <button
                onClick={onReloadDemoData}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Resetar Demonstração</span>
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div>
              <span className="text-xs font-semibold text-rose-700 block">
                Zerar Dados da Base Ativa
              </span>
              <span className="text-[11px] text-slate-500">
                Remove permanentemente clientes, orçamentos e tarefas salvos neste navegador para a base ativa.
              </span>
            </div>
            <button
              onClick={onResetAllData}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Zerar Dados</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Pré-visualização da Importação */}
      {importPreview.isOpen && importPreview.preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Confirmar Restauração de Backup
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pré-visualização do conteúdo do arquivo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setImportPreview({ isOpen: false })}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Clientes no arquivo:</span>
                <span className="font-bold text-slate-900">
                  {importPreview.preview.clientsCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Oportunidades / Orçamentos:</span>
                <span className="font-bold text-slate-900">
                  {importPreview.preview.opportunitiesCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tarefas de retorno:</span>
                <span className="font-bold text-slate-900">
                  {importPreview.preview.tasksCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Negócio registrado:</span>
                <span className="font-semibold text-slate-900">
                  {importPreview.preview.businessName || 'Não especificado'}
                </span>
              </div>
            </div>

            <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
              <strong>Aviso:</strong> A importação substituirá os dados locais atuais pelos registros deste arquivo de backup.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setImportPreview({ isOpen: false })}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar e Restaurar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
