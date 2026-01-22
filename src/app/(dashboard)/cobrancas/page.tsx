'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCobrancas } from '@/hooks/useCobrancas'
import { KPICards } from '@/components/cobrancas/KPICards'
import { Toolbar } from '@/components/cobrancas/Toolbar'
import { CobrancaTable } from '@/components/cobrancas/CobrancaTable'
import { ChatModal } from '@/components/modals/ChatModal'
import { ActionModal } from '@/components/modals/ActionModal'
import { Card, CardBody } from '@heroui/react'

export default function CobrancasPage() {
  const router = useRouter()
  const { cobrancas, loading, filters, setFilters, getKPIs } = useCobrancas()
  const [chatCobrancaId, setChatCobrancaId] = useState<number | null>(null)
  const [actionModal, setActionModal] = useState({ isOpen: false, title: '', description: '' })

  const kpis = getKPIs()

  const handleChatOpen = (cobrancaId: number) => {
    setChatCobrancaId(cobrancaId)
  }

  const handleAction = (action: string, description: string) => {
    setActionModal({ isOpen: true, title: action, description })
  }

  const chatCobranca = cobrancas.find((c) => c.id === chatCobrancaId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-default-500 font-semibold">Carregando cobranças...</div>
      </div>
    )
  }

  if (cobrancas.length === 0) {
    return (
      <Card shadow="none" className="border border-default-200">
        <CardBody>
          <div className="text-center py-12">
            <div className="text-default-600 font-semibold mb-2">Nenhuma cobrança encontrada</div>
            <div className="text-sm text-default-500">
              {filters.search || filters.status
                ? 'Tente ajustar os filtros de busca.'
                : 'Crie uma nova cobrança para começar.'}
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <>
      <KPICards
        aberto={kpis.aberto}
        aguardandoNF={kpis.aguardandoNF}
        enviadas={kpis.enviadas}
        pagas={kpis.pagas}
      />

      <Card shadow="none" className="border border-default-200">
        <CardBody className="gap-3">
          <Toolbar
            search={filters.search}
            onSearchChange={(value) => setFilters({ ...filters, search: value })}
            status={filters.status}
            onStatusChange={(value) => setFilters({ ...filters, status: value })}
            onNewCobranca={() => router.push('/nova-cobranca')}
          />

          <CobrancaTable
            cobrancas={cobrancas}
            onChatOpen={handleChatOpen}
            onAction={handleAction}
          />

          <div className="text-xs text-default-500">
            Clique em <b>Detalhes</b> para expandir e ver atendimentos e ações disponíveis.
          </div>
        </CardBody>
      </Card>

      <ChatModal
        isOpen={chatCobrancaId !== null}
        onClose={() => setChatCobrancaId(null)}
        cobrancaId={chatCobrancaId}
        clienteNome={chatCobranca?.cliente || ''}
      />

      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, title: '', description: '' })}
        title={actionModal.title}
        description={actionModal.description}
      />
    </>
  )
}
