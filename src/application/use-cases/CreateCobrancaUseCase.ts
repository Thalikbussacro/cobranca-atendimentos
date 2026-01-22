import { ICobrancaRepository } from '@/domain/repositories/ICobrancaRepository'
import { CreateCobrancaDTO, Cobranca } from '@/domain/entities/Cobranca'

export class CreateCobrancaUseCase {
  constructor(private cobrancaRepository: ICobrancaRepository) {}

  async execute(data: CreateCobrancaDTO): Promise<Cobranca> {
    // Validações de negócio
    if (!data.cliente || !data.dataInicial || !data.dataFinal) {
      throw new Error('Campos obrigatórios faltando')
    }

    // Criar cobrança
    return await this.cobrancaRepository.create(data)
  }
}
