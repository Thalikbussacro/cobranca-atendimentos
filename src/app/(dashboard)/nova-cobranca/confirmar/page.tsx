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

    // Buscar preview da API
    const params = new URLSearchParams({
      clienteId,
      dataInicial,
      dataFinal,
    })

    fetch(`/api/cobrancas/preview?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setPreview(data.preview || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Erro ao buscar preview:', err)
        setLoading(false)
      })
  }, [searchParams, router])

  const handleConfirmar = async () => {
    setConfirmando(true)

    const clienteId = searchParams.get('clienteId')
    const dataInicial = searchParams.get('dataInicial')
    const dataFinal = searchParams.get('dataFinal')
    const precoHora = searchParams.get('precoHora')

    if (clienteId === 'todos') {
      // Criar cobranças para todos os clientes do preview
      const promises = preview.map((item) =>
        fetch('/api/cobrancas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cliente: item.clienteNome,
            clienteId: item.clienteId,
            dataInicial: dataInicial,
            dataFinal: dataFinal,
            precoHora: parseFloat(precoHora || '150'),
          }),
        })
      )

      await Promise.all(promises)
    } else {
      // Criar cobrança para cliente específico
      const item = preview[0]
      if (item) {
        await fetch('/api/cobrancas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cliente: item.clienteNome,
            clienteId: item.clienteId,
            dataInicial: dataInicial,
            dataFinal: dataFinal,
            precoHora: parseFloat(precoHora || '150'),
          }),
        })
      }
    }

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
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Confirmar Cobranças</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Revise os dados antes de confirmar a criação das cobranças.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg">Cobranças a serem geradas</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[300px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm">Cliente</TableHead>
                <TableHead className="text-center text-sm">Atend.</TableHead>
                <TableHead className="text-right text-sm">Tempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.map((item) => (
                <TableRow key={item.clienteId}>
                  <TableCell className="font-medium text-sm">{item.clienteNome}</TableCell>
                  <TableCell className="text-center text-sm">{item.atendimentos}</TableCell>
                  <TableCell className="text-right text-sm">{item.tempo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-bold text-sm">Total</TableCell>
                <TableCell className="text-center font-bold text-sm">{totalAtendimentos}</TableCell>
                <TableCell className="text-right font-bold text-sm">-</TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 md:mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => router.back()} disabled={confirmando} className="h-9 md:h-10 text-sm">
              Cancelar
            </Button>
            <Button onClick={handleConfirmar} disabled={confirmando} className="h-9 md:h-10 text-sm">
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
