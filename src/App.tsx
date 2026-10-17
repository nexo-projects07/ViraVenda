/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Client,
  Opportunity,
  OpportunityStage,
  FollowUpTask,
  ActivityLog,
  ActivityType,
  LostReason,
  UserSettings,
  ActiveTab,
  ToastMessage,
} from './types';
import {
  loadStoredData,
  saveStoredData,
  clearAllData,
  resetToDemoData,
  DEFAULT_USER_SETTINGS,
} from './utils/storage';
import { getFollowUpStatus, formatBRL } from './utils/formatters';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { ClientModal } from './components/ClientModal';
import { OpportunityModal } from './components/OpportunityModal';
import { TaskModal } from './components/TaskModal';
import { LostReasonModal } from './components/LostReasonModal';

import { DashboardView } from './components/DashboardView';
import { ClientsView } from './components/ClientsView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { FollowUpsView } from './components/FollowUpsView';
import { MessagesView } from './components/MessagesView';
import { ReportsView } from './components/ReportsView';
import { SettingsBackupView } from './components/SettingsBackupView';

export default function App() {
  // Estado principal
  const [clients, setClients] = useState<Client[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Navegação
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Modais
  const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const [isOppModalOpen, setIsOppModalOpen] = useState<boolean>(false);
  const [oppToEdit, setOppToEdit] = useState<Opportunity | null>(null);
  const [defaultClientIdForOpp, setDefaultClientIdForOpp] = useState<string | undefined>(undefined);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<FollowUpTask | null>(null);
  const [defaultClientIdForTask, setDefaultClientIdForTask] = useState<string | undefined>(undefined);
  const [defaultOppIdForTask, setDefaultOppIdForTask] = useState<string | undefined>(undefined);

  const [lostReasonModalOpp, setLostReasonModalOpp] = useState<Opportunity | null>(null);

  // Modal de Confirmação genérico
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Pré-seleção para envio de mensagem
  const [messagePreselection, setMessagePreselection] = useState<{
    clientId?: string;
    oppId?: string;
  }>({});

  // Notificações Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper para adicionar entrada no log de atividades
  const logActivity = useCallback(
    (
      type: ActivityType,
      title: string,
      description: string,
      clientId?: string,
      opportunityId?: string,
      meta?: Record<string, any>
    ) => {
      const newAct: ActivityLog = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        type,
        title,
        description,
        timestamp: new Date().toISOString(),
        clientId,
        opportunityId,
        meta,
      };
      setActivities((prev) => [newAct, ...prev.slice(0, 99)]);
    },
    []
  );

  // Carregamento inicial do localStorage
  useEffect(() => {
    const data = loadStoredData();
    setClients(data.clients);
    setOpportunities(data.opportunities);
    setTasks(data.tasks);
    setActivities(data.activities);
    setSettings(data.settings);
    setIsDemo(data.isDemo);
    setIsLoaded(true);
  }, []);

  // Salvar no localStorage sempre que os dados mudarem após a carga inicial
  useEffect(() => {
    if (isLoaded) {
      saveStoredData(clients, opportunities, tasks, activities, settings, isDemo);
    }
  }, [clients, opportunities, tasks, activities, settings, isDemo, isLoaded]);

  // Contagem de follow-ups atrasados e para hoje (soma tarefas pendentes e opps)
  let overdueCount = 0;
  let todayCount = 0;
  tasks.forEach((t) => {
    if (t.status === 'pendente') {
      const st = getFollowUpStatus(t.dueDate);
      if (st.isOverdue) overdueCount++;
      if (st.isToday) todayCount++;
    }
  });

  // --- Ações de Clientes ---
  const handleOpenNewClient = () => {
    setClientToEdit(null);
    setIsClientModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    setIsClientModalOpen(true);
  };

  const handleSaveClient = (
    clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    const now = new Date().toISOString();
    if (id) {
      // Edição
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...clientData, updatedAt: now } : c))
      );
      logActivity('client_updated', 'Cliente Atualizado', `Dados de ${clientData.name} foram atualizados.`, id);
      showToast('Cliente atualizado com sucesso!', 'success');
    } else {
      // Novo
      const newClient: Client = {
        id: `cli-${Date.now()}`,
        ...clientData,
        createdAt: now,
        updatedAt: now,
      };
      setClients((prev) => [newClient, ...prev]);
      logActivity('client_created', 'Novo Cliente Cadastrado', `${newClient.name} foi adicionado à base.`, newClient.id);
      showToast('Cliente cadastrado com sucesso!', 'success');

      // Se foi aberto enquanto criava oportunidade ou tarefa
      if (isOppModalOpen) setDefaultClientIdForOpp(newClient.id);
      if (isTaskModalOpen) setDefaultClientIdForTask(newClient.id);
    }
    setIsClientModalOpen(false);
    setClientToEdit(null);
  };

  const handleDeleteClient = (client: Client) => {
    const linkedOpps = opportunities.filter((o) => o.clientId === client.id);
    const linkedTasks = tasks.filter((t) => t.clientId === client.id);
    const message =
      linkedOpps.length > 0 || linkedTasks.length > 0
        ? `Tem certeza que deseja excluir ${client.name}? Existem ${linkedOpps.length} proposta(s) e ${linkedTasks.length} tarefa(s) vinculadas que também serão removidas para preservar a integridade.`
        : `Deseja realmente remover o cliente ${client.name}? Esta ação não pode ser desfeita.`;

    setConfirmModal({
      isOpen: true,
      title: 'Excluir Cliente',
      message,
      confirmLabel: 'Sim, excluir',
      isDestructive: true,
      onConfirm: () => {
        setClients((prev) => prev.filter((c) => c.id !== client.id));
        setOpportunities((prev) => prev.filter((o) => o.clientId !== client.id));
        setTasks((prev) => prev.filter((t) => t.clientId !== client.id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        logActivity('client_deleted', 'Cliente Excluído', `${client.name} e dados vinculados foram removidos.`);
        showToast('Cliente e dados vinculados excluídos.', 'info');
      },
    });
  };

  // --- Ações de Oportunidades ---
  const handleOpenNewOpportunity = (clientId?: string) => {
    setOppToEdit(null);
    setDefaultClientIdForOpp(clientId);
    setIsOppModalOpen(true);
  };

  const handleEditOpportunity = (opp: Opportunity) => {
    setOppToEdit(opp);
    setIsOppModalOpen(true);
  };

  const handleSaveOpportunity = (
    oppData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    const now = new Date().toISOString();
    const client = clients.find((c) => c.id === oppData.clientId);

    if (id) {
      // Edição
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...oppData, updatedAt: now } : o))
      );
      logActivity(
        'opportunity_updated',
        'Oportunidade Atualizada',
        `"${oppData.title}" (${formatBRL(oppData.value)}) atualizada para ${client?.name || 'cliente'}.`,
        oppData.clientId,
        id
      );
      showToast('Oportunidade atualizada com sucesso!', 'success');
    } else {
      // Novo
      const newOpp: Opportunity = {
        id: `opp-${Date.now()}`,
        ...oppData,
        createdAt: now,
        updatedAt: now,
      };
      setOpportunities((prev) => [newOpp, ...prev]);

      // Cria automaticamente uma tarefa de acompanhamento inicial se houver nextFollowUpDate
      if (newOpp.nextFollowUpDate && newOpp.stage !== 'ganho' && newOpp.stage !== 'perdido') {
        const autoTask: FollowUpTask = {
          id: `tsk-${Date.now()}`,
          clientId: newOpp.clientId,
          opportunityId: newOpp.id,
          title: `Acompanhar proposta: ${newOpp.title}`,
          dueDate: newOpp.nextFollowUpDate,
          status: 'pendente',
          createdAt: now,
          updatedAt: now,
        };
        setTasks((prev) => [autoTask, ...prev]);
      }

      logActivity(
        'opportunity_created',
        'Novo Orçamento Criado',
        `"${newOpp.title}" no valor de ${formatBRL(newOpp.value)} registrado para ${client?.name || 'cliente'}.`,
        newOpp.clientId,
        newOpp.id
      );
      showToast('Orçamento/Oportunidade cadastrado com sucesso!', 'success');
    }
    setIsOppModalOpen(false);
    setOppToEdit(null);
    setDefaultClientIdForOpp(undefined);
  };

  const handleDeleteOpportunity = (opp: Opportunity) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Oportunidade',
      message: `Tem certeza que deseja excluir o orçamento "${opp.title}" no valor de ${formatBRL(opp.value)}?`,
      confirmLabel: 'Sim, excluir',
      isDestructive: true,
      onConfirm: () => {
        setOpportunities((prev) => prev.filter((o) => o.id !== opp.id));
        setTasks((prev) => prev.filter((t) => t.opportunityId !== opp.id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        logActivity('opportunity_updated', 'Oportunidade Removida', `"${opp.title}" foi excluída.`, opp.clientId, opp.id);
        showToast('Oportunidade excluída com sucesso.', 'info');
      },
    });
  };

  const handleChangeOpportunityStage = (oppId: string, newStage: OpportunityStage) => {
    const opp = opportunities.find((o) => o.id === oppId);
    if (!opp) return;

    if (newStage === 'perdido') {
      setLostReasonModalOpp(opp);
      return;
    }

    const now = new Date().toISOString();
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id === oppId) {
          return {
            ...o,
            stage: newStage,
            closedAt: newStage === 'ganho' ? now : undefined,
            completedFollowUp: newStage === 'ganho',
            updatedAt: now,
          };
        }
        return o;
      })
    );

    if (newStage === 'ganho') {
      logActivity(
        'opportunity_won',
        'Venda Fechada! 🎉',
        `"${opp.title}" fechada no valor de ${formatBRL(opp.value)}!`,
        opp.clientId,
        opp.id,
        { value: opp.value }
      );
      showToast(`Parabéns! Venda de ${formatBRL(opp.value)} registrada como Ganha! 🎉`, 'success');
    } else {
      logActivity(
        'stage_changed',
        'Etapa Comercial Alterada',
        `"${opp.title}" avançou para ${newStage.replace('_', ' ')}.`,
        opp.clientId,
        opp.id
      );
      showToast('Etapa da proposta atualizada!', 'success');
    }
  };

  const handleConfirmLostReason = (reason: LostReason, details?: string) => {
    if (!lostReasonModalOpp) return;
    const opp = lostReasonModalOpp;
    const now = new Date().toISOString();

    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === opp.id
          ? {
              ...o,
              stage: 'perdido',
              lostReason: reason,
              lostReasonDetails: details,
              closedAt: now,
              completedFollowUp: true,
              updatedAt: now,
            }
          : o
      )
    );

    logActivity(
      'opportunity_lost',
      'Oportunidade Perdida',
      `"${opp.title}" encerrada. Motivo: ${reason}`,
      opp.clientId,
      opp.id
    );

    setLostReasonModalOpp(null);
    showToast('Oportunidade registrada como perdida e motivo armazenado.', 'info');
  };

  const handleReopenOpportunity = (oppId: string) => {
    const opp = opportunities.find((o) => o.id === oppId);
    if (!opp) return;

    const now = new Date().toISOString();
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === oppId
          ? {
              ...o,
              stage: 'em_negociacao',
              closedAt: undefined,
              lostReason: undefined,
              lostReasonDetails: undefined,
              completedFollowUp: false,
              updatedAt: now,
            }
          : o
      )
    );

    logActivity(
      'opportunity_reopened',
      'Oportunidade Reaberta',
      `"${opp.title}" reaberta e movida para "Em negociação".`,
      opp.clientId,
      opp.id
    );

    showToast('Oportunidade reaberta para Em Negociação!', 'success');
  };

  // --- Ações de Tarefas de Acompanhamento ---
  const handleOpenNewTask = (clientId?: string, oppId?: string) => {
    setTaskToEdit(null);
    setDefaultClientIdForTask(clientId);
    setDefaultOppIdForTask(oppId);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: FollowUpTask) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<FollowUpTask, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    const now = new Date().toISOString();
    if (id) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...taskData, updatedAt: now } : t))
      );
      showToast('Acompanhamento atualizado com sucesso!', 'success');
    } else {
      const newTask: FollowUpTask = {
        id: `tsk-${Date.now()}`,
        ...taskData,
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => [newTask, ...prev]);
      logActivity(
        'followup_created',
        'Retorno Agendado',
        `"${newTask.title}" agendado para ${newTask.dueDate}.`,
        newTask.clientId,
        newTask.opportunityId
      );
      showToast('Retorno agendado com sucesso!', 'success');
    }
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteTask = (task: FollowUpTask) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Acompanhamento',
      message: `Tem certeza que deseja remover o retorno "${task.title}"?`,
      confirmLabel: 'Sim, excluir',
      isDestructive: true,
      onConfirm: () => {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Acompanhamento removido.', 'info');
      },
    });
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const willBeCompleted = task.status !== 'concluida';
    const now = new Date().toISOString();

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: willBeCompleted ? 'concluida' : 'pendente',
              completedAt: willBeCompleted ? now : undefined,
              updatedAt: now,
            }
          : t
      )
    );

    if (willBeCompleted) {
      logActivity(
        'followup_completed',
        'Retorno Concluído',
        `Tarefa "${task.title}" foi marcada como realizada.`,
        task.clientId,
        task.opportunityId
      );
      showToast('Acompanhamento marcado como concluído!', 'success');
    } else {
      showToast('Acompanhamento reaberto como pendente.', 'info');
    }
  };

  const handleRescheduleTask = (taskId: string, newDate: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              dueDate: newDate,
              status: 'pendente',
              completedAt: undefined,
              updatedAt: now,
            }
          : t
      )
    );

    logActivity(
      'followup_rescheduled',
      'Retorno Reagendado',
      `"${task.title}" adiado para ${newDate}.`,
      task.clientId,
      task.opportunityId
    );

    showToast('Data do acompanhamento atualizada!', 'success');
  };

  // --- Ações de Mensagens ---
  const handleOpenMessageWithClient = (client: Client) => {
    const clientOpps = opportunities.filter((o) => o.clientId === client.id);
    const oppId = clientOpps.length > 0 ? clientOpps[0].id : undefined;
    setMessagePreselection({ clientId: client.id, oppId });
    setActiveTab('mensagens');
  };

  const handleOpenMessageWithOpp = (opp: Opportunity) => {
    setMessagePreselection({ clientId: opp.clientId, oppId: opp.id });
    setActiveTab('mensagens');
  };

  // --- Gerenciamento de Dados (Demonstração e Backup) ---
  const handleClearDemoData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Limpar Dados de Exemplo',
      message:
        'Deseja remover todos os clientes e propostas de exemplo para começar a cadastrar os clientes reais do seu negócio?',
      confirmLabel: 'Limpar e começar do zero',
      isDestructive: false,
      onConfirm: () => {
        clearAllData();
        setClients([]);
        setOpportunities([]);
        setTasks([]);
        setActivities([]);
        setIsDemo(false);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Ambiente limpo! Comece cadastrando seus primeiros clientes.', 'success');
      },
    });
  };

  const handleReloadDemoData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Recarregar Dados de Exemplo',
      message:
        'Isto substituirá as informações atuais por clientes, orçamentos e tarefas simulados. Deseja continuar?',
      confirmLabel: 'Recarregar Exemplos',
      isDestructive: false,
      onConfirm: () => {
        const demo = resetToDemoData();
        setClients(demo.clients);
        setOpportunities(demo.opportunities);
        setTasks(demo.tasks);
        setActivities(demo.activities);
        setSettings(demo.settings);
        setIsDemo(true);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Dados de demonstração restaurados.', 'info');
      },
    });
  };

  const handleResetAllData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Zerar Todos os Dados',
      message:
        'ATENÇÃO: Todos os clientes, orçamentos, tarefas e relatórios serão apagados permanentemente deste navegador. Certifique-se de ter feito um backup se desejar salvar alguma informação.',
      confirmLabel: 'Sim, apagar tudo',
      isDestructive: true,
      onConfirm: () => {
        clearAllData();
        setClients([]);
        setOpportunities([]);
        setTasks([]);
        setActivities([]);
        setIsDemo(false);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Todos os dados foram apagados com sucesso.', 'info');
      },
    });
  };

  const handleImportBackup = (data: {
    clients: Client[];
    opportunities: Opportunity[];
    tasks: FollowUpTask[];
    activities: ActivityLog[];
    settings: UserSettings;
  }) => {
    setClients(data.clients);
    setOpportunities(data.opportunities);
    setTasks(data.tasks);
    setActivities(data.activities);
    setSettings(data.settings);
    setIsDemo(false);
    saveStoredData(data.clients, data.opportunities, data.tasks, data.activities, data.settings, false);
    showToast('Backup restaurado e sincronizado com sucesso!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Lateral */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        overdueCount={overdueCount}
        todayCount={todayCount}
        isDemo={isDemo}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Conteúdo Principal com compensação da sidebar (w-64) no desktop */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Cabeçalho */}
        <Header
          activeTab={activeTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNewClient={handleOpenNewClient}
          onNewOpportunity={() => handleOpenNewOpportunity()}
          isDemo={isDemo}
          onClearDemo={handleClearDemoData}
        />

        {/* View Ativa */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              clients={clients}
              opportunities={opportunities}
              tasks={tasks}
              activities={activities}
              onNavigate={setActiveTab}
              onNewClient={handleOpenNewClient}
              onNewOpportunity={() => handleOpenNewOpportunity()}
              onNewTask={() => handleOpenNewTask()}
              onOpenMessageWithOpp={handleOpenMessageWithOpp}
              onQuickCompleteFollowUp={(oppId) => {
                const opp = opportunities.find((o) => o.id === oppId);
                if (opp) {
                  handleChangeOpportunityStage(oppId, 'orcamento_enviado');
                  showToast('Retorno marcado como realizado!', 'success');
                }
              }}
            />
          )}

          {activeTab === 'oportunidades' && (
            <OpportunitiesView
              opportunities={opportunities}
              clients={clients}
              onNewOpportunity={() => handleOpenNewOpportunity()}
              onEditOpportunity={handleEditOpportunity}
              onDeleteOpportunity={handleDeleteOpportunity}
              onChangeStage={handleChangeOpportunityStage}
              onReopenOpportunity={handleReopenOpportunity}
              onRequestLostReason={(opp) => setLostReasonModalOpp(opp)}
              onOpenMessageWithOpp={handleOpenMessageWithOpp}
            />
          )}

          {activeTab === 'clientes' && (
            <ClientsView
              clients={clients}
              opportunities={opportunities}
              tasks={tasks}
              activities={activities}
              onNewClient={handleOpenNewClient}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
              onNewOpportunityForClient={(clientId) => handleOpenNewOpportunity(clientId)}
              onNewTaskForClient={(clientId) => handleOpenNewTask(clientId)}
              onOpenMessageWithClient={handleOpenMessageWithClient}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'acompanhamentos' && (
            <FollowUpsView
              tasks={tasks}
              opportunities={opportunities}
              clients={clients}
              onNewTask={() => handleOpenNewTask()}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onToggleTaskStatus={handleToggleTaskStatus}
              onRescheduleTask={handleRescheduleTask}
              onOpenMessageWithOpp={handleOpenMessageWithOpp}
              onOpenMessageWithClient={handleOpenMessageWithClient}
            />
          )}

          {activeTab === 'mensagens' && (
            <MessagesView
              clients={clients}
              opportunities={opportunities}
              settings={settings}
              preselectedClientId={messagePreselection.clientId}
              preselectedOpportunityId={messagePreselection.oppId}
              onShowToast={showToast}
              onLogActivity={(title, desc, clientId, oppId) =>
                logActivity('message_prepared', title, desc, clientId, oppId)
              }
            />
          )}

          {activeTab === 'relatorios' && (
            <ReportsView
              clients={clients}
              opportunities={opportunities}
              tasks={tasks}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'configuracoes' && (
            <SettingsBackupView
              clients={clients}
              opportunities={opportunities}
              tasks={tasks}
              activities={activities}
              settings={settings}
              isDemo={isDemo}
              onUpdateSettings={setSettings}
              onClearDemoData={handleClearDemoData}
              onReloadDemoData={handleReloadDemoData}
              onResetAllData={handleResetAllData}
              onImportData={handleImportBackup}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Modal de Cliente */}
      <ClientModal
        isOpen={isClientModalOpen}
        clientToEdit={clientToEdit}
        onSave={handleSaveClient}
        onClose={() => {
          setIsClientModalOpen(false);
          setClientToEdit(null);
        }}
      />

      {/* Modal de Oportunidade */}
      <OpportunityModal
        isOpen={isOppModalOpen}
        opportunityToEdit={oppToEdit}
        defaultClientId={defaultClientIdForOpp}
        clients={clients}
        onSave={handleSaveOpportunity}
        onClose={() => {
          setIsOppModalOpen(false);
          setOppToEdit(null);
          setDefaultClientIdForOpp(undefined);
        }}
        onOpenQuickNewClient={() => {
          setClientToEdit(null);
          setIsClientModalOpen(true);
        }}
      />

      {/* Modal de Tarefa de Acompanhamento */}
      <TaskModal
        isOpen={isTaskModalOpen}
        taskToEdit={taskToEdit}
        clients={clients}
        opportunities={opportunities}
        defaultClientId={defaultClientIdForTask}
        defaultOpportunityId={defaultOppIdForTask}
        onSave={handleSaveTask}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
          setDefaultClientIdForTask(undefined);
          setDefaultOppIdForTask(undefined);
        }}
      />

      {/* Modal de Motivo da Perda */}
      <LostReasonModal
        isOpen={!!lostReasonModalOpp}
        opportunity={lostReasonModalOpp}
        onConfirm={handleConfirmLostReason}
        onCancel={() => setLostReasonModalOpp(null)}
      />

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
