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
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Loader2, ChevronDown, ChevronUp, Calendar, DollarSign, Users, Eye, FileText } from 'lucide-react'
import { getAllClientes, gerarCobrancas } from '@/services/api'
import { PreviewPanel } from '@/components/PreviewPanel'
import { usePreview } from '@/hooks/usePreview'

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
  const { preview, loadingPreview, carregarPreview, limparPreview } = usePreview()
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

    const { erro: previewErro } = await carregarPreview({
      clienteId: form.clienteId,
      dataInicial: form.dataInicial,
      dataFinal: form.dataFinal,
    })
    if (previewErro) setErro(previewErro)
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

      limparPreview()
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
    <Card className="mb-6">
      <CardHeader
        className="cursor-pointer py-3 px-4 md:px-6 flex flex-row items-center justify-between"
        onClick={() => setAberto(!aberto)}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-so-blue/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-so-blue" />
          </div>
          <div>
            <CardTitle className="text-base md:text-lg">Gerar Cobranças</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
              Selecione o período e cliente para gerar cobranças
            </p>
          </div>
        </div>
        <div className={`transition-transform duration-200 ${aberto ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      {aberto && (
        <CardContent className="pt-0 px-4 md:px-6 pb-4 md:pb-6">
          {loadingClientes ? (
            <LoadingSpinner size="sm" />
          ) : (
            <form onSubmit={handleVerPreview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    Cliente
                  </Label>
                  <Select
                    value={form.clienteId}
                    onValueChange={(value) => {
                      setForm({ ...form, clienteId: value })
                      limparPreview()
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
                  <Label htmlFor="dataInicial" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Data Inicial
                  </Label>
                  <Input
                    id="dataInicial"
                    type="date"
                    value={form.dataInicial}
                    onChange={(e) => {
                      setForm({ ...form, dataInicial: e.target.value })
                      limparPreview()
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFinal" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Data Final
                  </Label>
                  <Input
                    id="dataFinal"
                    type="date"
                    value={form.dataFinal}
                    onChange={(e) => {
                      setForm({ ...form, dataFinal: e.target.value })
                      limparPreview()
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precoHora" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />
                    Preço/Hora (R$)
                  </Label>
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

              <div className="flex items-center gap-2 pt-1">
                <Button type="submit" variant="outline" disabled={loadingPreview} className="gap-2">
                  {loadingPreview ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Ver Preview
                    </>
                  )}
                </Button>

                {preview && preview.length > 0 && (
                  <Button onClick={handleGerar} disabled={gerando} className="gap-2 bg-so-blue hover:bg-so-blue-dark animate-in fade-in slide-in-from-left-2 duration-200">
                    {gerando ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Gerar {preview.length} Cobrança(s)
                      </>
                    )}
                  </Button>
                )}
              </div>

              <PreviewPanel preview={preview} />
            </form>
          )}
        </CardContent>
      )}
    </Card>
  )
}
