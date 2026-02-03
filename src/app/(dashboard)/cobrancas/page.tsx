'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCobrancas } from '@/hooks/useCobrancas'
import { Toolbar } from '@/components/cobrancas/Toolbar'
import { CobrancaTable } from '@/components/cobrancas/CobrancaTable'
import { AlertBar } from '@/components/layout/AlertBar'

export default function CobrancasPage() {
  const router = useRouter()
  const { cobrancas, loading, filters, setFilters, refresh } = useCobrancas()
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [enviandoEmailId, setEnviandoEmailId] = useState<number | null>(null)
  const [cancelandoId, setCancelandoId] = useState<number | null>(null)
  const [progressoEnvio, setProgressoEnvio] = useState<string>('')
  const [showProgress, setShowProgress] = useState(false)
  const [enviandoEmLote, setEnviandoEmLote] = useState(false)
  const [progressoLote, setProgressoLote] = useState({ atual: 0, total: 0 })

  const handleEnviarEmail = async (cobrancaId: number) => {
    try {
      setEnviandoEmailId(cobrancaId)
      setShowProgress(true)

      setProgressoEnvio('Verificando conexão SMTP...')
      await new Promise(resolve => setTimeout(resolve, 300))

      setProgressoEnvio('Gerando email...')
      const response = await fetch(`/api/cobrancas/${cobrancaId}/enviar-email`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar e-mail')
      }

      setProgressoEnvio('Email enviado com sucesso!')
      console.log(`E-mail enviado para cobrança ${cobrancaId}`)

      await new Promise(resolve => setTimeout(resolve, 500))
      setShowProgress(false)

      setSuccessMessage(data.message || 'E-mail enviado com sucesso!')
      setShowSuccessAlert(true)

      // Recarregar cobranças para atualizar status de envio
      await refresh()
    } catch (error: any) {
      console.error('Erro ao enviar e-mail:', error)
      setShowProgress(false)
      setSuccessMessage(`Erro: ${error.message}`)
      setShowSuccessAlert(true)
    } finally {
      setEnviandoEmailId(null)
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
      setEnviandoEmLote(true)
      setShowProgress(true)
      setProgressoLote({ atual: 0, total: pendentes.length })
      console.log(`Enviando ${pendentes.length} e-mails pendentes`)

      let sucessos = 0
      let falhas = 0

      // Enviar emails sequencialmente para mostrar progresso
      for (let i = 0; i < pendentes.length; i++) {
        const cobranca = pendentes[i]
        setProgressoLote({ atual: i + 1, total: pendentes.length })
        setProgressoEnvio(`Enviando para ${cobranca.cliente}...`)

        try {
          const response = await fetch(`/api/cobrancas/${cobranca.id}/enviar-email`, {
            method: 'POST',
          })

          if (response.ok) {
            sucessos++
          } else {
            falhas++
            console.error(`Falha ao enviar email para ${cobranca.cliente}`)
          }
        } catch (error) {
          falhas++
          console.error(`Erro ao enviar email para ${cobranca.cliente}:`, error)
        }
      }

      setProgressoEnvio('Concluído!')
      await new Promise(resolve => setTimeout(resolve, 500))
      setShowProgress(false)

      if (falhas > 0) {
        setSuccessMessage(
          `${sucessos} e-mail(s) enviado(s), ${falhas} falharam. Verifique o console.`
        )
      } else {
        setSuccessMessage(`${sucessos} e-mail(s) enviado(s) com sucesso!`)
      }

      setShowSuccessAlert(true)

      // Recarregar cobranças para atualizar status de envio
      await refresh()
    } catch (error: any) {
      console.error('Erro ao enviar e-mails:', error)
      setShowProgress(false)
      setSuccessMessage(`Erro: ${error.message}`)
      setShowSuccessAlert(true)
    } finally {
      setEnviandoEmLote(false)
    }
  }

  const handleCancelarCobranca = async (cobrancaId: number) => {
    if (!confirm('Tem certeza que deseja cancelar esta cobrança?')) {
      return
    }

    try {
      setCancelandoId(cobrancaId)
      const response = await fetch(`/api/cobrancas/${cobrancaId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao cancelar cobrança')
      }

      setSuccessMessage('Cobrança cancelada com sucesso!')
      setShowSuccessAlert(true)

      // Recarregar cobranças
      await refresh()
    } catch (error: any) {
      console.error('Erro ao cancelar cobrança:', error)
      setSuccessMessage(`Erro: ${error.message}`)
      setShowSuccessAlert(true)
    } finally {
      setCancelandoId(null)
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

      {/* Modal de progresso */}
      {showProgress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {enviandoEmLote
                    ? `Enviando emails (${progressoLote.atual} de ${progressoLote.total})`
                    : 'Enviando email...'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{progressoEnvio}</p>
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: enviandoEmLote
                    ? `${(progressoLote.atual / progressoLote.total) * 100}%`
                    : '100%',
                }}
              />
            </div>
          </div>
        </div>
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
        onCancelarCobranca={handleCancelarCobranca}
        enviandoEmailId={enviandoEmailId}
        cancelandoId={cancelandoId}
      />
    </div>
  )
}
