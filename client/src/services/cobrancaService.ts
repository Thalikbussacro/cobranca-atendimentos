import { get, post } from './api'

export interface AtendimentoItem {
  data: string
  solicitante: string
  resumo: string
  solucao: string
  tempo: string
}

export interface Cobranca {
  id: number
  cliente: string
  clienteId: number
  clienteCnpj: string
  clienteEmails: string
  periodo: string
  atendimentos: number
  horas: string
  precoHora: number
  emailEnviado: boolean
  itens: AtendimentoItem[]
}

export interface CobrancaFilters {
  search?: string
  status?: string
  periodo?: string
}

export interface PreviewParams {
  clienteId: string
  dataInicial: string
  dataFinal: string
}

export interface PreviewItem {
  clienteId: number
  clienteNome: string
  atendimentos: number
  tempo: string
}

export async function getAllCobrancas(filters?: CobrancaFilters): Promise<{ cobrancas: Cobranca[] }> {
  const params = new URLSearchParams()
  if (filters?.search) params.append('search', filters.search)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.periodo) params.append('periodo', filters.periodo)
  
  const queryString = params.toString()
  return get<{ cobrancas: Cobranca[] }>(`/cobrancas${queryString ? `?${queryString}` : ''}`)
}

export async function getCobrancaById(id: number): Promise<{ cobranca: Cobranca }> {
  return get<{ cobranca: Cobranca }>(`/cobrancas/${id}`)
}

export async function getPreview(params: PreviewParams): Promise<{ preview: PreviewItem[] }> {
  const queryParams = new URLSearchParams(params as any)
  return get<{ preview: PreviewItem[] }>(`/cobrancas/preview?${queryParams}`)
}

export async function createCobranca(data: any): Promise<{ success: boolean; cobranca: Cobranca }> {
  return post<{ success: boolean; cobranca: Cobranca }>('/cobrancas', data)
}

export async function sendEmail(id: number): Promise<{ success: boolean; message: string }> {
  return post<{ success: boolean; message: string }>(`/cobrancas/${id}/enviar-email`)
}
