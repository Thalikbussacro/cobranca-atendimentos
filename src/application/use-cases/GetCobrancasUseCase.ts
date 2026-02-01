import { ICobrancaRepository } from '@/domain/repositories/ICobrancaRepository'
import { Cobranca } from '@/domain/entities/Cobranca'

interface GetCobrancasFilters {
  search?: string
  status?: string
  periodo?: string
  clienteId?: number
}

export class GetCobrancasUseCase {
  constructor(private cobrancaRepository: ICobrancaRepository) {}

  async execute(filters?: GetCobrancasFilters): Promise<Cobranca[]> {
    const cobrancas = await this.cobrancaRepository.findAll(filters)

    // Se filtro de cliente específico, filtrar
    if (filters?.clienteId) {
      return cobrancas.filter((c) => c.clienteId === filters.clienteId)
    }

    return cobrancas
  }
}
