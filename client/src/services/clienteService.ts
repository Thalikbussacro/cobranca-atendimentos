import { get } from './api'

export interface Cliente {
  id: number
  nome: string
  cnpj: string
  email: string
  emails: string
  telefone: string
}

export async function getAllClientes(): Promise<{ clientes: Cliente[] }> {
  return get<{ clientes: Cliente[] }>('/clientes')
}

export async function getClienteById(id: number): Promise<{ cliente: Cliente }> {
  return get<{ cliente: Cliente }>(`/clientes/${id}`)
}
