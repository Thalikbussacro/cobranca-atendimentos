'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { Calendar, CheckCircle } from 'lucide-react'
import { Cliente } from '@/domain/entities/Cliente'

export default function NovaCobrancaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    clienteId: 'todos',
    dataInicial: '',
    dataFinal: '',
    precoHora: '150.00',
  })
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])

  useEffect(() => {
    fetch('/api/clientes')
      .then((res) => res.json())
      .then((data) => setClientes(data.clientes || []))
      .catch((err) => console.error('Erro ao carregar clientes:', err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.dataInicial || !formData.dataFinal) {
      alert('Preencha as datas inicial e final.')
      return
    }

    if (!formData.precoHora || parseFloat(formData.precoHora) <= 0) {
      alert('Informe um preço por hora válido.')
      return
    }

    // Redirecionar para confirmação
    const params = new URLSearchParams({
      clienteId: formData.clienteId,
      dataInicial: formData.dataInicial,
      dataFinal: formData.dataFinal,
      precoHora: formData.precoHora,
    })

    router.push(`/nova-cobranca/confirmar?${params.toString()}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Gerar cobranças</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Selecione o cliente e o período para gerar as cobranças.
        </p>
      </div>

      <Card>
        <CardContent className="pt-4 md:pt-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Cliente */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-so-blue" />
                <Label className="text-sm md:text-base font-medium">Todos os clientes</Label>
              </div>
              <Select
                value={formData.clienteId}
                onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
              >
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue placeholder="Selecione o cliente" />
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

            {/* Período */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicial">Data Inicial</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dataInicial"
                    type="date"
                    value={formData.dataInicial}
                    onChange={(e) => setFormData({ ...formData, dataInicial: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFinal">Data Final</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dataFinal"
                    type="date"
                    value={formData.dataFinal}
                    onChange={(e) => setFormData({ ...formData, dataFinal: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Preço por Hora */}
            <div className="space-y-2">
              <Label htmlFor="precoHora">Preço por Hora (R$)</Label>
              <Input
                id="precoHora"
                type="number"
                step="0.01"
                min="0"
                value={formData.precoHora}
                onChange={(e) => setFormData({ ...formData, precoHora: e.target.value })}
                placeholder="150.00"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Este valor será usado para calcular o total de todas as cobranças geradas.
              </p>
            </div>

            {/* Texto informativo */}
            <p className="text-xs md:text-sm text-muted-foreground">
              Será criada uma cobrança para todos os clientes, considerando apenas atendimentos
              ainda não enviados para cobrança.
            </p>

            {/* Botões */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="h-9 md:h-10 text-sm">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="h-9 md:h-10 text-sm">
                Gerar Cobranças
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
