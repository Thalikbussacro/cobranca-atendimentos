'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCobrancas } from '@/hooks/useCobrancas'
import { Toolbar } from '@/components/cobrancas/Toolbar'
import { CobrancaTable } from '@/components/cobrancas/CobrancaTable'
import { AlertBar } from '@/components/layout/AlertBar'
import { ChatModal } from '@/components/chat/ChatModal'
import { ActionConfirmModal, actionConfigs } from '@/components/modals/ActionConfirmModal'
import { AtendimentoDetailModal } from '@/components/modals/AtendimentoDetailModal'
import { Cobranca, AtendimentoItem } from '@/domain/entities/Cobranca'

type AdminAction = 'enviar' | 'enviar-todos' | 'gerar-fatura' | 'pagar' | 'finalizar' | null

export default function CobrancasPage() {
  const router = useRouter()
  const { cobrancas, loading, filters, setFilters } = useCobrancas()
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedCobranca, setSelectedCobranca] = useState<Cobranca | null>(null)
  const [actionModal, setActionModal] = useState<{ open: boolean; type: AdminAction; cobranca: Cobranca | null }>({
    open: false,
    type: null,
    cobranca: null,
  })
  const [atendimentoModal, setAtendimentoModal] = useState<{
    open: boolean
    atendimento: AtendimentoItem | null
    cobranca: Cobranca | null
  }>({
    open: false,
    atendimento: null,
    cobranca: null,
  })

  const handleOpenChat = (cobranca: Cobranca) => {
    setSelectedCobranca(cobranca)
    setChatOpen(true)
  }

  const handleAction = (action: string, cobrancaId: number) => {
    const cobranca = cobrancas.find((c) => c.id === cobrancaId)
    if (!cobranca) return

    const actionMap: Record<string, AdminAction> = {
      'enviar': 'enviar',
      'gerar-fatura': 'gerar-fatura',
      'pagar': 'pagar',
      'finalizar': 'finalizar',
    }

    const actionType = actionMap[action]
    if (actionType) {
      setActionModal({ open: true, type: actionType, cobranca })
    } else {
      // Ações que não precisam de confirmação
      console.log(`Executando ação ${action} para cobrança ${cobrancaId}`)
    }
  }

  const handleEnviarTodas = () => {
    setActionModal({ open: true, type: 'enviar-todos', cobranca: null })
  }

  const handleConfirmAction = async () => {
    if (!actionModal.type) return

    // Simular ação
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    console.log(`Ação ${actionModal.type} confirmada`, actionModal.cobranca?.id)
    
    setActionModal({ open: false, type: null, cobranca: null })
    setShowSuccessAlert(true)
  }

  const handleAtendimentoClick = (atendimento: AtendimentoItem, cobranca: Cobranca) => {
    setAtendimentoModal({ open: true, atendimento, cobranca })
  }

  const getActionConfig = () => {
    switch (actionModal.type) {
      case 'enviar':
        return actionConfigs.enviarEmail
      case 'enviar-todos':
        return actionConfigs.enviarTodosEmails
      case 'gerar-fatura':
        return actionConfigs.gerarFatura
      case 'pagar':
        return actionConfigs.marcarPago
      case 'finalizar':
        return actionConfigs.finalizarCobranca
      default:
        return actionConfigs.enviarEmail
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando cobranças...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Título da página */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Cobranças</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Gerencie cobranças por período e envie automaticamente aos clientes.
        </p>
      </div>

      {/* Alerta de sucesso */}
      {showSuccessAlert && (
        <AlertBar
          variant="success"
          title="Ação realizada com sucesso!"
          description="A operação foi concluída. Os dados serão atualizados em breve."
          onDismiss={() => setShowSuccessAlert(false)}
        />
      )}

      {/* Toolbar */}
      <Toolbar
        search={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        status={filters.status}
        onStatusChange={(value) => setFilters({ ...filters, status: value })}
        onNewCobranca={() => router.push('/nova-cobranca')}
        onEnviarTodas={handleEnviarTodas}
      />

      {/* Tabela */}
      <CobrancaTable 
        cobrancas={cobrancas} 
        onAction={handleAction}
        onChat={handleOpenChat}
        onAtendimentoClick={handleAtendimentoClick}
      />

      {/* Modal de Chat */}
      {selectedCobranca && (
        <ChatModal
          open={chatOpen}
          onOpenChange={setChatOpen}
          cobrancaId={selectedCobranca.id}
          clienteNome={selectedCobranca.cliente}
          isClienteView={false}
        />
      )}

      {/* Modal de Confirmação de Ação */}
      {actionModal.type && (
        <ActionConfirmModal
          open={actionModal.open}
          onOpenChange={(open) => setActionModal({ ...actionModal, open })}
          {...getActionConfig()}
          onConfirm={handleConfirmAction}
        />
      )}

      {/* Modal de Detalhes do Atendimento */}
      <AtendimentoDetailModal
        open={atendimentoModal.open}
        onOpenChange={(open) => setAtendimentoModal({ ...atendimentoModal, open })}
        atendimento={atendimentoModal.atendimento}
        clienteNome={atendimentoModal.cobranca?.cliente}
        cobrancaId={atendimentoModal.cobranca?.id}
      />
    </div>
  )
}
