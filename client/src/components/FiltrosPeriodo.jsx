import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { getAllClientes, getPreview, gerarCobrancas } from '@/services/api'

export function FiltrosPeriodo({ onGerado }) {
  const [aberto, setAberto] = useState(false)
  const [clientes, setClientes] = useState([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [form, setForm] = useState({
    clienteId: 'todos',
    dataInicial: '',
    dataFinal: '',
    precoHora: '',
  })
  const [preview, setPreview] = useState(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (aberto && clientes.length === 0) {
      carregarClientes()
    }
  }, [aberto])

  const carregarClientes = async () => {
    setLoadingClientes(true)
    try {
      const data = await getAllClientes()
      setClientes(data.clientes)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setLoadingClientes(false)
    }
  }

  const handleVerPreview = async (e) => {
    e.preventDefault()
    setErro('')

    if (!form.dataInicial || !form.dataFinal || !form.precoHora) {
      setErro('Preencha todos os campos')
      return
    }

    setLoadingPreview(true)
    setPreview(null)

    try {
      const data = await getPreview({
        clienteId: form.clienteId,
        dataInicial: form.dataInicial,
        dataFinal: form.dataFinal,
      })
      setPreview(data.preview)
    } catch (error) {
      setErro(error.message || 'Erro ao carregar preview')
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleGerar = async () => {
    if (!preview?.length) return
    setGerando(true)
    setErro('')

    try {
      const clienteIds = preview.map((item) => item.clienteId)
      await gerarCobrancas({
        clienteIds,
        inicio: form.dataInicial,
        fim: form.dataFinal,
        precoHora: parseFloat(form.precoHora),
      })

      setPreview(null)
      setForm({ clienteId: 'todos', dataInicial: '', dataFinal: '', precoHora: '' })
      setAberto(false)
      onGerado?.()
    } catch (error) {
      setErro(error.message || 'Erro ao gerar cobranças')
    } finally {
      setGerando(false)
    }
  }

  return (
    <Card className="mb-4 md:mb-6">
      <CardHeader
        className="cursor-pointer py-3 px-4 md:px-6 flex flex-row items-center justify-between"
        onClick={() => setAberto(!aberto)}
      >
        <CardTitle className="text-base md:text-lg">Gerar Cobranças</CardTitle>
        {aberto ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </CardHeader>

      {aberto && (
        <CardContent className="pt-0 px-4 md:px-6 pb-4 md:pb-6">
          {loadingClientes ? (
            <LoadingSpinner size="sm" />
          ) : (
            <form onSubmit={handleVerPreview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select
                    value={form.clienteId}
                    onValueChange={(value) => {
                      setForm({ ...form, clienteId: value })
                      setPreview(null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os clientes</SelectItem>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataInicial">Data Inicial</Label>
                  <Input
                    id="dataInicial"
                    type="date"
                    value={form.dataInicial}
                    onChange={(e) => {
                      setForm({ ...form, dataInicial: e.target.value })
                      setPreview(null)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFinal">Data Final</Label>
                  <Input
                    id="dataFinal"
                    type="date"
                    value={form.dataFinal}
                    onChange={(e) => {
                      setForm({ ...form, dataFinal: e.target.value })
                      setPreview(null)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precoHora">Preço/Hora (R$)</Label>
                  <Input
                    id="precoHora"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="150.00"
                    value={form.precoHora}
                    onChange={(e) => setForm({ ...form, precoHora: e.target.value })}
                  />
                </div>
              </div>

              {erro && (
                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  {erro}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" variant="outline" disabled={loadingPreview}>
                  {loadingPreview ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    'Ver Preview'
                  )}
                </Button>

                {preview && preview.length > 0 && (
                  <Button onClick={handleGerar} disabled={gerando}>
                    {gerando ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      `Gerar ${preview.length} Cobrança(s)`
                    )}
                  </Button>
                )}
              </div>

              {preview !== null && (
                <div className="mt-2">
                  {preview.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum atendimento encontrado no período selecionado.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {preview.length} cliente(s) com atendimentos no período:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {preview.map((item) => (
                          <div
                            key={item.clienteId}
                            className="border rounded-md p-3 bg-muted/20"
                          >
                            <p className="font-medium text-sm">{item.clienteNome}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.atendimentos} atendimento(s) — {item.tempo}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </CardContent>
      )}
    </Card>
  )
}
