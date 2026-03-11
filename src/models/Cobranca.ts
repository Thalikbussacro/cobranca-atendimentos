import { db } from '../config/database'
import { AtendimentoModel } from './Atendimento'

export interface AtendimentoItem {
  data: string
  solicitante: string
  resumo: string
  solucao: string
  tempo: string
}

export interface Cobranca {
  id: number
  cliente: string
  clienteId: number
  clienteCnpj: string
  clienteEmails: string
  periodo: string
  atendimentos: number
  horas: string
  precoHora: number
  emailEnviado: boolean
  itens: AtendimentoItem[]
}

export interface CreateCobrancaDTO {
  cliente: string
  clienteId: number
  dataInicial: string
  dataFinal: string
  precoHora: number
}

const minutosParaHoras = (minutos: number): string => {
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  return `${horas.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`
}

const formatarPeriodo = (dataInicio: Date, dataFim: Date): string => {
  const formatarData = (data: Date) => {
    const dia = data.getDate().toString().padStart(2, '0')
    const mes = (data.getMonth() + 1).toString().padStart(2, '0')
    const ano = data.getFullYear()
    return `${dia}/${mes}/${ano}`
  }

  return `${formatarData(dataInicio)} - ${formatarData(dataFim)}`
}

const formatarData = (data: Date): string => {
  const dia = data.getDate().toString().padStart(2, '0')
  const mes = (data.getMonth() + 1).toString().padStart(2, '0')
  const ano = data.getFullYear()
  return `${dia}/${mes}/${ano}`
}

const parseDataBR = (data: string): Date => {
  if (data.includes('/')) {
    const partes = data.split('/')
    if (partes.length !== 3) {
      throw new Error(`Formato de data inválido: ${data}`)
    }

    const dia = parseInt(partes[0])
    const mes = parseInt(partes[1]) - 1
    const ano = parseInt(partes[2])

    return new Date(ano, mes, dia, 23, 59, 59)
  } else if (data.includes('-')) {
    const partes = data.split('-')
    if (partes.length !== 3) {
      throw new Error(`Formato de data inválido: ${data}`)
    }

    const ano = parseInt(partes[0])
    const mes = parseInt(partes[1]) - 1
    const dia = parseInt(partes[2])

    return new Date(ano, mes, dia, 23, 59, 59)
  } else {
    throw new Error(`Formato de data inválido: ${data}. Use DD/MM/YYYY ou YYYY-MM-DD`)
  }
}

