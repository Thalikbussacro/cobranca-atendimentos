import { db } from '../config/database'

export interface Atendimento {
  id: number
  clienteId: number
  dataInicio: Date
  dataFim: Date
  problema: string
  solucao: string
  solicitante: string
  cobrarAtendimento: boolean
  duracaoMinutos: number
}

export const AtendimentoModel = {
  async findByClienteAndPeriodo(
    clienteId: number,
    dataInicio: Date,
    dataFim: Date
  ): Promise<Atendimento[]> {
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

    const result = await db.query(query, { clienteId, dataInicio, dataFim })

    return result.map((row: any) => ({
      id: row.id,
      clienteId: row.clienteId,
      dataInicio: new Date(row.dataInicio),
      dataFim: new Date(row.dataFim),
      problema: row.problema || '',
      solucao: row.solucao || '',
      solicitante: row.solicitante || '',
      cobrarAtendimento: row.CobrarAtendimento === 'SIM',
      duracaoMinutos: row.duracaoMinutos || 0,
    }))
  },

  async findByCobranca(cobrancaId: number): Promise<Atendimento[]> {
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

    return result.map((row: any) => ({
      id: row.id,
      clienteId: row.clienteId,
      dataInicio: new Date(row.dataInicio),
      dataFim: new Date(row.dataFim),
      problema: row.problema || '',
      solucao: row.solucao || '',
      solicitante: row.solicitante || '',
      cobrarAtendimento: row.CobrarAtendimento === 'SIM',
      duracaoMinutos: row.duracaoMinutos || 0,
    }))
  },
}
