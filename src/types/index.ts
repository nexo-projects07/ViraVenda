export type OpportunityStage =
  | 'novo_contato'
  | 'em_negociacao'
  | 'orcamento_enviado'
  | 'ganho'
  | 'perdido';

export type LeadSource =
  | 'whatsapp'
  | 'instagram'
  | 'indicacao'
  | 'google'
  | 'fachada'
  | 'evento'
  | 'outros';

export type LostReason =
  | 'preco_alto'
  | 'optou_concorrente'
  | 'desistiu_projeto'
  | 'sem_resposta'
  | 'prazo_inadequado'
  | 'outros';

export type ClientSegment =
  | 'comercio'
  | 'servicos'
  | 'industria'
  | 'autonomo'
  | 'consumidor_final'
  | 'outros';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  segment?: ClientSegment | string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastInteractionAt?: string;
}

export interface Opportunity {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  value: number;
  stage: OpportunityStage;
  source?: LeadSource;
  createdAt: string;
  updatedAt: string;
  nextFollowUpDate?: string; // YYYY-MM-DD
  completedFollowUp?: boolean;
  notes?: string;
  lostReason?: LostReason;
  lostReasonDetails?: string;
  closedAt?: string;
}

export interface FollowUpTask {
  id: string;
  clientId: string;
  opportunityId?: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  status: 'pendente' | 'concluida';
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityType =
  | 'client_created'
  | 'client_updated'
  | 'client_deleted'
  | 'opportunity_created'
  | 'opportunity_updated'
  | 'stage_changed'
  | 'opportunity_won'
  | 'opportunity_lost'
  | 'opportunity_reopened'
  | 'followup_created'
  | 'followup_completed'
  | 'followup_rescheduled'
  | 'message_prepared';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  clientId?: string;
  opportunityId?: string;
  meta?: Record<string, any>;
}

export interface UserSettings {
  userName: string;
  businessName: string;
  businessPhone: string;
  businessSegment?: string;
}

export type MessageTone = 'amigavel' | 'direto' | 'formal';

export interface MessageTemplate {
  id: string;
  title: string;
  category:
    | 'primeiro_contato'
    | 'apresentacao'
    | 'orcamento'
    | 'acompanhamento'
    | 'resgate'
    | 'negociacao'
    | 'reativacao'
    | 'fechamento'
    | 'confirmacao'
    | 'pos_venda';
  description: string;
  suggestedStage?: OpportunityStage;
  variants: Record<MessageTone, string>;
}

export type ActiveTab =
  | 'dashboard'
  | 'oportunidades'
  | 'clientes'
  | 'acompanhamentos'
  | 'mensagens'
  | 'relatorios'
  | 'configuracoes';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
