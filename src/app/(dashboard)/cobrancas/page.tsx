'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCobrancas } from '@/hooks/useCobrancas'
import { Toolbar } from '@/components/cobrancas/Toolbar'
import { CobrancaTable } from '@/components/cobrancas/CobrancaTable'
import { AlertBar } from '@/components/layout/AlertBar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function CobrancasPage() {
  const router = useRouter()
  const { cobrancas, loading, filters, setFilters } = useCobrancas()
  const [showSuccessAlert, setShowSuccessAlert] = useState(true)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: string; id: number | null }>({
    open: false,
    action: '',
    id: null,
  })

  const handleAction = (action: string, cobrancaId: number) => {
    if (action === 'chat') {
      // Abrir chat
      console.log('Abrir chat para cobrança', cobrancaId)
    } else {
      setActionDialog({ open: true, action, id: cobrancaId })
    }
  }

  const handleEnviarTodas = async () => {
    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowSuccessAlert(true)
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Cobranças</h2>
        <p className="text-muted-foreground">
          Gerencie cobranças por período e envie automaticamente aos clientes o e-mails.
        </p>
      </div>

      {/* Alerta de sucesso */}
      {showSuccessAlert && (
        <AlertBar
          variant="warning"
          title="Cobranças geradas com sucesso!"
          description="As cobranças um email automático com a cobrança o o veta laios da para da cliente o envie operados."
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
      {cobrancas.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma cobrança encontrada. Crie uma nova cobrança para começar.
        </div>
      ) : (
        <CobrancaTable cobrancas={cobrancas} onAction={handleAction} />
      )}

      {/* Dialog de Ação */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Ação</DialogTitle>
            <DialogDescription>
              Deseja executar a ação "{actionDialog.action}" para a cobrança #{actionDialog.id}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, action: '', id: null })}>
              Cancelar
            </Button>
            <Button onClick={() => {
              console.log('Executar', actionDialog.action, actionDialog.id)
              setActionDialog({ open: false, action: '', id: null })
            }}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
