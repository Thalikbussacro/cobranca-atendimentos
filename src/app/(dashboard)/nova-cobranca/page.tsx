'use client'

import { useState } from 'react'
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
import { clientesMock } from '@/infrastructure/data/mock-clientes'

export default function NovaCobrancaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    clienteId: 'todos',
    dataInicial: '',
    dataFinal: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.dataInicial || !formData.dataFinal) {
      alert('Preencha as datas inicial e final.')
      return
    }

    // Redirecionar para confirmação
    const params = new URLSearchParams({
      clienteId: formData.clienteId,
      dataInicial: formData.dataInicial,
      dataFinal: formData.dataFinal,
    })

    router.push(`/nova-cobranca/confirmar?${params.toString()}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Gerar cobranças</h2>
        <p className="text-muted-foreground">
          Selecione o cliente e o período para gerar as cobranças.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cliente */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-so-blue" />
                <Label className="text-base font-medium">Todos os clientes</Label>
              </div>
              <Select
                value={formData.clienteId}
                onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os clientes</SelectItem>
                  {clientesMock.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* Texto informativo */}
            <p className="text-sm text-muted-foreground">
              Será criada uma cobrança para todos os clientes, considerando apenas atendimentos
              ainda não enviados para cobrança.
            </p>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                Gerar Cobranças
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
