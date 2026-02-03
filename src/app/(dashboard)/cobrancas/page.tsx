'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCobrancas } from '@/hooks/useCobrancas'
import { Toolbar } from '@/components/cobrancas/Toolbar'
import { CobrancaTable } from '@/components/cobrancas/CobrancaTable'
import { AlertBar } from '@/components/layout/AlertBar'

export default function CobrancasPage() {
  const router = useRouter()
  const { cobrancas, loading, filters, setFilters } = useCobrancas()
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleEnviarEmail = async (cobrancaId: number) => {
    try {
      const response = await fetch(`/api/cobrancas/${cobrancaId}/enviar-email`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar e-mail')
      }

      console.log(`E-mail enviado para cobrança ${cobrancaId}`)
      setSuccessMessage(data.message || 'E-mail enviado com sucesso!')
      setShowSuccessAlert(true)

      // Recarregar cobranças para atualizar status de envio
      window.location.reload()
    } catch (error: any) {
      console.error('Erro ao enviar e-mail:', error)
      setSuccessMessage(`Erro: ${error.message}`)
      setShowSuccessAlert(true)
    }
  }

  const handleEnviarTodos = async () => {
    const pendentes = cobrancas.filter((c) => !c.emailEnviado)

    if (pendentes.length === 0) {
      setSuccessMessage('Não há e-mails pendentes para enviar.')
      setShowSuccessAlert(true)
      return
    }

    try {
      console.log(`Enviando ${pendentes.length} e-mails pendentes`)

      // Enviar emails em paralelo
      const promises = pendentes.map((cobranca) =>
        fetch(`/api/cobrancas/${cobranca.id}/enviar-email`, {
          method: 'POST',
        }).then((res) => res.json())
      )

      const results = await Promise.allSettled(promises)

      const sucessos = results.filter((r) => r.status === 'fulfilled').length
      const falhas = results.filter((r) => r.status === 'rejected').length

      if (falhas > 0) {
        setSuccessMessage(
          `${sucessos} e-mail(s) enviado(s), ${falhas} falharam. Verifique o console.`
        )
      } else {
        setSuccessMessage(`${sucessos} e-mail(s) enviado(s) com sucesso!`)
      }

      setShowSuccessAlert(true)

      // Recarregar cobranças para atualizar status de envio
      window.location.reload()
    } catch (error: any) {
      console.error('Erro ao enviar e-mails:', error)
      setSuccessMessage(`Erro: ${error.message}`)
      setShowSuccessAlert(true)
    }
  }

  if (loading && cobrancas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando cobranças...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Título da página */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Cobranças</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Gerencie cobranças por período e envie e-mails aos clientes.
        </p>
      </div>

      {/* Alerta de sucesso */}
      {showSuccessAlert && (
        <AlertBar
          variant="success"
          title="Sucesso!"
          description={successMessage}
          onDismiss={() => setShowSuccessAlert(false)}
        />
      )}

      {/* Toolbar */}
      <Toolbar
        search={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        status={filters.status}
        onStatusChange={(value) => setFilters({ ...filters, status: value })}
        dataInicial={filters.dataInicial}
        dataFinal={filters.dataFinal}
        onDataInicialChange={(value) => setFilters({ ...filters, dataInicial: value })}
        onDataFinalChange={(value) => setFilters({ ...filters, dataFinal: value })}
        onNewCobranca={() => router.push('/nova-cobranca')}
        onEnviarTodos={handleEnviarTodos}
      />

      {/* Tabela */}
      <CobrancaTable
        cobrancas={cobrancas}
        onEnviarEmail={handleEnviarEmail}
      />
    </div>
  )
}
