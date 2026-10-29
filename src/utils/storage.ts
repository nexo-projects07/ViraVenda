import {
  Client,
  Opportunity,
  FollowUpTask,
  ActivityLog,
  UserSettings,
  AppMode,
} from '../types';
import { getTodayISODate, addDaysToDate } from './formatters';

export const STORAGE_KEYS = {
  VERSION: 'viravenda_schema_version',
  ONBOARDING_COMPLETED: 'viravenda_onboarding_completed_v2',
  APP_MODE: 'viravenda_app_mode_v2',
  // Ambiente Próprio da Empresa
  OWN_SETTINGS: 'viravenda_settings_v2',
  OWN_CLIENTS: 'viravenda_clients_v2',
  OWN_OPPORTUNITIES: 'viravenda_opportunities_v2',
  OWN_TASKS: 'viravenda_tasks_v2',
  OWN_ACTIVITIES: 'viravenda_activities_v2',
  // Ambiente Isolado de Demonstração
  DEMO_SETTINGS: 'viravenda_demo_settings_v2',
  DEMO_CLIENTS: 'viravenda_demo_clients_v2',
  DEMO_OPPORTUNITIES: 'viravenda_demo_opportunities_v2',
  DEMO_TASKS: 'viravenda_demo_tasks_v2',
  DEMO_ACTIVITIES: 'viravenda_demo_activities_v2',
  // Legados para compatibilidade
  LEGACY_IS_DEMO: 'viravenda_is_demo_v2',
  CLIENTS_V1: 'viravenda_clients_v1',
  OPPORTUNITIES_V1: 'viravenda_opportunities_v1',
  SETTINGS_V1: 'viravenda_settings_v1',
  IS_DEMO_V1: 'viravenda_is_demo_v1',
};

export const DEFAULT_DEMO_SETTINGS: UserSettings = {
  userName: 'Mariana Silva',
  businessName: 'ViraVenda Soluções Comerciais',
  businessPhone: '(11) 98765-4321',
  businessEmail: 'mariana@viravenda.com.br',
  businessSegment: 'servicos',
  companySize: '2_10',
  userRole: 'Proprietária & Gestora Comercial',
  onboardingCompleted: true,
  appMode: 'demo',
};

export const DEFAULT_OWN_SETTINGS: UserSettings = {
  userName: '',
  businessName: '',
  businessPhone: '',
  businessEmail: '',
  businessSegment: 'servicos',
  companySize: 'somente_eu',
  userRole: '',
  onboardingCompleted: false,
  appMode: 'own',
};

