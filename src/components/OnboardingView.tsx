import React, { useState } from 'react';
import { UserSettings, CompanySize, ClientSegment } from '../types';
import { formatPhoneBR, isValidEmail, CLIENT_SEGMENT_LABELS, COMPANY_SIZE_LABELS } from '../utils/formatters';
import {
  TrendingUp,
  Building2,
  Sparkles,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Briefcase,
  Users2,
  BadgeCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HardDrive,
  Info,
} from 'lucide-react';

interface OnboardingViewProps {
  onCompleteCompanySetup: (settings: UserSettings) => void;
  onExploreDemo: () => void;
}

type OnboardingStep = 'welcome' | 'form' | 'confirmation';

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onCompleteCompanySetup,
  onExploreDemo,
}) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');

  // Campos do formulário
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessSegment, setBusinessSegment] = useState<ClientSegment | 'outro'>('servicos');
  const [companySize, setCompanySize] = useState<CompanySize>('somente_eu');

  // Validações
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedSettings, setConfirmedSettings] = useState<UserSettings | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!userName.trim()) {
      newErrors.userName = 'Por favor, informe seu nome completo.';
    }

    if (!businessName.trim()) {
      newErrors.businessName = 'Por favor, informe o nome da sua empresa ou negócio.';
    }

    const cleanPhone = businessPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.businessPhone = 'Por favor, informe um telefone de contato com DDD.';
    } else if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      newErrors.businessPhone = 'Telefone incompleto. Digite o DDD + número (10 ou 11 dígitos).';
    }

    if (businessEmail.trim() && !isValidEmail(businessEmail.trim())) {
      newErrors.businessEmail = 'Formato de e-mail inválido. Ex: contato@empresa.com.br';
    }

    if (!businessSegment) {
      newErrors.businessSegment = 'Selecione o segmento principal de atuação.';
    }

    if (!companySize) {
      newErrors.companySize = 'Selecione o porte da sua empresa.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newSettings: UserSettings = {
      userName: userName.trim(),
      userRole: userRole.trim() || undefined,
      businessName: businessName.trim(),
      businessPhone: businessPhone.trim(),
      businessEmail: businessEmail.trim() || undefined,
      businessSegment,
      companySize,
      onboardingCompleted: true,
      appMode: 'own',
    };

    setConfirmedSettings(newSettings);
    setStep('confirmation');
  };

  const handleEnterDashboard = () => {
    if (confirmedSettings) {
      onCompleteCompanySetup(confirmedSettings);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/70 to-emerald-50/30 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-3 shadow-2xs">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>ViraVenda • Assistente Comercial para Pequenos Negócios</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Vira<span className="text-emerald-600">Venda</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
          Organize clientes, acompanhe orçamentos e nunca mais perca uma venda por esquecer um retorno.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
        {/* STEP 1: WELCOME SCREEN */}
        {step === 'welcome' && (
          <div className="p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Bem-vindo ao ViraVenda
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
                Vamos configurar seu ambiente comercial para começar a organizar seus clientes e oportunidades.
              </p>
            </div>

            {/* 2 Options Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Configurar minha empresa */}
              <button
                type="button"
                onClick={() => setStep('form')}
                className="group p-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-600 transition-all text-left flex flex-col justify-between gap-5 cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                      Ambiente Próprio
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-950">
                      Configurar minha empresa
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cadastre o nome do seu negócio e comece com sua base limpa para registrar clientes e orçamentos reais.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                  <span>Começar configuração</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {/* Option 2: Conhecer uma demonstração */}
              <button
                type="button"
                onClick={onExploreDemo}
                className="group p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-left flex flex-col justify-between gap-5 cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Exploração Rápida
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Conhecer uma demonstração
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Veja o sistema preenchido com dados fictícios de exemplo (clientes, propostas e tarefas de retorno).
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 group-hover:translate-x-1 transition-transform">
                  <span>Explorar demonstração</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* Privacy & No-Login Assurance Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                <p className="font-semibold text-slate-800">
                  Privacidade Total e Sem Criação de Conta
                </p>
                <p>
                  O ViraVenda funciona 100% no seu navegador (armazenamento local).
                  Não pedimos senha nem cartão de crédito, e seus dados de clientes não são compartilhados com terceiros.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: COMPANY SETUP FORM */}
        {step === 'form' && (
          <div className="p-6 sm:p-10 space-y-6 animate-in fade-in duration-300">
            {/* Header with back button */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <button
                  type="button"
                  onClick={() => setStep('welcome')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Configuração da sua Empresa
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Preencha os dados do seu negócio. Os campos com <span className="text-rose-500 font-bold">*</span> são obrigatórios.
                </p>
              </div>

              <div className="hidden sm:flex p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                <Building2 className="w-6 h-6" />
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Row 1: Responsável & Cargo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Nome completo do responsável <span className="text-rose-500 font-bold">*</span></span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      if (errors.userName) setErrors((prev) => ({ ...prev, userName: '' }));
                    }}
                    placeholder="Ex: Mariana Silva"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                      errors.userName
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                    }`}
                  />
                  {errors.userName && (
                    <span className="text-[11px] font-medium text-rose-600 mt-1 block">
                      {errors.userName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>Cargo / Função (opcional)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Opcional</span>
                  </label>
                  <input
                    type="text"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    placeholder="Ex: Proprietária, Diretor Comercial"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm text-slate-800 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Row 2: Nome da Empresa */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nome da empresa ou negócio <span className="text-rose-500 font-bold">*</span></span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (errors.businessName) setErrors((prev) => ({ ...prev, businessName: '' }));
                  }}
                  placeholder="Ex: Silva Marcenaria & Design de Interiores"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                    errors.businessName
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                  }`}
                />
                {errors.businessName && (
                  <span className="text-[11px] font-medium text-rose-600 mt-1 block">
                    {errors.businessName}
                  </span>
                )}
              </div>

              {/* Row 3: Telefone & E-mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Telefone de contato com DDD <span className="text-rose-500 font-bold">*</span></span>
                  </label>
                  <input
                    type="tel"
                    value={businessPhone}
                    onChange={(e) => {
                      setBusinessPhone(formatPhoneBR(e.target.value));
                      if (errors.businessPhone) setErrors((prev) => ({ ...prev, businessPhone: '' }));
                    }}
                    placeholder="(11) 98765-4321"
                    maxLength={15}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                      errors.businessPhone
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                    }`}
                  />
                  {errors.businessPhone && (
                    <span className="text-[11px] font-medium text-rose-600 mt-1 block">
                      {errors.businessPhone}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>E-mail profissional (opcional)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Opcional</span>
                  </label>
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(e) => {
                      setBusinessEmail(e.target.value);
                      if (errors.businessEmail) setErrors((prev) => ({ ...prev, businessEmail: '' }));
                    }}
                    placeholder="contato@suaempresa.com.br"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                      errors.businessEmail
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                    }`}
                  />
                  {errors.businessEmail && (
                    <span className="text-[11px] font-medium text-rose-600 mt-1 block">
                      {errors.businessEmail}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 4: Segmento & Tamanho da Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Segmento de atuação <span className="text-rose-500 font-bold">*</span></span>
                  </label>
                  <select
                    value={businessSegment}
                    onChange={(e) => setBusinessSegment(e.target.value as ClientSegment)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm text-slate-800 bg-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="servicos">Prestação de Serviços</option>
                    <option value="comercio">Comércio / Varejo</option>
                    <option value="industria">Indústria / Fabricação</option>
                    <option value="autonomo">Profissional Autônomo / Consultoria</option>
                    <option value="outro">Outro segmento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Users2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tamanho da empresa <span className="text-rose-500 font-bold">*</span></span>
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value as CompanySize)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm text-slate-800 bg-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="somente_eu">Somente eu (Autônomo / MEI)</option>
                    <option value="2_10">2 a 10 funcionários (Microempresa)</option>
                    <option value="11_50">11 a 50 funcionários (Pequena empresa)</option>
                    <option value="mais_50">Mais de 50 funcionários</option>
                  </select>
                </div>
              </div>

              {/* Security & Local Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Esta configuração inicial personaliza sua assinatura de mensagens no WhatsApp e cabeçalhos de relatórios.
                  Nenhuma senha é criada e nenhuma informação é enviada para servidores online.
                </p>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('welcome')}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition cursor-pointer"
                >
                  <span>Concluir e Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: CONFIRMATION & ACCESS */}
        {step === 'confirmation' && confirmedSettings && (
          <div className="p-6 sm:p-10 space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Configuração Concluída
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Tudo pronto para alavancar suas vendas!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Parabéns, <strong className="text-slate-900">{confirmedSettings.userName}</strong>! O ambiente comercial da{' '}
                <strong className="text-emerald-700">{confirmedSettings.businessName}</strong> foi configurado com sucesso.
              </p>
            </div>

            {/* Overview Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs text-slate-700 space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Empresa:</span>
                <span className="font-bold text-slate-900">{confirmedSettings.businessName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Responsável:</span>
                <span className="font-semibold text-slate-900">
                  {confirmedSettings.userName}
                  {confirmedSettings.userRole ? ` (${confirmedSettings.userRole})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Telefone / WhatsApp:</span>
                <span className="font-medium text-slate-900">{confirmedSettings.businessPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Segmento:</span>
                <span className="font-medium text-slate-900">
                  {CLIENT_SEGMENT_LABELS[confirmedSettings.businessSegment as keyof typeof CLIENT_SEGMENT_LABELS] ||
                    confirmedSettings.businessSegment}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Porte:</span>
                <span className="font-medium text-slate-900">
                  {COMPANY_SIZE_LABELS[confirmedSettings.companySize as keyof typeof COMPANY_SIZE_LABELS] ||
                    confirmedSettings.companySize}
                </span>
              </div>
            </div>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto pt-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-600 font-medium">
                  Base própria vazia e pronta para clientes reais
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-600 font-medium">
                  Pipeline comercial para orçamentos e etapas
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-600 font-medium">
                  Modelos de WhatsApp com a assinatura da sua empresa
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleEnterDashboard}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <span>Acessar Meu Painel Comercial</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreDemo}
                className="text-xs text-slate-500 hover:text-slate-800 underline transition cursor-pointer"
              >
                Prefiro conhecer a demonstração primeiro
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer credits & local info */}
      <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
        <span>ViraVenda • Seus dados ficam protegidos e salvos exclusivamente neste navegador</span>
      </div>
    </div>
  );
};
