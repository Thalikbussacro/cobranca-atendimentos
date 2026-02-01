import { Atendimento } from '@/domain/entities/Atendimento'

export interface IAtendimentoRepository {
  findByClienteAndPeriodo(
    clienteId: number,
    dataInicio: Date,
    dataFim: Date
  ): Promise<Atendimento[]>
  findByCobranca(cobrancaId: number): Promise<Atendimento[]>
  findNaoCobrados(clienteId?: number): Promise<Atendimento[]>
  findById(id: number): Promise<Atendimento | null>
}
