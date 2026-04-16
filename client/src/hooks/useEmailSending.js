import { useState } from 'react'
import { enviarEmail, enviarTodas } from '@/services/api'

export function useEmailSending({ onSuccess }) {
  const [enviandoEmailId, setEnviandoEmailId] = useState(null)
  const [enviandoTodas, setEnviandoTodas] = useState(false)
  const [alerta, setAlerta] = useState(null)

  const handleEnviarEmail = async (cobrancaId) => {
    try {
      setEnviandoEmailId(cobrancaId)
      const data = await enviarEmail(cobrancaId)
      setAlerta(data.message || 'E-mail enviado com sucesso!')
      await onSuccess?.()
    } catch (error) {
      setAlerta(`Erro: ${error.message}`)
    } finally {
      setEnviandoEmailId(null)
    }
  }

  const handleEnviarTodas = async () => {
    try {
      setEnviandoTodas(true)
      const data = await enviarTodas()
      setAlerta(data.message || 'E-mails enviados com sucesso!')
      await onSuccess?.()
    } catch (error) {
      setAlerta(`Erro: ${error.message}`)
    } finally {
      setEnviandoTodas(false)
    }
  }

  return {
    enviandoEmailId,
    enviandoTodas,
    alerta,
    setAlerta,
    handleEnviarEmail,
    handleEnviarTodas,
  }
}
