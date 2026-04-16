import { db } from '../db/connection.js'
import { parseDataISO } from '../utils/formatters.js'

export async function findAllCobrancas(filters = {}) {
  let query = `
    SELECT
      c.CodCobranca as id,
      c.CodCliente as clienteId,
      cl.Descricao as cliente,
      cl.CNPJ as clienteCnpj,
      cl.EMail as clienteEmails,
      cl.Cidade as clienteCidade,
      c.PrecoHora as precoHora,
      c.DataHoraInicial,
      c.DataHoraFinal,
      c.EmailEnviado as emailEnviado,
      COUNT(ci.CodAtendimento) as totalAtendimentos,
      ISNULL(SUM(DATEDIFF(MINUTE, a.DataHoraInicial, a.DataHoraFinal)), 0) as totalMinutos
    FROM Cad_Cobranca c
    INNER JOIN Cad_Cliente cl ON cl.CodCliente = c.CodCliente
    LEFT JOIN Cad_Cobranca_Item ci ON ci.CodCobranca = c.CodCobranca
    LEFT JOIN Opr_Atendimento a ON a.CodAtendimento = ci.CodAtendimento
    WHERE 1=1
  `

  const params = {}

  if (filters.search) {
    query += ` AND (cl.Descricao LIKE @search OR cl.CNPJ LIKE @search)`
    params.search = `%${filters.search}%`
  }

  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'enviado') {
      query += ` AND c.EmailEnviado = 1`
    } else if (filters.status === 'nao-enviado') {
      query += ` AND c.EmailEnviado = 0`
    }
  }

  if (filters.inicio) {
    query += ` AND c.DataHoraFinal >= @startDate`
    params.startDate = parseDataISO(filters.inicio)
  }

  if (filters.fim) {
    query += ` AND c.DataHoraFinal <= @endDate`
    params.endDate = parseDataISO(filters.fim)
  }

  query += `
    GROUP BY
      c.CodCobranca, c.CodCliente, cl.Descricao, cl.CNPJ, cl.EMail, cl.Cidade,
      c.PrecoHora, c.DataHoraInicial, c.DataHoraFinal, c.EmailEnviado
    ORDER BY c.DataHoraFinal DESC
  `

  return db.query(query, params)
}

export async function findCobrancaById(id) {
  const result = await db.query(
    `
    SELECT
      c.CodCobranca as id,
      c.CodCliente as clienteId,
      cl.Descricao as cliente,
      cl.CNPJ as clienteCnpj,
      cl.EMail as clienteEmails,
      cl.Cidade as clienteCidade,
      c.PrecoHora as precoHora,
      c.DataHoraInicial,
      c.DataHoraFinal,
      c.EmailEnviado as emailEnviado,
      COUNT(ci.CodAtendimento) as totalAtendimentos,
      ISNULL(SUM(DATEDIFF(MINUTE, a.DataHoraInicial, a.DataHoraFinal)), 0) as totalMinutos
    FROM Cad_Cobranca c
    INNER JOIN Cad_Cliente cl ON cl.CodCliente = c.CodCliente
    LEFT JOIN Cad_Cobranca_Item ci ON ci.CodCobranca = c.CodCobranca
    LEFT JOIN Opr_Atendimento a ON a.CodAtendimento = ci.CodAtendimento
    WHERE c.CodCobranca = @id
    GROUP BY
      c.CodCobranca, c.CodCliente, cl.Descricao, cl.CNPJ, cl.EMail, cl.Cidade,
      c.PrecoHora, c.DataHoraInicial, c.DataHoraFinal, c.EmailEnviado
  `,
    { id }
  )

  return result.length === 0 ? null : result[0]
}

export async function createCobranca({ clienteId, dataInicial, dataFinal, precoHora }) {
  const dtInicial = parseDataISO(dataInicial)
  const dtFinal = parseDataISO(dataFinal)

  return db.transaction(async (transaction) => {
    await transaction.request().query(`
      DECLARE @result INT
      EXEC @result = sp_getapplock @Resource = 'Cad_Cobranca_NextId', @LockMode = 'Exclusive', @LockTimeout = 10000
      IF @result < 0
        THROW 50001, 'Não foi possível obter lock para gerar ID', 1
    `)

    const maxIdResult = await transaction
      .request()
      .query(`SELECT ISNULL(MAX(CodCobranca), 0) + 1 as novoId FROM Cad_Cobranca`)

    const novoCodigo = maxIdResult.recordset[0].novoId

    await transaction
      .request()
      .input('codigo', novoCodigo)
      .input('clienteId', clienteId)
      .input('precoHora', precoHora)
      .input('dataInicial', dtInicial)
      .input('dataFinal', dtFinal)
      .query(`
        INSERT INTO Cad_Cobranca (CodCobranca, CodCliente, PrecoHora, DataHoraInicial, DataHoraFinal, EmailEnviado)
        VALUES (@codigo, @clienteId, @precoHora, @dataInicial, @dataFinal, 0)
      `)

    await transaction
      .request()
      .input('codigo', novoCodigo)
      .input('clienteId', clienteId)
      .input('dataInicial', dtInicial)
      .input('dataFinal', dtFinal)
      .query(`
        INSERT INTO Cad_Cobranca_Item (CodCobranca, CodAtendimento)
        SELECT @codigo, a.CodAtendimento
        FROM Opr_Atendimento a
        WHERE a.CodCliente = @clienteId
          AND a.DataHoraInicial >= @dataInicial
          AND a.DataHoraFinal <= @dataFinal
          AND a.CobrarAtendimento = 'SIM'
          AND NOT EXISTS (
            SELECT 1 FROM Cad_Cobranca_Item ci2
            WHERE ci2.CodAtendimento = a.CodAtendimento
          )
      `)

    await transaction.request().query(`
      EXEC sp_releaseapplock @Resource = 'Cad_Cobranca_NextId'
    `)

    return novoCodigo
  })
}

export async function markEmailSent(id) {
  await db.execute(`UPDATE Cad_Cobranca SET EmailEnviado = 1 WHERE CodCobranca = @id`, { id })
}

export async function deleteCobranca(id) {
  return db.transaction(async (transaction) => {
    await transaction.request().input('id', id)
      .query('DELETE FROM Cad_Cobranca_Item WHERE CodCobranca = @id')
    await transaction.request().input('id', id)
      .query('DELETE FROM Cad_Cobranca WHERE CodCobranca = @id')
  })
}

export async function deleteCobrancasNaoEnviadas() {
  return db.transaction(async (transaction) => {
    await transaction.request().query(`
      DELETE FROM Cad_Cobranca_Item
      WHERE CodCobranca IN (SELECT CodCobranca FROM Cad_Cobranca WHERE EmailEnviado = 0)
    `)
    const result = await transaction.request().query(
      'DELETE FROM Cad_Cobranca WHERE EmailEnviado = 0'
    )
    return result.rowsAffected[0]
  })
}
