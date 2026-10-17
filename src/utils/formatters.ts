/**
 * Utilitários de formatação e manipulação para o padrão brasileiro
 */

export function formatBRL(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Remove caracteres não numéricos
 */
export function onlyDigits(value: string): string {
  return (value || '').replace(/\D/g, '');
}

/**
 * Aplica máscara de telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function formatPhoneBR(value: string): string {
  const digits = onlyDigits(value);
  
  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  // Celular com 9 dígitos (total 11) ou mais
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Limpa e formata o telefone para o padrão internacional do WhatsApp (ex: 5511999998888)
 */
export function cleanPhoneForWhatsApp(phone: string): string {
  let digits = onlyDigits(phone);
  
  // Se começou com 0, remove
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  
  // Se tem 10 ou 11 dígitos, adiciona o DDI do Brasil (55)
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  
  // Se já tem 12 ou 13 dígitos e começa com 55, mantém
  if (digits.length >= 12 && digits.startsWith('55')) {
    return digits;
  }
  
  // Fallback
  return digits;
}

/**
 * Valida se um telefone brasileiro possui tamanho válido (mínimo DDD + 8 dígitos = 10)
 */
export function isValidPhoneBR(phone: string): boolean {
  const digits = onlyDigits(phone);
  return digits.length >= 10 && digits.length <= 13;
}

/**
 * Gera URL oficial do WhatsApp wa.me
 */
export function generateWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = cleanPhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Converte data ISO YYYY-MM-DD para DD/MM/AAAA
 */
export function formatDateBR(dateStr?: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

/**
 * Retorna status relativo da data de retorno (Hoje, Atrasado, Futuro)
 */
export function getFollowUpStatus(dateStr?: string, isCompleted: boolean = false): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  daysDiff: number;
} {
  if (!dateStr) {
    return { label: 'Sem data', isOverdue: false, isToday: false, daysDiff: 0 };
  }

  if (isCompleted) {
    return { label: 'Concluído', isOverdue: false, isToday: false, daysDiff: 0 };
  }

  // Comparações baseadas em ano-mês-dia local
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    return { label: dateStr, isOverdue: false, isToday: false, daysDiff: 0 };
  }

  const targetDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: 'Hoje', isOverdue: false, isToday: true, daysDiff: 0 };
  } else if (diffDays === 1) {
    return { label: 'Amanhã', isOverdue: false, isToday: false, daysDiff: 1 };
  } else if (diffDays === -1) {
    return { label: 'Ontem (Atrasado)', isOverdue: true, isToday: false, daysDiff: -1 };
  } else if (diffDays < -1) {
    return {
      label: `Atrasado há ${Math.abs(diffDays)} dias`,
      isOverdue: true,
      isToday: false,
      daysDiff: diffDays,
    };
  } else {
    return {
      label: `Em ${diffDays} dias (${formatDateBR(dateStr)})`,
      isOverdue: false,
      isToday: false,
      daysDiff: diffDays,
    };
  }
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD
 */
export function getTodayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adiciona dias a uma data e retorna em YYYY-MM-DD
 */
export function addDaysToDate(days: number, fromDateStr?: string): string {
  const d = fromDateStr ? new Date(`${fromDateStr}T00:00:00`) : new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna tempo relativo textual (ex: "há 10 min", "há 2 horas", "ontem", etc.)
 */
export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'agora mesmo';
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHours === 1) return 'há 1 hora';
    if (diffHours < 24) return `há ${diffHours} horas`;
    if (diffDays === 1) return 'ontem';
    if (diffDays < 7) return `há ${diffDays} dias`;
    return formatDateBR(isoString);
  } catch {
    return formatDateBR(isoString);
  }
}

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp Direto',
  instagram: 'Instagram',
  indicacao: 'Indicação de Cliente',
  google: 'Google / Busca',
  fachada: 'Ponto Físico / Fachada',
  evento: 'Feira / Evento',
  outros: 'Outros Canais',
};

export const LOST_REASON_LABELS: Record<string, string> = {
  preco_alto: 'Preço / Orçamento fora do limite',
  optou_concorrente: 'Optou por concorrente',
  desistiu_projeto: 'Desistiu do projeto no momento',
  sem_resposta: 'Não respondeu / Parou de se comunicar',
  prazo_inadequado: 'Prazo de entrega não atendeu',
  outros: 'Outro motivo',
};

export const CLIENT_SEGMENT_LABELS: Record<string, string> = {
  comercio: 'Comércio / Varejo',
  servicos: 'Prestação de Serviços',
  industria: 'Indústria / Produção',
  autonomo: 'Profissional Autônomo / MEI',
  consumidor_final: 'Pessoa Física / Consumidor Final',
  outros: 'Outro segmento',
};

