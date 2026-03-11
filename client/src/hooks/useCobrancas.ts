import { useState, useEffect } from 'react'
import { getAllCobrancas } from '@/services/cobrancaService'
import type { Cobranca, CobrancaFilters } from '@/services/cobrancaService'

export function useCobrancas() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CobrancaFilters>({
    search: '',
    status: 'all',
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
