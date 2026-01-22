'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardBody, Button, Spinner } from '@heroui/react'
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { ClienteCobrancaPreview } from '@/domain/entities/ClienteCobrancaPreview'
import { clientesMock } from '@/infrastructure/data/mock-clientes'

export default function ConfirmarCobrancaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [confirmando, setConfirmando] = useState(false)
  const [preview, setPreview] = useState<ClienteCobrancaPreview[]>([])

  useEffect(() => {
    const clienteId = searchParams.get('clienteId')
    const dataInicial = searchParams.get('dataInicial')
    const dataFinal = searchParams.get('dataFinal')

    if (!clienteId || !dataInicial || !dataFinal) {
      router.push('/nova-cobranca')
      return
    }

    // Simular busca de atendimentos pendentes
    setTimeout(() => {
      if (clienteId === 'todos') {
        // Mock: gerar preview para todos os clientes
        const mockPreview: ClienteCobrancaPreview[] = clientesMock.map((cliente, idx) => ({
          clienteId: cliente.id,
          clienteNome: cliente.nome,
          totalAtendimentos: Math.floor(Math.random() * 15) + 3,
          totalHoras: `${Math.floor(Math.random() * 10) + 2}h ${Math.floor(Math.random() * 60)}m`,
          atendimentosPendentes: Math.floor(Math.random() * 20) + 5,
        }))
        setPreview(mockPreview)
      } else {
        // Mock: preview para cliente específico
        const cliente = clientesMock.find((c) => c.id === parseInt(clienteId))
        if (cliente) {
          setPreview([
            {
              clienteId: cliente.id,
              clienteNome: cliente.nome,
              totalAtendimentos: 8,
              totalHoras: '5h 30m',
              atendimentosPendentes: 12,
            },
          ])
        }
      }
      setLoading(false)
    }, 800)
  }, [searchParams, router])

  const handleConfirmar = async () => {
    setConfirmando(true)

    // Simular criação das cobranças
    setTimeout(() => {
      alert(`${preview.length} cobrança(s) criada(s) com sucesso!`)
      router.push('/cobrancas')
    }, 1500)
  }

  const totalGeral = preview.reduce(
    (acc, item) => ({
      atendimentos: acc.atendimentos + item.totalAtendimentos,
      horas: acc.horas + item.totalAtendimentos, // Simplificado
    }),
    { atendimentos: 0, horas: 0 }
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-default-500">Buscando atendimentos pendentes...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card shadow="none" className="border border-default-200">
        <CardBody>
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-warning" />
            <div>
              <h2 className="font-bold text-lg">Confirmar Geração de Cobranças</h2>
              <p className="text-sm text-default-500">
                Revise os dados antes de confirmar a criação das cobranças.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-default-100 rounded-lg mb-4">
            <div>
              <div className="text-xs text-default-500 mb-1">Total de Clientes</div>
              <div className="text-2xl font-bold text-primary">{preview.length}</div>
            </div>
            <div>
              <div className="text-xs text-default-500 mb-1">Total de Atendimentos</div>
              <div className="text-2xl font-bold text-success">{totalGeral.atendimentos}</div>
            </div>
            <div>
              <div className="text-xs text-default-500 mb-1">Período</div>
              <div className="text-sm font-semibold">
                {searchParams.get('dataInicial')} até {searchParams.get('dataFinal')}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card shadow="none" className="border border-default-200">
        <CardBody>
          <h3 className="font-bold text-sm mb-3 text-default-600">Detalhamento por Cliente</h3>
          
          <div className="space-y-2">
            {preview.map((item) => (
              <div
                key={item.clienteId}
                className="flex items-center justify-between p-3 bg-default-50 rounded-lg border border-default-200"
              >
                <div className="flex-1">
                  <div className="font-semibold">{item.clienteNome}</div>
                  <div className="text-xs text-default-500">
                    {item.atendimentosPendentes} atendimentos elegíveis no período
                  </div>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <div className="text-xs text-default-500">Atendimentos</div>
                    <div className="font-bold">{item.totalAtendimentos}</div>
                  </div>
                  <div>
                    <div className="text-xs text-default-500">Horas</div>
                    <div className="font-bold">{item.totalHoras}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-default-200">
            <Button
              variant="light"
              startContent={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.back()}
              isDisabled={confirmando}
            >
              Voltar e Ajustar
            </Button>

            <Button
              color="primary"
              size="lg"
              startContent={<CheckCircle className="h-5 w-5" />}
              onClick={handleConfirmar}
              isLoading={confirmando}
              className="font-bold"
            >
              Confirmar e Criar {preview.length} Cobrança(s)
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
