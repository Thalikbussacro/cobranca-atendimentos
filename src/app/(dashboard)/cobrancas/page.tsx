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
  const [showConfirmacaoEnvio, setShowConfirmacaoEnvio] = useState(false)
  const [cobrancasPendentes, setCobrancasPendentes] = useState<typeof cobrancas>([])
  const [cancelarEnvio, setCancelarEnvio] = useState(false)


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

  const handleEnviarTodos = () => {
    const pendentes = cobrancas.filter((c) => !c.emailEnviado)

    if (pendentes.length === 0) {
      setSuccessMessage('Não há e-mails pendentes para enviar.')
      setShowSuccessAlert(true)
      return
    }

    // Mostrar modal de confirmação com a lista
    setCobrancasPendentes(pendentes)
    setShowConfirmacaoEnvio(true)
  }

  const confirmarEnvioTodos = async () => {
    // Fechar modal de confirmação
    setShowConfirmacaoEnvio(false)

    try {
      setEnviandoEmLote(true)
      setShowProgress(true)
      setCancelarEnvio(false)
      setProgressoLote({ atual: 0, total: cobrancasPendentes.length })
      console.log(`Enviando ${cobrancasPendentes.length} e-mails pendentes`)

      let sucessos = 0
      let falhas = 0
      let cancelado = false

      // Enviar emails sequencialmente para mostrar progresso
      for (let i = 0; i < cobrancasPendentes.length; i++) {
        // Verificar se foi solicitado cancelamento
        if (cancelarEnvio) {
          cancelado = true
          console.log('Envio cancelado pelo usuário')
          break
        }

        const cobranca = cobrancasPendentes[i]
        setProgressoLote({ atual: i + 1, total: cobrancasPendentes.length })
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

      if (cancelado) {
        setProgressoEnvio('Envio interrompido')
      } else {
        setProgressoEnvio('Concluído!')
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      setShowProgress(false)

      if (cancelado) {
        setSuccessMessage(
          `Envio interrompido. ${sucessos} e-mail(s) enviado(s) antes do cancelamento.`
        )
      } else if (falhas > 0) {
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
      setCancelarEnvio(false)
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

      {/* Modal de confirmação de envio em lote */}
      {showConfirmacaoEnvio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Confirmar Envio de E-mails</h3>

            <p className="text-sm text-muted-foreground mb-4">
              Os seguintes e-mails serão enviados ({cobrancasPendentes.length} cobrança{cobrancasPendentes.length !== 1 ? 's' : ''}):
            </p>

            <div className="flex-1 overflow-y-auto mb-6 border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium">Cliente</th>
                    <th className="text-left p-2 font-medium">E-mail</th>
                    <th className="text-left p-2 font-medium">Período</th>
                  </tr>
                </thead>
                <tbody>
                  {cobrancasPendentes.map((cobranca) => (
                    <tr key={cobranca.id} className="border-t">
                      <td className="p-2">{cobranca.cliente}</td>
                      <td className="p-2 text-xs">{cobranca.clienteEmails}</td>
                      <td className="p-2 text-xs">{cobranca.periodo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmacaoEnvio(false)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEnvioTodos}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Confirmar Envio
              </button>
            </div>
          </div>
        </div>
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
            {enviandoEmLote && !cancelarEnvio && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setCancelarEnvio(true)}
                  className="px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  Cancelar Envio
                </button>
              </div>
            )}
            {cancelarEnvio && (
              <div className="mt-4 text-sm text-muted-foreground text-center">
                Cancelando após o email atual...
              </div>
            )}
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
