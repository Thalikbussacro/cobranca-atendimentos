import { IAtendimentoRepository } from '@/domain/repositories/IAtendimentoRepository'
import { Atendimento } from '@/domain/entities/Atendimento'
import { db } from '@/infrastructure/database/sqlServerConnection'
import { DbAtendimento } from '@/infrastructure/database/types'

export class AtendimentoRepositorySQL implements IAtendimentoRepository {
  async findByClienteAndPeriodo(
    clienteId: number,
    dataInicio: Date,
    dataFim: Date
  ): Promise<Atendimento[]> {
    try {
      const query = `
        SELECT
          a.CodAtendimento as id,
          a.CodCliente as clienteId,
          a.DataHoraInicial as dataInicio,
          a.DataHoraFinal as dataFim,
          a.ProblemaRelatado as problema,
          a.SolucaoRepassada as solucao,
          a.Solicitante as solicitante,
          a.CobrarAtendimento,
          DATEDIFF(MINUTE, a.DataHoraInicial, a.DataHoraFinal) as duracaoMinutos
        FROM Opr_Atendimento a
        WHERE a.CodCliente = @clienteId
          AND a.DataHoraInicial >= @dataInicio
          AND a.DataHoraFinal <= @dataFim
          AND a.CobrarAtendimento = 'SIM'
          AND NOT EXISTS (
            SELECT 1 FROM Cad_Cobranca_Item ci
            WHERE ci.CodAtendimento = a.CodAtendimento
          )
        ORDER BY a.DataHoraInicial DESC
      `

      const result = await db.query(query, {
        clienteId,
        dataInicio,
        dataFim,
      })

      return result.map((row) => this.mapToAtendimento(row))
    } catch (error) {
      console.error('Erro ao buscar atendimentos por cliente e período:', error)
      throw new Error('Erro ao buscar atendimentos do banco de dados')
    }
  }

  async findByCobranca(cobrancaId: number): Promise<Atendimento[]> {
    try {
      const query = `
        SELECT
          a.CodAtendimento as id,
          a.CodCliente as clienteId,
          a.DataHoraInicial as dataInicio,
          a.DataHoraFinal as dataFim,
          a.ProblemaRelatado as problema,
          a.SolucaoRepassada as solucao,
          a.Solicitante as solicitante,
          a.CobrarAtendimento,
          DATEDIFF(MINUTE, a.DataHoraInicial, a.DataHoraFinal) as duracaoMinutos
        FROM Opr_Atendimento a
        INNER JOIN Cad_Cobranca_Item ci ON ci.CodAtendimento = a.CodAtendimento
        WHERE ci.CodCobranca = @cobrancaId
        ORDER BY a.DataHoraInicial
      `

      const result = await db.query(query, { cobrancaId })

      return result.map((row) => this.mapToAtendimento(row))
    } catch (error) {
      console.error('Erro ao buscar atendimentos por cobrança:', error)
      throw new Error('Erro ao buscar atendimentos do banco de dados')
    }
  }

  async findNaoCobrados(clienteId?: number): Promise<Atendimento[]> {
    try {
      let query = `
        SELECT
          a.CodAtendimento as id,
          a.CodCliente as clienteId,
          a.DataHoraInicial as dataInicio,
          a.DataHoraFinal as dataFim,
          a.ProblemaRelatado as problema,
          a.SolucaoRepassada as solucao,
          a.Solicitante as solicitante,
          a.CobrarAtendimento,
          DATEDIFF(MINUTE, a.DataHoraInicial, a.DataHoraFinal) as duracaoMinutos
        FROM Opr_Atendimento a
        WHERE a.CobrarAtendimento = 'Sim'
          AND NOT EXISTS (
            SELECT 1 FROM Cad_Cobranca_Item ci
            WHERE ci.CodAtendimento = a.CodAtendimento
          )
      `

      const params: any = {}

      if (clienteId) {
        query += ` AND a.CodCliente = @clienteId`
        params.clienteId = clienteId
      }

      query += ` ORDER BY a.DataHoraInicial DESC`

      const result = await db.query(query, params)

      return result.map((row) => this.mapToAtendimento(row))
    } catch (error) {
      console.error('Erro ao buscar atendimentos não cobrados:', error)
      throw new Error('Erro ao buscar atendimentos do banco de dados')
    }
  }

  async findById(id: number): Promise<Atendimento | null> {
    try {
      const query = `
        SELECT
          a.CodAtendimento as id,
          a.CodCliente as clienteId,
          a.DataHoraInicial as dataInicio,
          a.DataHoraFinal as dataFim,
          a.ProblemaRelatado as problema,
          a.SolucaoRepassada as solucao,
          a.Solicitante as solicitante,
          a.CobrarAtendimento,
          DATEDIFF(MINUTE, a.DataHoraInicial, a.DataHoraFinal) as duracaoMinutos
        FROM Opr_Atendimento a
        WHERE a.CodAtendimento = @id
      `

      const result = await db.query(query, { id })

      if (result.length === 0) {
        return null
      }

      return this.mapToAtendimento(result[0])
    } catch (error) {
      console.error('Erro ao buscar atendimento por ID:', error)
      throw new Error('Erro ao buscar atendimento do banco de dados')
    }
  }

  private mapToAtendimento(row: any): Atendimento {
    return {
      id: row.id,
      clienteId: row.clienteId,
      dataInicio: new Date(row.dataInicio),
      dataFim: new Date(row.dataFim),
      problema: row.problema || '',
      solucao: row.solucao || '',
      solicitante: row.solicitante || '',
      cobrarAtendimento: row.CobrarAtendimento === 'SIM',
      duracaoMinutos: row.duracaoMinutos || 0,
    }
  }
}
