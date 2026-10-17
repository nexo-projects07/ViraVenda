import { MessageTemplate, MessageTone, Client, Opportunity, UserSettings } from '../types';
import { formatBRL } from './formatters';

export const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: 'primeiro_contato',
    title: '1. Primeiro Contato após Solicitação',
    category: 'primeiro_contato',
    suggestedStage: 'novo_contato',
    description: 'Acolhimento imediato assim que um lead entrar em contato.',
    variants: {
      amigavel: `Olá, {{primeiro_nome}}! Tudo bem por aí? 😊

Aqui é o(a) {{meu_nome}} da *{{minha_empresa}}*. Recebi sua mensagem com interesse em *{{titulo_oportunidade}}*.

Estou à disposição para entender o que você precisa e te passar uma proposta sob medida! Você prefere trocar ideias por aqui mesmo no WhatsApp ou em uma ligação rápida?`,
      direto: `Olá, {{primeiro_nome}}! Sou o(a) {{meu_nome}} da *{{minha_empresa}}*.

Recebi sua solicitação sobre *{{titulo_oportunidade}}*. Como posso te ajudar hoje para já te passar as informações e valores?`,
      formal: `Prezado(a) {{nome}}, boa tarde.

Aqui é {{meu_nome}}, representando a *{{minha_empresa}}*. Registramos seu interesse referente a *{{titulo_oportunidade}}*.

Gostaríamos de compreender com exatidão sua demanda para elaborar uma proposta técnica e comercial precisa. Poderia nos detalhar os requisitos essenciais?`,
    },
  },
  {
    id: 'apresentacao_servico',
    title: '2. Apresentação de Serviços & Portfólio',
    category: 'apresentacao',
    suggestedStage: 'novo_contato',
    description: 'Demonstrar autoridade, qualidade e exemplos práticos de trabalhos realizados.',
    variants: {
      amigavel: `Oi, {{primeiro_nome}}! Tudo bem?

Como combinamos, estou te enviando um resumo do que fazemos aqui na *{{minha_empresa}}* e alguns trabalhos parecidos com o projeto de *{{titulo_oportunidade}}*.

Nosso foco é entregar com o máximo de capricho, no prazo combinado e com garantia. Se quiser ver mais detalhes, é só me falar!`,
      direto: `{{primeiro_nome}}, conforme conversamos, segue nosso portfólio de serviços para *{{titulo_oportunidade}}*.

Atendemos com prazo rigoroso e suporte direto. Aguardo seu retorno para avançarmos no orçamento.`,
      formal: `Prezado(a) {{nome}},

Conforme alinhado, compartilhamos a apresentação institucional da *{{minha_empresa}}* e nosso histórico em soluções de *{{titulo_oportunidade}}*.

Permanecemos à disposição para agendarmos uma reunião de alinhamento com sua equipe.`,
    },
  },
  {
    id: 'envio_orcamento',
    title: '3. Envio de Orçamento / Proposta Comercial',
    category: 'orcamento',
    suggestedStage: 'orcamento_enviado',
    description: 'Apresentar a proposta de forma clara, profissional e valorizando a entrega.',
    variants: {
      amigavel: `Olá, {{primeiro_nome}}! Tudo ótimo?

Acabei de finalizar a proposta para o projeto de *{{titulo_oportunidade}}*! 🎉

O investimento total ficou em *{{valor}}*, com opções de parcelamento facilitadas e garantia completa do serviço.

Dá uma olhadinha e me conta o que achou! Estou por aqui para tirar qualquer dúvida.`,
      direto: `Olá, {{primeiro_nome}}. Segue a proposta comercial de *{{titulo_oportunidade}}*:

• Valor: *{{valor}}*
• Condições e detalhes conforme combinamos.

Assim que conferir, me confirme se podemos aprovar o início!`,
      formal: `Prezado(a) {{nome}},

Encaminhamos a proposta comercial referente ao escopo de *{{titulo_oportunidade}}*.

• Valor global da proposta: *{{valor}}*
• Validade da proposta e condições de faturamento anexas.

Aguardamos vossa avaliação e permanecemos à disposição para eventuais esclarecimentos.`,
    },
  },
  {
    id: 'acompanhamento_48h',
    title: '4. Acompanhamento após Envio (Follow-up 48h)',
    category: 'acompanhamento',
    suggestedStage: 'orcamento_enviado',
    description: 'Checar se o cliente recebeu e leu o orçamento, sem parecer insistente.',
    variants: {
      amigavel: `Oi, {{primeiro_nome}}! Como você está?

Passando rapidinho para saber se você conseguiu ver a proposta de *{{titulo_oportunidade}}* que te enviei.

Ficou alguma dúvida sobre os itens, prazos ou formas de pagamento? Consigo ajustar o que for preciso para darmos certo! 😊`,
      direto: `Olá, {{primeiro_nome}}! Conseguiu avaliar o orçamento de *{{titulo_oportunidade}}* ({{valor}})?

Se precisar de algum ajuste nos prazos ou formas de pagamento, me avise para atualizarmos.`,
      formal: `Prezado(a) {{nome}},

Gostaríamos de confirmar o recebimento da proposta comercial encaminhada sobre *{{titulo_oportunidade}}*.

Houve oportunidade de analisá-la com os responsáveis? Estamos à disposição para eventuais alinhamentos contratuais.`,
    },
  },
  {
    id: 'resgate_sem_resposta',
    title: '5. Cliente que não Respondeu (Resgate Amigável)',
    category: 'resgate',
    suggestedStage: 'orcamento_enviado',
    description: 'Reativar contatos que pararam de responder sem constrangimento.',
    variants: {
      amigavel: `Oi, {{primeiro_nome}}! Imagino que sua rotina esteja super corrida!

Queria só saber se você ainda tem interesse no projeto de *{{titulo_oportunidade}}*.

Se o momento não for o ideal agora ou se preferir pausar por enquanto, não tem problema nenhum, só me avise para eu organizar minha agenda por aqui, tá bom? Um abraço!`,
      direto: `Olá, {{primeiro_nome}}! Não tive mais seu retorno sobre *{{titulo_oportunidade}}*.

Ainda tem interesse em realizar este projeto ou prefere deixar para um próximo momento?`,
      formal: `Prezado(a) {{nome}},

Em razão do encerramento da validade de nossa proposta para *{{titulo_oportunidade}}*, solicitamos a gentileza de nos informar sobre a continuidade do processo decisório.`,
    },
  },
  {
    id: 'negociacao_objecoes',
    title: '6. Negociação em Andamento & Facilidade de Pagamento',
    category: 'negociacao',
    suggestedStage: 'em_negociacao',
    description: 'Ajudar a viabilizar o fechamento oferecendo alternativas de pagamento ou escopo.',
    variants: {
      amigavel: `{{primeiro_nome}}, estive pensando no seu projeto de *{{titulo_oportunidade}}* ({{valor}}).

Se o valor ou a forma de pagamento foram o motivo de dúvida, consigo ver com a nossa equipe uma condição especial de parcelamento ou até uma entrada reduzida via Pix. O que fica mais confortável para você?`,
      direto: `Olá, {{primeiro_nome}}! Para viabilizarmos o projeto de *{{titulo_oportunidade}}*, consigo flexibilizar o parcelamento ou aplicar um desconto para pagamento à vista. Conseguimos fechar hoje?`,
      formal: `Prezado(a) {{nome}},

Reavaliamos os parâmetros comerciais de *{{titulo_oportunidade}}* e podemos estruturar um plano de pagamento em etapas conforme a entrega das fases. Podemos agendar uma breve conversa?`,
    },
  },
  {
    id: 'reativacao_inativo',
    title: '7. Retomada de Contato após um Período',
    category: 'reativacao',
    suggestedStage: 'novo_contato',
    description: 'Resgatar clientes de meses anteriores para novas demandas ou continuidade.',
    variants: {
      amigavel: `Olá, {{primeiro_nome}}! Faz algum tempo que não conversamos! Como vão as coisas por aí?

Lembrei de você e quis saber se você ainda precisa de apoio com *{{titulo_oportunidade}}* ou se surgiu alguma nova necessidade em que possamos te ajudar.

Será um prazer te atender novamente!`,
      direto: `Olá, {{primeiro_nome}}! Tudo bem? Estou retomando contato para saber se ainda possui demanda de *{{titulo_oportunidade}}*. Temos novas disponibilidades de agenda para este mês.`,
      formal: `Prezado(a) {{nome}},

Retomamos contato com o intuito de verificar se sua empresa possui novas demandas no escopo de *{{titulo_oportunidade}}*. Teremos grande satisfação em renovar nossa parceria.`,
    },
  },
  {
    id: 'fechamento_especial',
    title: '8. Incentivo de Fechamento / Condição Especial',
    category: 'fechamento',
    suggestedStage: 'em_negociacao',
    description: 'Gera senso de urgência saudável para fechar antes do fim do mês ou fechamento de agenda.',
    variants: {
      amigavel: `Oi, {{primeiro_nome}}! Tudo bem?

Estamos fechando nosso cronograma de entregas desta semana. Se conseguirmos confirmar sua proposta de *{{titulo_oportunidade}}* ({{valor}}) até amanhã, consigo te garantir prioridade na execução e frete/bônus gratuito!

Podemos dar o pontapé inicial?`,
      direto: `Olá, {{primeiro_nome}}! Confirmando a proposta de *{{titulo_oportunidade}}* até amanhã, consigo manter o valor de {{valor}} com prioridade máxima de atendimento. Vamos fechar?`,
      formal: `Prezado(a) {{nome}},

Notificamos que as condições da proposta para *{{titulo_oportunidade}}* estarão garantidas para aprovação até o encerramento desta semana. Ficamos no aguardo de sua confirmação.`,
    },
  },
  {
    id: 'confirmacao_boas_vindas',
    title: '9. Confirmação de Fechamento & Próximos Passos',
    category: 'confirmacao',
    suggestedStage: 'ganho',
    description: 'Comemora o negócio fechado e alinha prazos e entrega com transparência.',
    variants: {
      amigavel: `Que alegria, {{primeiro_nome}}! Parabéns pela decisão e muito obrigado pela confiança! 🎉

O projeto de *{{titulo_oportunidade}}* está confirmado por aqui.

Os próximos passos:
1. Emissão do comprovante/nota
2. Início das etapas conforme cronograma alinhado

Qualquer dúvida no caminho, estou sempre à sua disposição!`,
      direto: `Confirmado, {{primeiro_nome}}! Projeto de *{{titulo_oportunidade}}* iniciado com sucesso.

Já registramos todos os itens e daremos andamento no cronograma. Obrigado pela parceria!`,
      formal: `Prezado(a) {{nome}},

Acusamos a formalização e aprovação da proposta para *{{titulo_oportunidade}}*.

Iniciaremos prontamente os procedimentos contratuais e operacionais. Agradecemos a confiança depositada na *{{minha_empresa}}*.`,
    },
  },
  {
    id: 'pos_venda_feedback',
    title: '10. Pós-Venda e Solicitação de Avaliação',
    category: 'pos_venda',
    suggestedStage: 'ganho',
    description: 'Garantir satisfação após a entrega e conquistar recomendações/avaliações no Google.',
    variants: {
      amigavel: `Olá, {{primeiro_nome}}! Tudo maravilhoso por aí?

Aqui é o(a) {{meu_nome}} da {{minha_empresa}}. Passando para saber como ficou o resultado final do serviço de *{{titulo_oportunidade}}*. Ficou 100% como você queria?

Se puder deixar uma rápida avaliação no nosso perfil ou indicar para um amigo, nos ajuda imensamente! Muito obrigado mais uma vez! 🙏`,
      direto: `Olá, {{primeiro_nome}}! Gostaria de confirmar se o serviço de *{{titulo_oportunidade}}* atendeu plenamente às suas expectativas. Sua avaliação é muito importante para nós!`,
      formal: `Prezado(a) {{nome}},

Concluída a entrega de *{{titulo_oportunidade}}*, gostaríamos de registrar vossa avaliação sobre a qualidade e atendimento prestados.

Agradecemos imensamente a preferência.`,
    },
  },
];

export function fillTemplateVariables(
  templateText: string,
  client?: Client,
  opportunity?: Opportunity,
  settings?: UserSettings
): string {
  let result = templateText;

  const fullName = client?.name?.trim() || 'Cliente';
  const firstName = fullName.split(' ')[0] || 'Cliente';
  const clientCompany = client?.company?.trim() || '';
  const oppTitle = opportunity?.title?.trim() || 'orçamento';
  const oppValue = opportunity?.value ? formatBRL(opportunity.value) : 'conforme combinado';
  const userName = settings?.userName?.trim() || 'Equipe Comercial';
  const businessName = settings?.businessName?.trim() || 'Nossa Empresa';

  result = result.replace(/\{\{nome\}\}/g, fullName);
  result = result.replace(/\{\{primeiro_nome\}\}/g, firstName);
  result = result.replace(/\{\{empresa\}\}/g, clientCompany ? `da ${clientCompany}` : '');
  result = result.replace(/\{\{titulo_oportunidade\}\}/g, oppTitle);
  result = result.replace(/\{\{valor\}\}/g, oppValue);
  result = result.replace(/\{\{meu_nome\}\}/g, userName);
  result = result.replace(/\{\{minha_empresa\}\}/g, businessName);

  return result;
}
