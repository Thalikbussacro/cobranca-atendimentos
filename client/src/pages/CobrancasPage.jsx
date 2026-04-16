import { useCobrancas } from '@/hooks/useCobrancas'
import { useEmailSending } from '@/hooks/useEmailSending'
import { cancelarCobranca, cancelarTodasCobrancas } from '@/services/api'
import { TabelaCobrancas } from '@/components/TabelaCobrancas'
import { FiltrosPeriodo } from '@/components/FiltrosPeriodo'
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
import { Send, Search, X, Trash2 } from 'lucide-react'

export default function CobrancasPage() {
  const { cobrancas, filters, setFilters, refresh } = useCobrancas()
  const {
    enviandoEmailId,
    enviandoTodas,
    progresso,
    alerta,
    setAlerta,
    handleEnviarEmail,
    handleEnviarTodas,
    handleCancelarEnvio,
    fecharProgresso,
  } = useEmailSending({ cobrancas, onSuccess: refresh })

  const handleCancelarCobranca = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta cobrança?')) return
    try {
      await cancelarCobranca(id)
      setAlerta('Cobrança cancelada com sucesso')
      await refresh()
    } catch (error) {
      setAlerta(`Erro: ${error.message}`)
    }
  }

  const handleCancelarTodas = async () => {
    const pendentes = cobrancas.filter((c) => !c.emailEnviado).length
    if (pendentes === 0) {
      setAlerta('Nenhuma cobrança pendente para cancelar.')
      return
    }
    if (!window.confirm(`Cancelar ${pendentes} cobrança(s) pendente(s)?`)) return
    try {
      const data = await cancelarTodasCobrancas()
      setAlerta(data.message || 'Cobranças canceladas com sucesso')
      await refresh()
    } catch (error) {
      setAlerta(`Erro: ${error.message}`)
    }
  }

  const progressoFinalizado = progresso && progresso.atual === null
  const progressoPct = progresso
    ? Math.round(((progresso.enviadas + progresso.erros) / progresso.total) * 100)
    : 0

  return (
    <div className="flex flex-col h-full">
      {alerta && (
        <div className="relative mb-4 mx-4 md:mx-6 mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
          {alerta}
          <button
            onClick={() => setAlerta(null)}
            className="absolute right-2 top-2 text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
        <div className="mb-4 md:mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Cobranças</h1>
            <p className="text-sm text-gray-600 mt-1">Gerencie as cobranças de atendimento</p>
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

        {progresso && (
          <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">
                {progressoFinalizado
                  ? `Concluído: ${progresso.enviadas} enviado(s)${progresso.erros > 0 ? `, ${progresso.erros} erro(s)` : ''}`
                  : `Enviando ${progresso.enviadas + progresso.erros + 1} de ${progresso.total}...`}
              </span>
              {progressoFinalizado ? (
                <button
                  onClick={fecharProgresso}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleCancelarEnvio}
                >
                  Cancelar
                </Button>
              )}
            </div>
            {progresso.atual && (
              <p className="text-xs text-blue-600 mb-2 truncate">
                {progresso.atual}
              </p>
            )}
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressoPct}%` }}
              />
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
            onEnviarEmail={handleEnviarEmail}
            enviandoEmailId={enviandoEmailId}
            onCancelar={handleCancelarCobranca}
          />
        </div>
      </div>
    </div>
  )
}
