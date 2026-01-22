import { ICobrancaRepository } from '@/domain/repositories/ICobrancaRepository'
import { Cobranca, CreateCobrancaDTO } from '@/domain/entities/Cobranca'
import { cobrancasMock } from '@/infrastructure/data/mock-cobrancas'

export class CobrancaRepositoryMock implements ICobrancaRepository {
  private cobrancas: Cobranca[] = [...cobrancasMock]

  async findAll(filters?: { search?: string; status?: string }): Promise<Cobranca[]> {
    let result = [...this.cobrancas]

    if (filters?.status) {
      result = result.filter((c) => c.status === filters.status)
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.cliente.toLowerCase().includes(search) ||
          c.periodo.toLowerCase().includes(search) ||
          c.nf.toLowerCase().includes(search) ||
          String(c.id).includes(search)
      )
    }

    return result
  }

  async findById(id: number): Promise<Cobranca | null> {
    return this.cobrancas.find((c) => c.id === id) || null
  }

  async create(data: CreateCobrancaDTO): Promise<Cobranca> {
    const newId = Math.max(...this.cobrancas.map((c) => c.id)) + 1
    
    const newCobranca: Cobranca = {
      id: newId,
      cliente: data.cliente,
      periodo: `${data.dataInicial} - ${data.dataFinal}`,
      atendimentos: 0,
      horas: '00h 00m',
      nf: '',
      status: data.status,
      ultimaAcao: 'Criada - aguardando vincular atendimentos',
      notificacao: false,
      itens: [],
    }

    this.cobrancas.unshift(newCobranca)
    return newCobranca
  }

  async update(id: number, data: Partial<Cobranca>): Promise<Cobranca | null> {
    const index = this.cobrancas.findIndex((c) => c.id === id)
    if (index === -1) return null

    this.cobrancas[index] = { ...this.cobrancas[index], ...data }
    return this.cobrancas[index]
  }

  async delete(id: number): Promise<boolean> {
    const index = this.cobrancas.findIndex((c) => c.id === id)
    if (index === -1) return false

    this.cobrancas.splice(index, 1)
    return true
  }
}
