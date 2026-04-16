import { useState, useRef, useCallback } from 'react'
import { enviarEmail } from '@/services/api'
import { useToastStore } from '@/stores/useToastStore'

export function useEmailSending({ cobrancas, onSuccess }) {
  const [enviandoEmailId, setEnviandoEmailId] = useState(null)
  const [progresso, setProgresso] = useState(null)
  const abortRef = useRef(null)
  const addToast = useToastStore((s) => s.addToast)

  const handleEnviarEmail = async (cobrancaId) => {
    try {
      setEnviandoEmailId(cobrancaId)
      const data = await enviarEmail(cobrancaId)
      addToast('success', data.message || 'E-mail enviado com sucesso!')
      await onSuccess?.()
    } catch (error) {
      addToast('error', error.message || 'Erro ao enviar e-mail')
    } finally {
      setEnviandoEmailId(null)
    }
  }

  const handleEnviarTodas = async () => {
    const pendentes = cobrancas.filter(
      (c) => !c.emailEnviado && c.clienteEmails && c.clienteEmails.trim() !== ''
    )

    if (pendentes.length === 0) {
      addToast('info', 'Nenhuma cobrança pendente para enviar.')
      return
    }

    const controller = new AbortController()
    abortRef.current = controller
    const estado = { total: pendentes.length, enviadas: 0, erros: 0, atual: null }
    setProgresso({ ...estado })

    for (const cobranca of pendentes) {
      if (controller.signal.aborted) break

      estado.atual = cobranca.cliente
      setProgresso({ ...estado })

      try {
        await enviarEmail(cobranca.id, { signal: controller.signal })
        estado.enviadas++
        await onSuccess?.()
      } catch (error) {
        if (error.name === 'AbortError') break
        estado.erros++
      }

      setProgresso({ ...estado })
    }

    abortRef.current = null
    estado.atual = null
    setProgresso({ ...estado })
  }

  const handleCancelarEnvio = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const fecharProgresso = useCallback(() => {
    setProgresso(null)
  }, [])

  const enviandoTodas = progresso !== null && progresso.atual !== null

  return {
    enviandoEmailId,
    enviandoTodas,
    progresso,
    handleEnviarEmail,
    handleEnviarTodas,
    handleCancelarEnvio,
    fecharProgresso,
  }
}
