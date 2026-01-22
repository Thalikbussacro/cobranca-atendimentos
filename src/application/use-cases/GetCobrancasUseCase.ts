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
      return cobrancas.filter((c) => c.clienteId === filters.clienteId)
    }

    return cobrancas
  }

  getKPIs(cobrancas: Cobranca[]) {
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
}
