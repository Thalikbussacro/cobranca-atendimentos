import { useState } from 'react'
import { useCobrancas } from '@/hooks/useCobrancas'
import { useEmailSending } from '@/hooks/useEmailSending'
import { cancelarCobranca, cancelarTodasCobrancas } from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'
import { TabelaCobrancas } from '@/components/TabelaCobrancas'
import { FiltrosPeriodo } from '@/components/FiltrosPeriodo'
import { ProgressModal } from '@/components/ProgressModal'
import { ConfirmModal } from '@/components/ConfirmModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Send, Search, Trash2, FileText, Mail, Clock } from 'lucide-react'

export default function CobrancasPage() {
  const { cobrancas, loading, filters, setFilters, refresh } = useCobrancas()
  const addToast = useToastStore((s) => s.addToast)
  const {
    enviandoEmailId,
    enviandoTodas,
    progresso,
    handleEnviarEmail,
    handleEnviarTodas,
    handleCancelarEnvio,
    fecharProgresso,
  } = useEmailSending({ cobrancas, onSuccess: refresh })

  const [confirmState, setConfirmState] = useState({ open: false, title: '', message: '', onConfirm: null })

  const closeConfirm = () => setConfirmState({ open: false, title: '', message: '', onConfirm: null })

  const handleCancelarCobranca = (id) => {
    setConfirmState({
      open: true,
      title: 'Cancelar cobrança',
      message: 'Tem certeza que deseja cancelar esta cobrança? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        closeConfirm()
        try {
          await cancelarCobranca(id)
          addToast('success', 'Cobrança cancelada com sucesso')
          await refresh()
        } catch (error) {
          addToast('error', error.message || 'Erro ao cancelar cobrança')
        }
      },
    })
  }

  const handleCancelarTodas = () => {
    const pendentes = cobrancas.filter((c) => !c.emailEnviado).length
    if (pendentes === 0) {
      addToast('info', 'Nenhuma cobrança pendente para cancelar.')
      return
    }
    setConfirmState({
      open: true,
      title: 'Cancelar todas pendentes',
      message: `Tem certeza que deseja cancelar ${pendentes} cobrança(s) pendente(s)? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        closeConfirm()
        try {
          const data = await cancelarTodasCobrancas()
          addToast('success', data.message || 'Cobranças canceladas com sucesso')
          await refresh()
        } catch (error) {
          addToast('error', error.message || 'Erro ao cancelar cobranças')
        }
      },
    })
  }

  // Stats
  const totalCobrancas = cobrancas.length
  const enviadas = cobrancas.filter((c) => c.emailEnviado).length
  const pendentes = totalCobrancas - enviadas

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Cobranças</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie as cobranças de atendimento</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCancelarTodas}
              disabled={enviandoTodas || enviandoEmailId !== null}
              className="text-xs md:text-sm h-9 md:h-10 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1.5 md:mr-2" />
              <span className="hidden sm:inline">Cancelar Pendentes</span>
              <span className="sm:hidden">Cancelar</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleEnviarTodas}
              disabled={enviandoTodas || enviandoEmailId !== null}
              className="text-xs md:text-sm h-9 md:h-10"
            >
              <Send className="h-4 w-4 mr-1.5 md:mr-2" />
              <span className="hidden sm:inline">Enviar Todos Pendentes</span>
              <span className="sm:hidden">Enviar Todos</span>
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        {totalCobrancas > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="flex items-center gap-3 bg-white border rounded-lg px-4 py-3">
              <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{totalCobrancas}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border rounded-lg px-4 py-3">
              <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{enviadas}</p>
                <p className="text-xs text-gray-500">Enviadas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border rounded-lg px-4 py-3">
              <div className="h-9 w-9 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{pendentes}</p>
                <p className="text-xs text-gray-500">Pendentes</p>
              </div>
            </div>
          </div>
        )}

        <FiltrosPeriodo onGerado={refresh} />

        {/* Filtros da listagem */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-4 md:mb-6">
          <div className="flex-1 w-full sm:max-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9 h-9 md:h-10 text-sm"
              />
            </div>
          </div>

          <div className="w-full sm:w-auto sm:min-w-[150px]">
            <Label className="text-xs mb-1 block">Status</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="enviado">E-mail Enviado</SelectItem>
                <SelectItem value="nao-enviado">Não Enviado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <TabelaCobrancas
            cobrancas={cobrancas}
            loading={loading}
            onEnviarEmail={handleEnviarEmail}
            enviandoEmailId={enviandoEmailId}
            onCancelar={handleCancelarCobranca}
          />
        </div>
      </div>

      <ProgressModal
        progresso={progresso}
        onCancelar={handleCancelarEnvio}
        onFechar={fecharProgresso}
      />

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel="Sim, cancelar"
        onConfirm={confirmState.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  )
}
