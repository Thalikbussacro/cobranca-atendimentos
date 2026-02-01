import { Cliente } from '@/domain/entities/Cliente'

export interface IClienteRepository {
  findAll(): Promise<Cliente[]>
  findById(id: number): Promise<Cliente | null>
  create(data: Omit<Cliente, 'id'>): Promise<Cliente>
  update(id: number, data: Partial<Cliente>): Promise<Cliente | null>
  delete(id: number): Promise<boolean>
}