// Dados demonstrativos realistas brasileiros
export function getInitialDemoData(): {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  settings: UserSettings;
} {
  const today = getTodayISODate();
  const past5Days = addDaysToDate(-5);
  const past3Days = addDaysToDate(-3);
  const past1Day = addDaysToDate(-1);
  const future1Day = addDaysToDate(1);
  const future3Days = addDaysToDate(3);

  const clients: Client[] = [
    {
      id: 'cli-1',
      name: 'Camila Ferreira',
      phone: '(11) 98234-5678',
      email: 'camila.ferreira@gmail.com',
      company: 'Studio Estilo & Beleza',
      segment: 'servicos',
      notes: 'Pediu orçamento para renovação completa de móveis do salão.',
      createdAt: past5Days,
      updatedAt: past1Day,
      lastInteractionAt: past1Day,
    },
    {
      id: 'cli-2',
      name: 'Rodrigo Medeiros',
      phone: '(21) 99123-4567',
      email: 'rodrigo@medeirosmoveis.com.br',
      company: 'Medeiros Logística',
      segment: 'comercio',
      notes: 'Precisa de solução para a frota até o final deste mês.',
      createdAt: past5Days,
      updatedAt: today,
      lastInteractionAt: today,
    },
    {
      id: 'cli-3',
      name: 'Luciana Albuquerque',
      phone: '(31) 97345-6789',
      email: 'luciana@boutiquefina.com.br',
      company: 'Boutique Flor de Lis',
      segment: 'comercio',
      notes: 'Cliente recomendada por Paulo. Muito simpática e pontual.',
      createdAt: past3Days,
      updatedAt: today,
      lastInteractionAt: today,
    },
    {
      id: 'cli-4',
      name: 'Thiago Nogueira',
      phone: '(41) 98877-6655',
      company: 'Nogueira Engenharia',
      segment: 'industria',
      notes: 'Interessado em pacote anual de manutenção.',
      createdAt: past5Days,
      updatedAt: past3Days,
      lastInteractionAt: past3Days,
    },
    {
      id: 'cli-5',
      name: 'Juliana Pires',
      phone: '(19) 99654-3210',
      email: 'juliana.pires@decor.com.br',
      company: 'Pires Interiores',
      segment: 'autonomo',
      notes: 'Fechou o projeto da sala de estar e solicitou início em 15 dias.',
      createdAt: past5Days,
      updatedAt: today,
      lastInteractionAt: today,
    },
    {
      id: 'cli-6',
      name: 'Marcos Vinicius',
      phone: '(81) 98765-4320',
      email: 'marcos@clinicavita.com.br',
      company: 'Clínica Vita Saúde',
      segment: 'servicos',
      notes: 'Contato vindo do Instagram. Quer sistema de agendamento.',
      createdAt: past1Day,
      updatedAt: past1Day,
      lastInteractionAt: past1Day,
    },
  ];

  const opportunities: Opportunity[] = [
    {
      id: 'opp-1',
      clientId: 'cli-1',
      title: 'Decoração e Móveis Planejados',
      description: 'Bancada de atendimento e 3 estações de trabalho personalizadas.',
      value: 3850,
      stage: 'orcamento_enviado',
      source: 'indicacao',
      createdAt: past5Days,
      nextFollowUpDate: past1Day, // Atrasado
      completedFollowUp: false,
      notes: 'Enviado arquivo PDF com valores e opções de parcelamento.',
      updatedAt: past1Day,
    },
    {
      id: 'opp-2',
      clientId: 'cli-2',
      title: 'Plano de Manutenção Preventiva Trimestral',
      description: 'Revisão geral e suporte emergencial para 4 utilitários.',
      value: 2400,
      stage: 'em_negociacao',
      source: 'google',
      createdAt: past5Days,
      nextFollowUpDate: today, // Hoje
      completedFollowUp: false,
      notes: 'Pediu desconto para pagamento à vista via Pix.',
      updatedAt: today,
    },
    {
      id: 'opp-3',
      clientId: 'cli-3',
      title: 'Identidade Visual e Embalagens Personalizadas',
      description: 'Criação de logotipo, sacolas e fita adesiva personalizada.',
      value: 1250,
      stage: 'novo_contato',
      source: 'instagram',
      createdAt: past3Days,
      nextFollowUpDate: today, // Hoje
      completedFollowUp: false,
      notes: 'Primeiro contato recebido pelo Instagram.',
      updatedAt: today,
    },
    {
      id: 'opp-4',
      clientId: 'cli-5',
      title: 'Consultoria de Ambientação e Iluminação',
      description: 'Projeto luminotécnico para apartamento residencial.',
      value: 1800,
      stage: 'ganho',
      source: 'whatsapp',
      createdAt: past5Days,
      closedAt: today,
      completedFollowUp: true,
      notes: 'Contrato assinado e sinal de 50% pago.',
      updatedAt: today,
    },
    {
      id: 'opp-5',
      clientId: 'cli-4',
      title: 'Instalação Elétrica Comercial',
      description: 'Quadro de distribuição trifásico e iluminação LED.',
      value: 4200,
      stage: 'perdido',
      source: 'indicacao',
      createdAt: past5Days,
      closedAt: past1Day,
      completedFollowUp: true,
      lostReason: 'prazo_inadequado',
      lostReasonDetails: 'Optou por concorrente que ofereceu prazo menor de entrega.',
      notes: 'Optou por concorrente que ofereceu prazo menor de entrega.',
      updatedAt: past1Day,
    },
    {
      id: 'opp-6',
      clientId: 'cli-1',
      title: 'Acessórios e Iluminação Complementar',
      description: 'Arandelas e fitas de LED para espelhos.',
      value: 950,
      stage: 'em_negociacao',
      source: 'indicacao',
      createdAt: past3Days,
      nextFollowUpDate: future3Days, // Futuro
      completedFollowUp: false,
      notes: 'Aguardando decisão sobre o projeto principal.',
      updatedAt: past1Day,
    },
    {
      id: 'opp-7',
      clientId: 'cli-6',
      title: 'Implantação de Totem de Autoatendimento',
      description: 'Totem touchscreen com impressora térmica e leitor de cartões.',
      value: 5200,
      stage: 'orcamento_enviado',
      source: 'instagram',
      createdAt: past1Day,
      nextFollowUpDate: future1Day,
      completedFollowUp: false,
      notes: 'Enviada apresentação de fotos reais dos totens instalados.',
      updatedAt: past1Day,
    },
  ];

  const tasks: FollowUpTask[] = [
    {
      id: 'tsk-1',
      clientId: 'cli-1',
      opportunityId: 'opp-1',
      title: 'Cobrar resposta do orçamento de móveis',
      description: 'Mandar mensagem no WhatsApp perguntando se Camila conseguiu ver o arquivo.',
      dueDate: past1Day, // Atrasado
      dueTime: '14:00',
      status: 'pendente',
      createdAt: past3Days,
      updatedAt: past3Days,
    },
    {
      id: 'tsk-2',
      clientId: 'cli-2',
      opportunityId: 'opp-2',
      title: 'Enviar contraproposta com desconto Pix',
      description: 'Oferecer 5% de desconto no plano de manutenção com pagamento antecipado.',
      dueDate: today, // Hoje
      dueTime: '10:30',
      status: 'pendente',
      createdAt: past1Day,
      updatedAt: past1Day,
    },
    {
      id: 'tsk-3',
      clientId: 'cli-3',
      opportunityId: 'opp-3',
      title: 'Agendar bate-papo de alinhamento visual',
      description: 'Ligar ou enviar áudio para entender as cores da boutique.',
      dueDate: today, // Hoje
      status: 'pendente',
      createdAt: today,
      updatedAt: today,
    },
    {
      id: 'tsk-4',
      clientId: 'cli-6',
      opportunityId: 'opp-7',
      title: 'Acompanhar proposta do totem de autoatendimento',
      dueDate: future1Day,
      status: 'pendente',
      createdAt: past1Day,
      updatedAt: past1Day,
    },
    {
      id: 'tsk-5',
      clientId: 'cli-5',
      opportunityId: 'opp-4',
      title: 'Enviar recibo de sinal e confirmação do pedido',
      dueDate: past1Day,
      status: 'concluida',
      completedAt: today,
      createdAt: past3Days,
      updatedAt: today,
    },
  ];

  const activities: ActivityLog[] = [
    {
      id: 'act-1',
      type: 'opportunity_won',
      title: 'Venda Fechada! 🎉',
      description: 'Juliana Pires fechou "Consultoria de Ambientação e Iluminação" no valor de R$ 1.800,00',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      clientId: 'cli-5',
      opportunityId: 'opp-4',
      meta: { value: 1800 },
    },
    {
      id: 'act-2',
      type: 'stage_changed',
      title: 'Etapa Atualizada',
      description: 'Rodrigo Medeiros avançou para "Em negociação"',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      clientId: 'cli-2',
      opportunityId: 'opp-2',
    },
    {
      id: 'act-3',
      type: 'opportunity_created',
      title: 'Novo Orçamento Criado',
      description: 'Marcos Vinicius: "Implantação de Totem de Autoatendimento" (R$ 5.200,00)',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      clientId: 'cli-6',
      opportunityId: 'opp-7',
    },
    {
      id: 'act-4',
      type: 'followup_completed',
      title: 'Tarefa Concluída',
      description: 'Recibo de sinal enviado para Juliana Pires',
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      clientId: 'cli-5',
    },
    {
      id: 'act-5',
      type: 'opportunity_lost',
      title: 'Oportunidade Perdida',
      description: 'Thiago Nogueira: Optou por concorrente com prazo menor',
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      clientId: 'cli-4',
      opportunityId: 'opp-5',
    },
  ];

  return {
    clients,
    opportunities,
    tasks,
    activities,
    settings: DEFAULT_DEMO_SETTINGS,
  };
}

