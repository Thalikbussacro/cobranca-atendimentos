'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectItem } from '@/components/ui/Select'
import { useCobrancas } from '@/hooks/useCobrancas'
import { formatBR } from '@/lib/utils'
import { clientesMock } from '@/infrastructure/data/mock-clientes'

export default function NovaCobrancaPage() {
  const router = useRouter()
  const { createCobranca } = useCobrancas()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    clienteId: '',
    dataInicial: new Date().toISOString().split('T')[0],
    dataFinal: new Date().toISOString().split('T')[0],
  })

  const clientes = useMemo(() => {
    const items: Array<{ key: string; label: string }> = [
      { key: 'todos', label: 'Todos os Clientes' },
    ]
    clientesMock.forEach((cliente) => {
      items.push({
        key: cliente.id.toString(),
        label: cliente.nome,
      })
    })
    return items
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clienteId || !formData.dataInicial || !formData.dataFinal) {
      alert('Preencha Cliente, Data inicial e Data final.')
      return
    }

    setLoading(true)

    // Determina cliente(s)
    const clienteNome = formData.clienteId === 'todos' 
      ? 'Todos os Clientes' 
      : clientesMock.find(c => c.id === parseInt(formData.clienteId))?.nome || 'Cliente'

    // Formata datas para exibição
    const dataObj = {
      cliente: clienteNome,
      dataInicial: formatBR(formData.dataInicial),
      dataFinal: formatBR(formData.dataFinal),
      status: 'ABERTO' as const,
    }

    const success = await createCobranca(dataObj)

    if (success) {
      alert('Cobrança criada com sucesso!')
      router.push('/cobrancas')
    } else {
      alert('Erro ao criar cobrança.')
      setLoading(false)
    }
  }

  const handleFillExample = () => {
    setFormData({
      clienteId: '1', // Cooperativa Alfa
      dataInicial: '2025-10-01',
      dataFinal: '2025-12-31',
    })
  }

  return (
    <Card className="shadow-none border border-default-200">
      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="font-bold text-base">Nova Cobrança</div>
            <div className="text-xs text-default-500 mt-0.5">
              Selecione cliente e período para gerar a cobrança de atendimentos.
            </div>
          </div>
          <Button variant="light" size="sm" onClick={() => router.push('/cobrancas')}>
            Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="Cliente"
            placeholder="Selecione um cliente..."
            selectedKeys={formData.clienteId ? [formData.clienteId] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0]?.toString() || ''
              setFormData({ ...formData, clienteId: value })
            }}
            disabled={loading}
            variant="bordered"
            description="Selecione 'Todos os Clientes' para gerar cobrança consolidada ou um cliente específico."
            items={clientes}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>

          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            <Input
              label="Data inicial"
              type="date"
              value={formData.dataInicial}
              onValueChange={(value) => setFormData({ ...formData, dataInicial: value })}
              disabled={loading}
              variant="bordered"
            />

            <Input
              label="Data final"
              type="date"
              value={formData.dataFinal}
              onValueChange={(value) => setFormData({ ...formData, dataFinal: value })}
              disabled={loading}
              variant="bordered"
            />
          </div>

          <div className="px-4 py-3 rounded-lg border border-dashed border-default-300 bg-default-50 text-default-700 font-medium text-sm">
            Os atendimentos serão vinculados automaticamente após a criação da cobrança.
          </div>

          <div className="flex justify-end gap-2.5 flex-wrap">
            <Button 
              variant="flat" 
              type="button" 
              onClick={handleFillExample} 
              isDisabled={loading}
            >
              Preencher exemplo
            </Button>
            <Button 
              color="primary" 
              type="submit" 
              isLoading={loading} 
              isDisabled={loading}
              className="font-bold"
            >
              Gerar cobrança
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
