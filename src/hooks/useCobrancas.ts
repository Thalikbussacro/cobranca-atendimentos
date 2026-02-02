'use client'

import { useState, useEffect, useCallback } from 'react'
import { Cobranca } from '@/domain/entities/Cobranca'

interface Filters {
  search: string
  status: string
  dataInicial: string
  dataFinal: string
}

export function useCobrancas() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    dataInicial: '',
    dataFinal: ''
  })

  const fetchCobrancas = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      // Filtro de busca (somente se tiver pelo menos 2 caracteres para evitar muitas requisições)
      if (filters.search && filters.search.length >= 2) {
        params.append('search', filters.search)
      }

      // Filtro de status
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status)
      }

      // Filtros de data
      if (filters.dataInicial) {
        params.append('dataInicial', filters.dataInicial)
      }
      if (filters.dataFinal) {
        params.append('dataFinal', filters.dataFinal)
      }

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
  }, [filters])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCobrancas()
    }, 300) // Debounce de 300ms

    return () => clearTimeout(timeoutId)
  }, [fetchCobrancas])

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
