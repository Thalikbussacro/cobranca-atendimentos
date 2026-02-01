import { ICobrancaRepository } from '@/domain/repositories/ICobrancaRepository'
import { Cobranca, CreateCobrancaDTO } from '@/domain/entities/Cobranca'
import { cobrancasMock } from '@/infrastructure/data/mock-cobrancas'
import { clientesMock } from '@/infrastructure/data/mock-clientes'

export class CobrancaRepositoryMock implements ICobrancaRepository {
  private cobrancas: Cobranca[] = [...cobrancasMock]

  async findAll(filters?: { search?: string; status?: string; periodo?: string }): Promise<Cobranca[]> {
    let result = [...this.cobrancas]

    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'enviado') {
        result = result.filter((c) => c.emailEnviado)
      } else if (filters.status === 'nao-enviado') {
        result = result.filter((c) => !c.emailEnviado)
      }
    }

    if (filters?.periodo && filters.periodo !== 'todos') {
      const now = new Date()
      let startDate: Date
      let endDate: Date = now

      if (filters.periodo === 'mes-atual') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      } else if (filters.periodo === 'mes-anterior') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0)
      } else if (filters.periodo === 'trimestre') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      } else if (filters.periodo === 'ano') {
        startDate = new Date(now.getFullYear(), 0, 1)
      } else {
        startDate = new Date(0)
      }

      result = result.filter((c) => {
        // Parse período da cobrança (formato: "DD/MM/YYYY - DD/MM/YYYY")
        const periodoMatch = c.periodo.match(/(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2})\/(\d{2})\/(\d{4})/)
        if (!periodoMatch) return true

        const dataFinal = new Date(
          parseInt(periodoMatch[6]),
          parseInt(periodoMatch[5]) - 1,
          parseInt(periodoMatch[4])
        )

        return dataFinal >= startDate && dataFinal <= endDate
      })
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.cliente.toLowerCase().includes(search) ||
          c.periodo.toLowerCase().includes(search) ||
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

    // Buscar dados do cliente
    const cliente = clientesMock.find((c) => c.id === data.clienteId)

    const newCobranca: Cobranca = {
      id: newId,
      cliente: data.cliente,
      clienteId: data.clienteId,
      clienteCnpj: cliente?.cnpj || '',
      clienteEmails: cliente?.emails || '',
      periodo: `${data.dataInicial} - ${data.dataFinal}`,
      atendimentos: 0,
      horas: '00h 00m',
      precoHora: data.precoHora,
      emailEnviado: false,
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
