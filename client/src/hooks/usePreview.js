import { useState } from 'react'
import { getPreview } from '@/services/api'

export function usePreview() {
  const [preview, setPreview] = useState(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  const carregarPreview = async ({ clienteId, dataInicial, dataFinal }) => {
    setLoadingPreview(true)
    setPreview(null)

    try {
      const data = await getPreview({ clienteId, dataInicial, dataFinal })
      setPreview(data.preview)
      return { preview: data.preview, erro: null }
    } catch (error) {
      return { preview: null, erro: error.message || 'Erro ao carregar preview' }
    } finally {
      setLoadingPreview(false)
    }
  }

  const limparPreview = () => setPreview(null)

  return { preview, loadingPreview, carregarPreview, limparPreview }
}
