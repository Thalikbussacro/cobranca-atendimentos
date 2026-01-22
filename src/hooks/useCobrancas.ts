'use client'

import { useState, useEffect } from 'react'
import { Cobranca, StatusCobranca } from '@/domain/entities/Cobranca'

interface Filters {
  search: string
  status: string
}

export function useCobrancas() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({ search: '', status: '' })

  const fetchCobrancas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.status && filters.status !== 'all') params.append('status', filters.status)

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
    status: StatusCobranca
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
      geradas: cobrancas.filter((c) => c.status === 'GERADA').length,
      enviadas: cobrancas.filter((c) => c.status === 'ENVIADA').length,
      aceitas: cobrancas.filter((c) => c.status === 'ACEITA').length,
      faturaEnviada: cobrancas.filter((c) => c.status === 'FATURA_ENVIADA').length,
      pagas: cobrancas.filter((c) => c.status === 'PAGA').length,
      contestadas: cobrancas.filter((c) => c.status === 'CONTESTADA').length,
      contatoSolicitado: cobrancas.filter((c) => c.status === 'CONTATO_SOLICITADO').length,
      recusadas: cobrancas.filter((c) => c.status === 'RECUSADA').length,
      finalizadas: cobrancas.filter((c) => c.status === 'FINALIZADA').length,
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