/**
 * Lê os dados de um ambiente específico ('own' ou 'demo')
 */
export function loadDatasetForMode(mode: AppMode): {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  settings: UserSettings;
} {
  const isDemoMode = mode === 'demo';
  const clientsKey = isDemoMode ? STORAGE_KEYS.DEMO_CLIENTS : STORAGE_KEYS.OWN_CLIENTS;
  const oppsKey = isDemoMode ? STORAGE_KEYS.DEMO_OPPORTUNITIES : STORAGE_KEYS.OWN_OPPORTUNITIES;
  const tasksKey = isDemoMode ? STORAGE_KEYS.DEMO_TASKS : STORAGE_KEYS.OWN_TASKS;
  const actsKey = isDemoMode ? STORAGE_KEYS.DEMO_ACTIVITIES : STORAGE_KEYS.OWN_ACTIVITIES;
  const settingsKey = isDemoMode ? STORAGE_KEYS.DEMO_SETTINGS : STORAGE_KEYS.OWN_SETTINGS;

  const rawClients = localStorage.getItem(clientsKey);
  const rawOpps = localStorage.getItem(oppsKey);
  const rawTasks = localStorage.getItem(tasksKey);
  const rawActivities = localStorage.getItem(actsKey);
  const rawSettings = localStorage.getItem(settingsKey);

  if (isDemoMode) {
    // Se for modo demo e ainda não tiver sido inicializado, inicializa com demo padrão
    if (rawClients === null && rawOpps === null) {
      const demoData = getInitialDemoData();
      saveDatasetForMode('demo', demoData.clients, demoData.opportunities, demoData.tasks, demoData.activities, demoData.settings);
      return demoData;
    }
  }

  const clients: Client[] = rawClients ? JSON.parse(rawClients) : [];
  const opportunities: Opportunity[] = rawOpps ? JSON.parse(rawOpps) : [];
  const tasks: FollowUpTask[] = rawTasks ? JSON.parse(rawTasks) : [];
  const activities: ActivityLog[] = rawActivities ? JSON.parse(rawActivities) : [];
  const fallbackSettings = isDemoMode ? DEFAULT_DEMO_SETTINGS : DEFAULT_OWN_SETTINGS;
  const settings: UserSettings = rawSettings ? JSON.parse(rawSettings) : fallbackSettings;

  return {
    clients: Array.isArray(clients) ? clients : [],
    opportunities: Array.isArray(opportunities) ? opportunities : [],
    tasks: Array.isArray(tasks) ? tasks : [],
    activities: Array.isArray(activities) ? activities : [],
    settings: {
      ...fallbackSettings,
      ...settings,
      appMode: mode,
    },
  };
}

