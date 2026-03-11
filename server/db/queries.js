import { db } from './connection.js'

// === Helpers ===

function minutosParaHoras(minutos) {
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  return `${horas.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`
}

function formatarPeriodo(dataInicio, dataFim) {
  const fmt = (d) => {
    const dia = d.getDate().toString().padStart(2, '0')
    const mes = (d.getMonth() + 1).toString().padStart(2, '0')
    const ano = d.getFullYear()
    return `${dia}/${mes}/${ano}`
  }
  return `${fmt(dataInicio)} - ${fmt(dataFim)}`
}

function formatarData(data) {
  const dia = data.getDate().toString().padStart(2, '0')
  const mes = (data.getMonth() + 1).toString().padStart(2, '0')
  const ano = data.getFullYear()
  return `${dia}/${mes}/${ano}`
}

function parseDataISO(data) {
  const [ano, mes, dia] = data.split('-').map(Number)
  return new Date(ano, mes - 1, dia, 23, 59, 59)
}

// === Clientes ===

export async function findAllClientes() {
  const result = await db.query(`
    SELECT
      CodCliente as id,
      Descricao as nome,
      CNPJ as cnpj,
      EMail as emails,
      Telefone as telefone
    FROM Cad_Cliente
    ORDER BY Descricao
  `)

  return result.map((row) => ({
    id: row.id,
    nome: row.nome || '',
    cnpj: row.cnpj || '',
    email: row.emails ? row.emails.split(';')[0] : '',
    emails: row.emails || '',
    telefone: row.telefone || '',
  }))
}

export async function findClienteById(id) {
  const result = await db.query(
    `
    SELECT
      CodCliente as id,
      Descricao as nome,
      CNPJ as cnpj,
      EMail as emails,
      Telefone as telefone
    FROM Cad_Cliente
    WHERE CodCliente = @id
  `,
    { id }
  )

  if (result.length === 0) return null

  const row = result[0]
  return {
    id: row.id,
    nome: row.nome || '',
    cnpj: row.cnpj || '',
    email: row.emails ? row.emails.split(';')[0] : '',
    emails: row.emails || '',
    telefone: row.telefone || '',
  }
}

// === Atendimentos ===

export async function findAtendimentosByClienteAndPeriodo(clienteId, dataInicio, dataFim) {
  const result = await db.query(
    `
    SELECT
      a.CodAtendimento as id,
      a.CodCliente as clienteId,
      a.DataHoraInicial as dataInicio,
      a.DataHoraFinal as dataFim,
      a.ProblemaRelatado as problema,
      a.SolucaoRepassada as solucao,
      a.Solicitante as solicitante,
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

  return result.map((row) => ({
    id: row.id,
    clienteId: row.clienteId,
    dataInicio: new Date(row.dataInicio),
    dataFim: new Date(row.dataFim),
    problema: row.problema || '',
    solucao: row.solucao || '',
    solicitante: row.solicitante || '',
    duracaoMinutos: row.duracaoMinutos || 0,
  }))
}

export async function findAtendimentosByCobranca(cobrancaId) {
  const result = await db.query(
    `
    SELECT
      a.CodAtendimento as id,
      a.CodCliente as clienteId,
      a.DataHoraInicial as dataInicio,
      a.DataHoraFinal as dataFim,
      a.ProblemaRelatado as problema,
      a.SolucaoRepassada as solucao,
      a.Solicitante as solicitante,
      DATEDIFF(MINUTE, a.DataHoraInicial, a.DataHoraFinal) as duracaoMinutos
    FROM Opr_Atendimento a
    INNER JOIN Cad_Cobranca_Item ci ON ci.CodAtendimento = a.CodAtendimento
    WHERE ci.CodCobranca = @cobrancaId
    ORDER BY a.DataHoraInicial
  `,
    { cobrancaId }
  )

  return result.map((row) => ({
    id: row.id,
    clienteId: row.clienteId,
    dataInicio: new Date(row.dataInicio),
    dataFim: new Date(row.dataFim),
    problema: row.problema || '',
    solucao: row.solucao || '',
    solicitante: row.solicitante || '',
    duracaoMinutos: row.duracaoMinutos || 0,
  }))
}

// === Cobranças ===

export async function findAllCobrancas(filters = {}) {
  let query = `
    SELECT
      c.CodCobranca as id,
      c.CodCliente as clienteId,
      cl.Descricao as cliente,
      cl.CNPJ as clienteCnpj,
      cl.EMail as clienteEmails,
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
      c.CodCobranca, c.CodCliente, cl.Descricao, cl.CNPJ, cl.EMail,
      c.PrecoHora, c.DataHoraInicial, c.DataHoraFinal, c.EmailEnviado
    ORDER BY c.DataHoraFinal DESC
  `

  const result = await db.query(query, params)

  const cobrancas = result.map((row) => ({
    id: row.id,
    cliente: row.cliente || '',
    clienteId: row.clienteId,
    clienteCnpj: row.clienteCnpj || '',
    clienteEmails: row.clienteEmails || '',
    periodo: formatarPeriodo(new Date(row.DataHoraInicial), new Date(row.DataHoraFinal)),
    atendimentos: row.totalAtendimentos || 0,
    horas: minutosParaHoras(row.totalMinutos || 0),
    precoHora: row.precoHora || 0,
    emailEnviado: row.emailEnviado || false,
    itens: [],
  }))

  for (const cobranca of cobrancas) {
    const atendimentos = await findAtendimentosByCobranca(cobranca.id)
    cobranca.itens = atendimentos.map((atend) => ({
      data: formatarData(atend.dataInicio),
      solicitante: atend.solicitante,
      resumo: atend.problema,
      solucao: atend.solucao,
      tempo: minutosParaHoras(atend.duracaoMinutos || 0),
    }))
  }

  return cobrancas
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
      c.CodCobranca, c.CodCliente, cl.Descricao, cl.CNPJ, cl.EMail,
      c.PrecoHora, c.DataHoraInicial, c.DataHoraFinal, c.EmailEnviado
  `,
    { id }
  )

  if (result.length === 0) return null

  const row = result[0]
  const cobranca = {
    id: row.id,
    cliente: row.cliente || '',
    clienteId: row.clienteId,
    clienteCnpj: row.clienteCnpj || '',
    clienteEmails: row.clienteEmails || '',
    periodo: formatarPeriodo(new Date(row.DataHoraInicial), new Date(row.DataHoraFinal)),
    atendimentos: row.totalAtendimentos || 0,
    horas: minutosParaHoras(row.totalMinutos || 0),
    precoHora: row.precoHora || 0,
    emailEnviado: row.emailEnviado || false,
    itens: [],
  }

  const atendimentos = await findAtendimentosByCobranca(id)
  cobranca.itens = atendimentos.map((atend) => ({
    data: formatarData(atend.dataInicio),
    solicitante: atend.solicitante,
    resumo: atend.problema,
    solucao: atend.solucao,
    tempo: minutosParaHoras(atend.duracaoMinutos || 0),
  }))

  return cobranca
}

export async function createCobranca({ clienteId, dataInicial, dataFinal, precoHora }) {
  const dtInicial = parseDataISO(dataInicial)
  const dtFinal = parseDataISO(dataFinal)

  const novoCodigo = await db.transaction(async (transaction) => {
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

  const cobranca = await findCobrancaById(novoCodigo)
  if (!cobranca) throw new Error('Erro ao buscar cobrança criada')
  return cobranca
}

export async function markEmailSent(id) {
  await db.execute(`UPDATE Cad_Cobranca SET EmailEnviado = 1 WHERE CodCobranca = @id`, { id })
}
