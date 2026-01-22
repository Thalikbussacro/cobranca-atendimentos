import { ICobrancaRepository } from '@/domain/repositories/ICobrancaRepository'
import { Cobranca } from '@/domain/entities/Cobranca'

interface GetCobrancasFilters {
  search?: string
  status?: string
  clienteId?: number
}

export class GetCobrancasUseCase {
  constructor(private cobrancaRepository: ICobrancaRepository) {}

  async execute(filters?: GetCobrancasFilters): Promise<Cobranca[]> {
    const cobrancas = await this.cobrancaRepository.findAll(filters)

    // Se filtro de cliente específico, filtrar
    if (filters?.clienteId) {
      return cobrancas.filter((c) => {
        // Em produção, verificar c.clienteId === filters.clienteId
        // No mock, verificar por nome
        return true // Temporário
      })
    }

    return cobrancas
  }

  getKPIs(cobrancas: Cobranca[]) {
    return {
      aberto: cobrancas.filter((c) => c.status === 'ABERTO').length,
      aguardandoNF: cobrancas.filter((c) => c.status === 'AGUARDANDO_NF').length,
      enviadas: cobrancas.filter((c) => c.status === 'ENVIADA').length,
      pagas: cobrancas.filter((c) => c.status === 'PAGA').length,
    }
  }
}
