import {
  Client,
  Opportunity,
  FollowUpTask,
  ActivityLog,
  UserSettings,
} from '../types';
import { getTodayISODate, addDaysToDate } from './formatters';

const STORAGE_KEYS = {
  VERSION: 'viravenda_schema_version',
  CLIENTS: 'viravenda_clients_v2',
  OPPORTUNITIES: 'viravenda_opportunities_v2',
  TASKS: 'viravenda_tasks_v2',
  ACTIVITIES: 'viravenda_activities_v2',
  SETTINGS: 'viravenda_settings_v2',
  IS_DEMO: 'viravenda_is_demo_v2',
  // Chaves antigas para migração transparente
  CLIENTS_V1: 'viravenda_clients_v1',
  OPPORTUNITIES_V1: 'viravenda_opportunities_v1',
  SETTINGS_V1: 'viravenda_settings_v1',
  IS_DEMO_V1: 'viravenda_is_demo_v1',
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  userName: 'Mariana',
  businessName: 'ViraVenda Soluções',
  businessPhone: '(11) 98765-4321',
  businessSegment: 'Serviços & Comércio',
};

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
  const future7Days = addDaysToDate(7);

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
      title: 'Venda Fechada!',
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
    settings: DEFAULT_USER_SETTINGS,
  };
}

export function loadStoredData(): {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  settings: UserSettings;
  isDemo: boolean;
} {
  try {
    // 1. Tenta carregar a versão 2
    const rawClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    const rawOpps = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    const rawTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const rawActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const rawIsDemo = localStorage.getItem(STORAGE_KEYS.IS_DEMO);

    // Se já existem dados v2
    if (rawClients !== null || rawOpps !== null) {
      const clients: Client[] = rawClients ? JSON.parse(rawClients) : [];
      const opportunities: Opportunity[] = rawOpps ? JSON.parse(rawOpps) : [];
      const tasks: FollowUpTask[] = rawTasks ? JSON.parse(rawTasks) : [];
      const activities: ActivityLog[] = rawActivities ? JSON.parse(rawActivities) : [];
      const settings: UserSettings = rawSettings ? JSON.parse(rawSettings) : DEFAULT_USER_SETTINGS;
      const isDemo = rawIsDemo === 'true';

      return {
        clients: Array.isArray(clients) ? clients : [],
        opportunities: Array.isArray(opportunities) ? opportunities : [],
        tasks: Array.isArray(tasks) ? tasks : [],
        activities: Array.isArray(activities) ? activities : [],
        settings: settings || DEFAULT_USER_SETTINGS,
        isDemo,
      };
    }

    // 2. Se não encontrou v2, verifica se há dados da v1 para migrar sem perda!
    const rawClientsV1 = localStorage.getItem(STORAGE_KEYS.CLIENTS_V1);
    const rawOppsV1 = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES_V1);
    const rawSettingsV1 = localStorage.getItem(STORAGE_KEYS.SETTINGS_V1);
    const rawIsDemoV1 = localStorage.getItem(STORAGE_KEYS.IS_DEMO_V1);

    if (rawClientsV1 || rawOppsV1) {
      const clients: Client[] = rawClientsV1 ? JSON.parse(rawClientsV1) : [];
      const opportunities: Opportunity[] = rawOppsV1 ? JSON.parse(rawOppsV1) : [];
      const settings: UserSettings = rawSettingsV1 ? JSON.parse(rawSettingsV1) : DEFAULT_USER_SETTINGS;
      const isDemo = rawIsDemoV1 === 'true';

      // Cria tarefas a partir dos follow-ups das oportunidades migradas
      const tasks: FollowUpTask[] = opportunities
        .filter((o) => o.nextFollowUpDate)
        .map((o) => ({
          id: `tsk-migrated-${o.id}`,
          clientId: o.clientId,
          opportunityId: o.id,
          title: `Retorno sobre ${o.title}`,
          dueDate: o.nextFollowUpDate!,
          status: o.completedFollowUp ? 'concluida' : 'pendente',
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
        }));

      const activities: ActivityLog[] = [
        {
          id: `act-migrated-${Date.now()}`,
          type: 'client_updated',
          title: 'Sistema Atualizado para ViraVenda 2.0',
          description: 'Seus dados foram migrados com sucesso para a versão 2.0.',
          timestamp: new Date().toISOString(),
        },
      ];

      saveStoredData(clients, opportunities, tasks, activities, settings, isDemo);

      return {
        clients,
        opportunities,
        tasks,
        activities,
        settings,
        isDemo,
      };
    }

    // 3. Se for o primeiro acesso absoluto, inicializa com dados de demonstração
    const demo = getInitialDemoData();
    saveStoredData(demo.clients, demo.opportunities, demo.tasks, demo.activities, demo.settings, true);
    return {
      ...demo,
      isDemo: true,
    };
  } catch (err) {
    console.error('Erro ao ler do localStorage. Retornando dados seguros:', err);
    const demo = getInitialDemoData();
    return {
      ...demo,
      isDemo: true,
    };
  }
}

export function saveStoredData(
  clients: Client[],
  opportunities: Opportunity[],
  tasks: FollowUpTask[],
  activities: ActivityLog[],
  settings: UserSettings,
  isDemo?: boolean
): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VERSION, '2.0');
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    if (typeof isDemo === 'boolean') {
      localStorage.setItem(STORAGE_KEYS.IS_DEMO, isDemo ? 'true' : 'false');
    }
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

export function clearAllData(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, 'false');
  } catch (err) {
    console.error('Erro ao limpar dados:', err);
  }
}

export function resetToDemoData(): {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  settings: UserSettings;
} {
  const demo = getInitialDemoData();
  saveStoredData(demo.clients, demo.opportunities, demo.tasks, demo.activities, demo.settings, true);
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
  link.download = `viravenda_backup_v2_${getTodayISODate()}.json`;
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
    const settings: UserSettings = parsed.settings || DEFAULT_USER_SETTINGS;

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
 * Exportar Clientes para CSV com cabeçalho UTF-8 (BOM para compatibilidade com Excel)
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
