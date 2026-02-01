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
    // Simular envio de e-mail
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log(`E-mail enviado para cobrança ${cobrancaId}`)

    setSuccessMessage('E-mail enviado com sucesso!')
    setShowSuccessAlert(true)
  }

  const handleEnviarTodos = async () => {
    const pendentes = cobrancas.filter(c => !c.emailEnviado)

    if (pendentes.length === 0) {
      setSuccessMessage('Não há e-mails pendentes para enviar.')
      setShowSuccessAlert(true)
      return
    }

    // Simular envio em lote
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log(`Enviando ${pendentes.length} e-mails pendentes`)

    setSuccessMessage(`${pendentes.length} e-mail(s) enviado(s) com sucesso!`)
    setShowSuccessAlert(true)
  }

  if (loading) {
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
        periodo={filters.periodo}
        onPeriodoChange={(value) => setFilters({ ...filters, periodo: value })}
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