export const CobrancaModel = {
  async findAll(filters?: {
    search?: string
    status?: string
    dataInicial?: string
    dataFinal?: string
  }): Promise<Cobranca[]> {
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

    const params: any = {}

    if (filters?.search) {
      query += ` AND (cl.Descricao LIKE @search OR cl.CNPJ LIKE @search)`
      params.search = `%${filters.search}%`
    }

    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'enviado') {
        query += ` AND c.EmailEnviado = 1`
      } else if (filters.status === 'nao-enviado') {
        query += ` AND c.EmailEnviado = 0`
      }
    }

    if (filters?.dataInicial) {
      const dataInicial = parseDataBR(filters.dataInicial)
      query += ` AND c.DataHoraFinal >= @startDate`
      params.startDate = dataInicial
    }

    if (filters?.dataFinal) {
      const dataFinal = parseDataBR(filters.dataFinal)
      query += ` AND c.DataHoraFinal <= @endDate`
      params.endDate = dataFinal
    }

    query += `
      GROUP BY
        c.CodCobranca, c.CodCliente, cl.Descricao, cl.CNPJ, cl.EMail,
        c.PrecoHora, c.DataHoraInicial, c.DataHoraFinal, c.EmailEnviado
      ORDER BY c.DataHoraFinal DESC
    `

    const result = await db.query(query, params)

    const cobrancas: Cobranca[] = result.map((row: any) => {
      const totalMinutos = row.totalMinutos || 0
      const horas = minutosParaHoras(totalMinutos)
      const periodo = formatarPeriodo(
        new Date(row.DataHoraInicial),
        new Date(row.DataHoraFinal)
      )

      return {
        id: row.id,
        cliente: row.cliente || '',
        clienteId: row.clienteId,
        clienteCnpj: row.clienteCnpj || '',
        clienteEmails: row.clienteEmails || '',
        periodo,
        atendimentos: row.totalAtendimentos || 0,
        horas,
        precoHora: row.precoHora || 0,
        emailEnviado: row.emailEnviado || false,
        itens: [],
      }
    })

    for (const cobranca of cobrancas) {
      const atendimentos = await AtendimentoModel.findByCobranca(cobranca.id)
      cobranca.itens = atendimentos.map((atend) => ({
        data: formatarData(atend.dataInicio),
        solicitante: atend.solicitante,
        resumo: atend.problema,
        solucao: atend.solucao,
        tempo: minutosParaHoras(atend.duracaoMinutos || 0),
      }))
    }

    return cobrancas
  },

  async findById(id: number): Promise<Cobranca | null> {
    const query = `
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
    `

    const result = await db.query(query, { id })

    if (result.length === 0) {
      return null
    }

    const row = result[0]
    const totalMinutos = row.totalMinutos || 0
    const horas = minutosParaHoras(totalMinutos)
    const periodo = formatarPeriodo(
      new Date(row.DataHoraInicial),
      new Date(row.DataHoraFinal)
    )

    const cobranca: Cobranca = {
      id: row.id,
      cliente: row.cliente || '',
      clienteId: row.clienteId,
      clienteCnpj: row.clienteCnpj || '',
      clienteEmails: row.clienteEmails || '',
      periodo,
      atendimentos: row.totalAtendimentos || 0,
      horas,
      precoHora: row.precoHora || 0,
      emailEnviado: row.emailEnviado || false,
      itens: [],
    }

    const atendimentos = await AtendimentoModel.findByCobranca(id)
    cobranca.itens = atendimentos.map((atend) => ({
      data: formatarData(atend.dataInicio),
      solicitante: atend.solicitante,
      resumo: atend.problema,
      solucao: atend.solucao,
      tempo: minutosParaHoras(atend.duracaoMinutos || 0),
    }))

    return cobranca
  },

  async create(data: CreateCobrancaDTO): Promise<Cobranca> {
    const result = await db.transaction(async (transaction) => {
      await transaction.request().query(`
        DECLARE @result INT
        EXEC @result = sp_getapplock @Resource = 'Cad_Cobranca_NextId', @LockMode = 'Exclusive', @LockTimeout = 10000
        IF @result < 0
          THROW 50001, 'Não foi possível obter lock para gerar ID', 1
      `)

      const getMaxIdQuery = `
        SELECT ISNULL(MAX(CodCobranca), 0) + 1 as novoId
        FROM Cad_Cobranca
      `
      const maxIdResult = await transaction.request().query(getMaxIdQuery)
      const novoCodigo = maxIdResult.recordset[0].novoId

      const dataInicial = parseDataBR(data.dataInicial)
      const dataFinal = parseDataBR(data.dataFinal)

      const insertCobrancaQuery = `
        INSERT INTO Cad_Cobranca (CodCobranca, CodCliente, PrecoHora, DataHoraInicial, DataHoraFinal, EmailEnviado)
        VALUES (@codigo, @clienteId, @precoHora, @dataInicial, @dataFinal, 0)
      `

      await transaction
        .request()
        .input('codigo', novoCodigo)
        .input('clienteId', data.clienteId)
        .input('precoHora', data.precoHora)
        .input('dataInicial', dataInicial)
        .input('dataFinal', dataFinal)
        .query(insertCobrancaQuery)

      const insertItensQuery = `
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
      `

      await transaction
        .request()
        .input('codigo', novoCodigo)
        .input('clienteId', data.clienteId)
        .input('dataInicial', dataInicial)
        .input('dataFinal', dataFinal)
        .query(insertItensQuery)

      await transaction.request().query(`
        EXEC sp_releaseapplock @Resource = 'Cad_Cobranca_NextId'
      `)

      return novoCodigo
    })

    const cobrancaCriada = await this.findById(result)
    if (!cobrancaCriada) {
      throw new Error('Erro ao buscar cobrança criada')
    }

    return cobrancaCriada
  },

  async markEmailSent(id: number): Promise<void> {
    const query = `
      UPDATE Cad_Cobranca
      SET EmailEnviado = 1
      WHERE CodCobranca = @id
    `

    await db.execute(query, { id })
  },
}