/**
 * Salva os dados de um ambiente específico
 */
export function saveDatasetForMode(
  mode: AppMode,
  clients: Client[],
  opportunities: Opportunity[],
  tasks: FollowUpTask[],
  activities: ActivityLog[],
  settings: UserSettings
): void {
  try {
    const isDemoMode = mode === 'demo';
    const clientsKey = isDemoMode ? STORAGE_KEYS.DEMO_CLIENTS : STORAGE_KEYS.OWN_CLIENTS;
    const oppsKey = isDemoMode ? STORAGE_KEYS.DEMO_OPPORTUNITIES : STORAGE_KEYS.OWN_OPPORTUNITIES;
    const tasksKey = isDemoMode ? STORAGE_KEYS.DEMO_TASKS : STORAGE_KEYS.OWN_TASKS;
    const actsKey = isDemoMode ? STORAGE_KEYS.DEMO_ACTIVITIES : STORAGE_KEYS.OWN_ACTIVITIES;
    const settingsKey = isDemoMode ? STORAGE_KEYS.DEMO_SETTINGS : STORAGE_KEYS.OWN_SETTINGS;

    localStorage.setItem(STORAGE_KEYS.VERSION, '2.0');
    localStorage.setItem(clientsKey, JSON.stringify(clients));
    localStorage.setItem(oppsKey, JSON.stringify(opportunities));
    localStorage.setItem(tasksKey, JSON.stringify(tasks));
    localStorage.setItem(actsKey, JSON.stringify(activities));
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEYS.APP_MODE, mode);
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

/**
 * Carregamento inicial com suporte a migração transparente e verificação de onboarding
 */
export function loadStoredData(): {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  settings: UserSettings;
  isDemo: boolean;
  appMode: AppMode;
  onboardingCompleted: boolean;
} {
  try {
    const rawOnboarding = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    const rawAppMode = localStorage.getItem(STORAGE_KEYS.APP_MODE) as AppMode | null;
    const legacyIsDemo = localStorage.getItem(STORAGE_KEYS.LEGACY_IS_DEMO);
    const rawOwnSettings = localStorage.getItem(STORAGE_KEYS.OWN_SETTINGS);

    // 1. Determina se o onboarding já foi concluído
    let onboardingCompleted = rawOnboarding === 'true';

    // Migração de usuários anteriores: se já haviam configurado uma empresa real
    if (rawOnboarding === null && rawOwnSettings) {
      try {
        const parsed = JSON.parse(rawOwnSettings);
        if (parsed?.businessName && legacyIsDemo === 'false') {
          onboardingCompleted = true;
          localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
        }
      } catch {
        // ignora
      }
    }

    // 2. Determina o modo ativo ('own' ou 'demo')
    let activeMode: AppMode = 'own';
    if (rawAppMode === 'demo' || (rawAppMode === null && legacyIsDemo === 'true' && !onboardingCompleted)) {
      activeMode = 'demo';
    } else if (rawAppMode === 'own') {
      activeMode = 'own';
    }

    // 3. Carrega o dataset correspondente ao modo ativo
    const data = loadDatasetForMode(activeMode);

    return {
      ...data,
      isDemo: activeMode === 'demo',
      appMode: activeMode,
      onboardingCompleted,
    };
  } catch (err) {
    console.error('Erro ao ler do localStorage. Inicializando estado seguro:', err);
    return {
      clients: [],
      opportunities: [],
      tasks: [],
      activities: [],
      settings: DEFAULT_OWN_SETTINGS,
      isDemo: false,
      appMode: 'own',
      onboardingCompleted: false,
    };
  }
}

/**
 * Salva os dados do modo ativo atual
 */
export function saveStoredData(
  clients: Client[],
  opportunities: Opportunity[],
  tasks: FollowUpTask[],
  activities: ActivityLog[],
  settings: UserSettings,
  isDemoOrMode?: boolean | AppMode
): void {
  const mode: AppMode =
    typeof isDemoOrMode === 'string'
      ? isDemoOrMode
      : isDemoOrMode === true
      ? 'demo'
      : settings.appMode || 'own';

  saveDatasetForMode(mode, clients, opportunities, tasks, activities, {
    ...settings,
    appMode: mode,
  });
}

/**
 * Registra a conclusão do onboarding com os dados da empresa cadastrada
 */
export function completeOnboarding(companySettings: UserSettings): {
  settings: UserSettings;
} {
  const updatedSettings: UserSettings = {
    ...DEFAULT_OWN_SETTINGS,
    ...companySettings,
    onboardingCompleted: true,
    appMode: 'own',
  };

  localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  localStorage.setItem(STORAGE_KEYS.APP_MODE, 'own');
  localStorage.setItem(STORAGE_KEYS.LEGACY_IS_DEMO, 'false');
  localStorage.setItem(STORAGE_KEYS.OWN_SETTINGS, JSON.stringify(updatedSettings));

  // Garante que a base própria comece limpa se não houver clientes
  const rawOwnClients = localStorage.getItem(STORAGE_KEYS.OWN_CLIENTS);
  if (rawOwnClients === null) {
    localStorage.setItem(STORAGE_KEYS.OWN_CLIENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OWN_OPPORTUNITIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OWN_TASKS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OWN_ACTIVITIES, JSON.stringify([
      {
        id: `act-welcome-${Date.now()}`,
        type: 'client_updated',
        title: 'Ambiente Comercial Configurado',
        description: `Ambiente de vendas inicializado para ${companySettings.businessName}.`,
        timestamp: new Date().toISOString(),
      },
    ]));
  }

  return { settings: updatedSettings };
}

/**
 * Define o modo da aplicação ('own' ou 'demo')
 */
export function setStoredAppMode(mode: AppMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_MODE, mode);
    localStorage.setItem(STORAGE_KEYS.LEGACY_IS_DEMO, mode === 'demo' ? 'true' : 'false');
  } catch (err) {
    console.error('Erro ao atualizar modo do app:', err);
  }
}

