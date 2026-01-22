'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { Loader2, CheckCircle } from 'lucide-react'
import { clientesMock } from '@/infrastructure/data/mock-clientes'

interface PreviewItem {
  clienteId: number
  clienteNome: string
  atendimentos: number
  tempo: string
}

export default function ConfirmarCobrancaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [confirmando, setConfirmando] = useState(false)
  const [preview, setPreview] = useState<PreviewItem[]>([])

  useEffect(() => {
    const clienteId = searchParams.get('clienteId')
    const dataInicial = searchParams.get('dataInicial')
    const dataFinal = searchParams.get('dataFinal')

    if (!clienteId || !dataInicial || !dataFinal) {
      router.push('/nova-cobranca')
      return
    }

    // Simular busca de atendimentos
    setTimeout(() => {
      if (clienteId === 'todos') {
        const mockPreview = clientesMock.map((cliente) => ({
          clienteId: cliente.id,
          clienteNome: cliente.nome,
          atendimentos: Math.floor(Math.random() * 15) + 3,
          tempo: `${Math.floor(Math.random() * 10) + 2}h ${Math.floor(Math.random() * 60)}m`,
        }))
        setPreview(mockPreview)
      } else {
        const cliente = clientesMock.find((c) => c.id === parseInt(clienteId))
        if (cliente) {
          setPreview([
            {
              clienteId: cliente.id,
              clienteNome: cliente.nome,
              atendimentos: 8,
              tempo: '5h 30m',
            },
          ])
        }
      }
      setLoading(false)
    }, 800)
  }, [searchParams, router])

  const handleConfirmar = async () => {
    setConfirmando(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push('/cobrancas')
  }

  const totalAtendimentos = preview.reduce((acc, item) => acc + item.atendimentos, 0)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-so-blue" />
        <p className="text-muted-foreground">Buscando atendimentos pendentes...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Confirmar Cobranças</h2>
        <p className="text-muted-foreground">
          Revise os dados antes de confirmar a criação das cobranças.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cobranças a serem geradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-center">Atendimentos</TableHead>
                <TableHead className="text-right">Tempo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.map((item) => (
                <TableRow key={item.clienteId}>
                  <TableCell className="font-medium">{item.clienteNome}</TableCell>
                  <TableCell className="text-center">{item.atendimentos}</TableCell>
                  <TableCell className="text-right">{item.tempo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-center font-bold">{totalAtendimentos}</TableCell>
                <TableCell className="text-right font-bold">-</TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => router.back()} disabled={confirmando}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmar} disabled={confirmando}>
              {confirmando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
