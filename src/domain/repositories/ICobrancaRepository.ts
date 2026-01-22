import { Cobranca, CreateCobrancaDTO } from '@/domain/entities/Cobranca'

export interface ICobrancaRepository {
  findAll(filters?: { search?: string; status?: string }): Promise<Cobranca[]>
  findById(id: number): Promise<Cobranca | null>
  create(data: CreateCobrancaDTO): Promise<Cobranca>
  update(id: number, data: Partial<Cobranca>): Promise<Cobranca | null>
  delete(id: number): Promise<boolean>
}