/**
 * Define o estado de onboarding
 */
export function setStoredOnboardingCompleted(completed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed ? 'true' : 'false');
  } catch (err) {
    console.error('Erro ao atualizar onboarding:', err);
  }
}

/**
 * Limpa exclusivamente a base da empresa própria (mantém modo próprio limpo)
 */
export function clearOwnData(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OWN_CLIENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OWN_OPPORTUNITIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OWN_TASKS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OWN_ACTIVITIES, JSON.stringify([]));
  } catch (err) {
    console.error('Erro ao limpar dados próprios:', err);
  }
}

/**
 * Reseta exclusivamente os dados do modo de demonstração (não toca na empresa própria)
 */
export function resetDemoData(): {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  settings: UserSettings;
} {
  const demo = getInitialDemoData();
  saveDatasetForMode('demo', demo.clients, demo.opportunities, demo.tasks, demo.activities, demo.settings);
  return demo;
}

/**
 * Exportação em JSON completo
 */
export function exportBackupJSON(
  clients: Client[],
  opportunities: Opportunity[],
  tasks: FollowUpTask[],
  activities: ActivityLog[],
  settings: UserSettings
): void {
  const data = {
    app: 'ViraVenda',
    schemaVersion: '2.0',
    exportDate: new Date().toISOString(),
    clients,
    opportunities,
    tasks,
    activities,
    settings,
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = (settings.businessName || 'empresa').toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.download = `viravenda_${safeName}_backup_${getTodayISODate()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validação de importação com retorno de prévia antes da substituição
 */
export function validateAndPreviewJSON(jsonText: string): {
  success: boolean;
  message: string;
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
} {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'O arquivo selecionado não contém um formato JSON válido.' };
    }

    if (!Array.isArray(parsed.clients) || !Array.isArray(parsed.opportunities)) {
      return {
        success: false,
        message: 'O arquivo não possui o formato de backup esperado do ViraVenda (listas de clientes e oportunidades não encontradas).',
      };
    }

    const clients: Client[] = parsed.clients;
    const opportunities: Opportunity[] = parsed.opportunities;
    const tasks: FollowUpTask[] = Array.isArray(parsed.tasks) ? parsed.tasks : [];
    const activities: ActivityLog[] = Array.isArray(parsed.activities) ? parsed.activities : [];
    const settings: UserSettings = parsed.settings || DEFAULT_OWN_SETTINGS;

    return {
      success: true,
      message: 'Arquivo validado com sucesso.',
      preview: {
        clientsCount: clients.length,
        opportunitiesCount: opportunities.length,
        tasksCount: tasks.length,
        activitiesCount: activities.length,
        businessName: settings.businessName,
      },
      data: {
        clients,
        opportunities,
        tasks,
        activities,
        settings,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? `Erro no arquivo: ${err.message}` : 'Falha ao ler o arquivo JSON.',
    };
  }
}

/**
 * Escapador seguro de campos CSV de acordo com RFC 4180
 */
function escapeCSV(field: string | number | undefined | null): string {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Exportar Clientes para CSV com cabeçalho UTF-8
 */
export function exportClientsCSV(clients: Client[], opportunities: Opportunity[]): void {
  const headers = [
    'ID',
    'Nome',
    'Telefone',
    'Email',
    'Empresa',
    'Segmento',
    'Observações',
    'Data de Cadastro',
    'Total de Oportunidades',
    'Total Vendido (R$)',
    'Total em Aberto (R$)',
  ];

  const rows = clients.map((c) => {
    const clientOpps = opportunities.filter((o) => o.clientId === c.id);
    const wonValue = clientOpps
      .filter((o) => o.stage === 'ganho')
      .reduce((sum, o) => sum + (o.value || 0), 0);
    const openValue = clientOpps
      .filter((o) => o.stage !== 'ganho' && o.stage !== 'perdido')
      .reduce((sum, o) => sum + (o.value || 0), 0);

    return [
      escapeCSV(c.id),
      escapeCSV(c.name),
      escapeCSV(c.phone),
      escapeCSV(c.email || ''),
      escapeCSV(c.company || ''),
      escapeCSV(c.segment || ''),
      escapeCSV(c.notes || ''),
      escapeCSV(c.createdAt),
      escapeCSV(clientOpps.length),
      escapeCSV(wonValue.toFixed(2)),
      escapeCSV(openValue.toFixed(2)),
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `viravenda_clientes_${getTodayISODate()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exportar Oportunidades para CSV com cabeçalho UTF-8
 */
export function exportOpportunitiesCSV(opportunities: Opportunity[], clients: Client[]): void {
  const clientMap = new Map<string, Client>();
  clients.forEach((c) => clientMap.set(c.id, c));

  const headers = [
    'ID',
    'Título',
    'Cliente',
    'Telefone Cliente',
    'Valor (R$)',
    'Etapa',
    'Origem do Contato',
    'Data de Criação',
    'Data Próximo Retorno',
    'Motivo da Perda',
    'Detalhes Motivo Perda',
    'Descrição',
  ];

  const rows = opportunities.map((opp) => {
    const client = clientMap.get(opp.clientId);
    return [
      escapeCSV(opp.id),
      escapeCSV(opp.title),
      escapeCSV(client?.name || 'Cliente removido'),
      escapeCSV(client?.phone || ''),
      escapeCSV((opp.value || 0).toFixed(2)),
      escapeCSV(opp.stage),
      escapeCSV(opp.source || 'Não especificada'),
      escapeCSV(opp.createdAt),
      escapeCSV(opp.nextFollowUpDate || ''),
      escapeCSV(opp.lostReason || ''),
      escapeCSV(opp.lostReasonDetails || ''),
      escapeCSV(opp.description || ''),
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `viravenda_oportunidades_${getTodayISODate()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
