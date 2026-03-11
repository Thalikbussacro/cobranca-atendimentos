import { useState, useEffect } from 'react'
import { getAllCobrancas } from '@/services/api'

export function useCobrancas() {
  const [cobrancas, setCobrancas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    inicio: '',
    fim: '',
  })

  const refresh = async () => {
    try {
      setLoading(true)
      const data = await getAllCobrancas(filters)
      setCobrancas(data.cobrancas)
    } catch (error) {
      console.error('Erro ao buscar cobranças:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [filters])

  return { cobrancas, loading, filters, setFilters, refresh }
}
