import { useState } from 'react'
import { useCobrancas } from '@/hooks/useCobrancas'
import { TabelaCobrancas } from '@/components/TabelaCobrancas'
import { FiltrosPeriodo } from '@/components/FiltrosPeriodo'
import { AlertBar } from '@/components/layout/AlertBar'
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
import { Send, Search } from 'lucide-react'
import { enviarEmail, enviarTodas } from '@/services/api'

export default function CobrancasPage() {
  const { cobrancas, filters, setFilters, refresh } = useCobrancas()
  const [alerta, setAlerta] = useState(null)
  const [enviandoEmailId, setEnviandoEmailId] = useState(null)
  const [enviandoTodas, setEnviandoTodas] = useState(false)

  const showAlerta = (description) => {
    setAlerta(description)
  }

  const handleEnviarEmail = async (cobrancaId) => {
    try {
      setEnviandoEmailId(cobrancaId)
      const data = await enviarEmail(cobrancaId)
      showAlerta(data.message || 'E-mail enviado com sucesso!')
      await refresh()
    } catch (error) {
      showAlerta(`Erro: ${error.message}`)
    } finally {
      setEnviandoEmailId(null)
    }
  }

  const handleEnviarTodas = async () => {
    try {
      setEnviandoTodas(true)
      const data = await enviarTodas()
      showAlerta(data.message || 'E-mails enviados com sucesso!')
      await refresh()
    } catch (error) {
      showAlerta(`Erro: ${error.message}`)
    } finally {
      setEnviandoTodas(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {alerta && (
        <AlertBar
          title="Notificação"
          description={alerta}
          variant="success"
          onDismiss={() => setAlerta(null)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
        <div className="mb-4 md:mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Cobranças</h1>
            <p className="text-sm text-gray-600 mt-1">Gerencie as cobranças de atendimento</p>
          </div>
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

        <div className="flex-1 overflow-hidden">
          <TabelaCobrancas
            cobrancas={cobrancas}
            onEnviarEmail={handleEnviarEmail}
            enviandoEmailId={enviandoEmailId}
          />
        </div>
      </div>
    </div>
  )
}
