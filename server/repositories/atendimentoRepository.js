import { db } from '../db/connection.js'

export async function findAtendimentosByClienteAndPeriodo(clienteId, dataInicio, dataFim) {
  return db.query(
    `
    SELECT
      a.CodAtendimento as id,
      a.CodCliente as clienteId,
      a.DataHoraInicial as dataInicio,
      a.DataHoraFinal as dataFim,
      a.ProblemaRelatado as problema,
      a.SolucaoRepassada as solucao,
      a.Solicitante as solicitante,
      a.CobrarAtendimento as cobrar,
      a.Protocolo as protocolo,
      a.Sistema as sistema,
      a.TipoAtendimento as tipoAtendimento,
      a.Departamento as departamento,
      a.Prioridade as prioridade,
      a.Status as status,
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
  `,
    { clienteId, dataInicio, dataFim }
  )
}

export async function findAtendimentosByCobranca(cobrancaId) {
  return db.query(
    `
    SELECT
      a.CodAtendimento as id,
      a.CodCliente as clienteId,
      a.DataHoraInicial as dataInicio,
      a.DataHoraFinal as dataFim,
      a.ProblemaRelatado as problema,
      a.SolucaoRepassada as solucao,
      a.Solicitante as solicitante,
      a.CobrarAtendimento as cobrar,
      a.Protocolo as protocolo,
      a.Sistema as sistema,
      a.TipoAtendimento as tipoAtendimento,
      a.Departamento as departamento,
      a.Prioridade as prioridade,
      a.Status as status,
      DATEDIFF(MINUTE, a.DataHoraInicial, a.DataHoraFinal) as duracaoMinutos
    FROM Opr_Atendimento a
    INNER JOIN Cad_Cobranca_Item ci ON ci.CodAtendimento = a.CodAtendimento
    WHERE ci.CodCobranca = @cobrancaId
    ORDER BY a.DataHoraInicial
  `,
    { cobrancaId }
  )
}
