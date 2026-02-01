'use client'

import { useState, useEffect } from 'react'
import { Cobranca } from '@/domain/entities/Cobranca'

interface Filters {
  search: string
  status: string
  periodo: string
}

export function useCobrancas() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({ search: '', status: '', periodo: '' })

  const fetchCobrancas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.status && filters.status !== 'all') params.append('status', filters.status)
      if (filters.periodo && filters.periodo !== 'todos') params.append('periodo', filters.periodo)

      const response = await fetch(`/api/cobrancas?${params}`)
      const data = await response.json()

      if (data.cobrancas) {
        setCobrancas(data.cobrancas)
      }
    } catch (err) {
      setError('Erro ao carregar cobranças')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCobrancas()
  }, [filters])

  const createCobranca = async (data: {
    cliente: string
    clienteId: number
    dataInicial: string
    dataFinal: string
  }) => {
    try {
      const response = await fetch('/api/cobrancas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        await fetchCobrancas()
        return true
      }

      return false
    } catch (err) {
      console.error('Erro ao criar cobrança:', err)
      return false
    }
  }

  const getKPIs = () => {
    return {
      total: cobrancas.length,
      emailsEnviados: cobrancas.filter((c) => c.emailEnviado).length,
      emailsPendentes: cobrancas.filter((c) => !c.emailEnviado).length,
    }
  }

  return {
    cobrancas,
    loading,
    error,
    filters,
    setFilters,
    createCobranca,
    getKPIs,
    refresh: fetchCobrancas,
  }
}
