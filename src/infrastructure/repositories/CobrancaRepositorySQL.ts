import { ICobrancaRepository } from '@/domain/repositories/ICobrancaRepository'
import { Cobranca, CreateCobrancaDTO, AtendimentoItem } from '@/domain/entities/Cobranca'
import { db, sql } from '@/infrastructure/database/sqlServerConnection'
import { AtendimentoRepositorySQL } from './AtendimentoRepositorySQL'

export class CobrancaRepositorySQL implements ICobrancaRepository {
  private atendimentoRepository: AtendimentoRepositorySQL

  constructor() {
    this.atendimentoRepository = new AtendimentoRepositorySQL()
  }

  async findAll(filters?: {
    search?: string
    status?: string
    periodo?: string
  }): Promise<Cobranca[]> {
    try {
      let query = `
        SELECT
          c.CodCobranca as id,
          c.CodCliente as clienteId,
          cl.Descricao as cliente,
          cl.CNPJ as clienteCnpj,
          cl.Email as clienteEmails,
          c.PrecoHora as precoHora,
          c.DataHoraInicial,
          c.DataHoraFinal,
          c.EmailEnviado as emailEnviado,
          COUNT(ci.CodAtendimento) as totalAtendimentos,
          ISNULL(SUM(DATEDIFF(MINUTE, a.DataHoraInicio, a.DataHoraFim)), 0) as totalMinutos
        FROM Cad_Cobranca c
        INNER JOIN Cad_Cliente cl ON cl.CodCliente = c.CodCliente
        LEFT JOIN Cad_Cobranca_Item ci ON ci.CodCobranca = c.CodCobranca
        LEFT JOIN Opr_Atendimento a ON a.CodAtendimento = ci.CodAtendimento
        WHERE 1=1
      `

      const params: any = {}

      // Filtro de busca
      if (filters?.search) {
        query += ` AND (cl.Descricao LIKE @search OR cl.CNPJ LIKE @search)`
        params.search = `%${filters.search}%`
      }

      // Filtro de status
      if (filters?.status && filters.status !== 'all') {
        if (filters.status === 'enviado') {
          query += ` AND c.EmailEnviado = 1`
        } else if (filters.status === 'nao-enviado') {
          query += ` AND c.EmailEnviado = 0`
        }
      }

      // Filtro de período
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

        query += ` AND c.DataHoraFinal >= @startDate AND c.DataHoraFinal <= @endDate`
        params.startDate = startDate
        params.endDate = endDate
      }

      query += `
        GROUP BY
          c.CodCobranca, c.CodCliente, cl.Descricao, cl.CNPJ, cl.Email,
          c.PrecoHora, c.DataHoraInicial, c.DataHoraFinal, c.EmailEnviado
        ORDER BY c.DataHoraFinal DESC
      `

      const result = await db.query(query, params)

      return result.map((row) => this.mapToCobranca(row))
    } catch (error) {
      console.error('Erro ao buscar todas as cobranças:', error)
      throw new Error('Erro ao buscar cobranças do banco de dados')
    }
  }

  async findById(id: number): Promise<Cobranca | null> {
    try {
      const query = `
        SELECT
          c.CodCobranca as id,
          c.CodCliente as clienteId,
          cl.Descricao as cliente,
          cl.CNPJ as clienteCnpj,
          cl.Email as clienteEmails,
          c.PrecoHora as precoHora,
          c.DataHoraInicial,
          c.DataHoraFinal,
          c.EmailEnviado as emailEnviado,
          COUNT(ci.CodAtendimento) as totalAtendimentos,
          ISNULL(SUM(DATEDIFF(MINUTE, a.DataHoraInicio, a.DataHoraFim)), 0) as totalMinutos
        FROM Cad_Cobranca c
        INNER JOIN Cad_Cliente cl ON cl.CodCliente = c.CodCliente
        LEFT JOIN Cad_Cobranca_Item ci ON ci.CodCobranca = c.CodCobranca
        LEFT JOIN Opr_Atendimento a ON a.CodAtendimento = ci.CodAtendimento
        WHERE c.CodCobranca = @id
        GROUP BY
          c.CodCobranca, c.CodCliente, cl.Descricao, cl.CNPJ, cl.Email,
          c.PrecoHora, c.DataHoraInicial, c.DataHoraFinal, c.EmailEnviado
      `

      const result = await db.query(query, { id })

      if (result.length === 0) {
        return null
      }

      const cobranca = this.mapToCobranca(result[0])

      // Buscar atendimentos da cobrança
      const atendimentos = await this.atendimentoRepository.findByCobranca(id)
      cobranca.itens = atendimentos.map((atend) => ({
        data: this.formatarData(atend.dataInicio),
        solicitante: atend.solicitante,
        resumo: atend.problema,
        solucao: atend.solucao,
        tempo: this.minutosParaHoras(atend.duracaoMinutos || 0),
      }))

      return cobranca
    } catch (error) {
      console.error('Erro ao buscar cobrança por ID:', error)
      throw new Error('Erro ao buscar cobrança do banco de dados')
    }
  }

  async create(data: CreateCobrancaDTO): Promise<Cobranca> {
    try {
      const result = await db.transaction(async (transaction) => {
        // Buscar próximo CodCobranca
        const getMaxIdQuery = `
          SELECT ISNULL(MAX(CodCobranca), 0) + 1 as novoId
          FROM Cad_Cobranca
        `
        const maxIdResult = await transaction.request().query(getMaxIdQuery)
        const novoCodigo = maxIdResult.recordset[0].novoId

        // Converter datas (formato DD/MM/YYYY para Date)
        const dataInicial = this.parseDataBR(data.dataInicial)
        const dataFinal = this.parseDataBR(data.dataFinal)

        // Inserir cobrança
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

        // Inserir itens (atendimentos não cobrados do período)
        const insertItensQuery = `
          INSERT INTO Cad_Cobranca_Item (CodCobranca, CodAtendimento)
          SELECT @codigo, a.CodAtendimento
          FROM Opr_Atendimento a
          WHERE a.CodCliente = @clienteId
            AND a.DataHoraInicio >= @dataInicial
            AND a.DataHoraFim <= @dataFinal
            AND a.CobrarAtendimento = 'Sim'
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

        return novoCodigo
      })

      // Buscar cobrança criada
      const cobrancaCriada = await this.findById(result)
      if (!cobrancaCriada) {
        throw new Error('Erro ao buscar cobrança criada')
      }

      return cobrancaCriada
    } catch (error) {
      console.error('Erro ao criar cobrança:', error)
      throw new Error('Erro ao criar cobrança no banco de dados')
    }
  }

  async update(id: number, data: Partial<Cobranca>): Promise<Cobranca | null> {
    try {
      // Verificar se cobrança existe
      const cobrancaExistente = await this.findById(id)
      if (!cobrancaExistente) {
        return null
      }

      // Construir query de update dinâmica
      const updates: string[] = []
      const params: any = { id }

      if (data.precoHora !== undefined) {
        updates.push('PrecoHora = @precoHora')
        params.precoHora = data.precoHora
      }
      if (data.emailEnviado !== undefined) {
        updates.push('EmailEnviado = @emailEnviado')
        params.emailEnviado = data.emailEnviado ? 1 : 0
      }

      if (updates.length === 0) {
        return cobrancaExistente
      }

      const updateQuery = `
        UPDATE Cad_Cobranca
        SET ${updates.join(', ')}
        WHERE CodCobranca = @id
      `

      await db.execute(updateQuery, params)

      // Retornar cobrança atualizada
      return await this.findById(id)
    } catch (error) {
      console.error('Erro ao atualizar cobrança:', error)
      throw new Error('Erro ao atualizar cobrança no banco de dados')
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await db.transaction(async (transaction) => {
        // Deletar itens primeiro
        const deleteItensQuery = `
          DELETE FROM Cad_Cobranca_Item
          WHERE CodCobranca = @id
        `
        await transaction.request().input('id', id).query(deleteItensQuery)

        // Deletar cobrança
        const deleteCobrancaQuery = `
          DELETE FROM Cad_Cobranca
          WHERE CodCobranca = @id
        `
        await transaction.request().input('id', id).query(deleteCobrancaQuery)
      })

      return true
    } catch (error) {
      console.error('Erro ao deletar cobrança:', error)
      throw new Error('Erro ao deletar cobrança do banco de dados')
    }
  }

  async markEmailSent(id: number): Promise<void> {
    try {
      const query = `
        UPDATE Cad_Cobranca
        SET EmailEnviado = 1
        WHERE CodCobranca = @id
      `

      await db.execute(query, { id })
    } catch (error) {
      console.error('Erro ao marcar e-mail como enviado:', error)
      throw new Error('Erro ao atualizar status de e-mail')
    }
  }

  private mapToCobranca(row: any): Cobranca {
    const totalMinutos = row.totalMinutos || 0
    const horas = this.minutosParaHoras(totalMinutos)
    const periodo = this.formatarPeriodo(
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
  }

  private minutosParaHoras(minutos: number): string {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return `${horas.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`
  }

  private formatarPeriodo(dataInicio: Date, dataFim: Date): string {
    const formatarData = (data: Date) => {
      const dia = data.getDate().toString().padStart(2, '0')
      const mes = (data.getMonth() + 1).toString().padStart(2, '0')
      const ano = data.getFullYear()
      return `${dia}/${mes}/${ano}`
    }

    return `${formatarData(dataInicio)} - ${formatarData(dataFim)}`
  }

  private formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0')
    const mes = (data.getMonth() + 1).toString().padStart(2, '0')
    const ano = data.getFullYear()
    return `${dia}/${mes}/${ano}`
  }

  private parseDataBR(dataBR: string): Date {
    // Formato esperado: DD/MM/YYYY
    const partes = dataBR.split('/')
    if (partes.length !== 3) {
      throw new Error(`Formato de data inválido: ${dataBR}`)
    }

    const dia = parseInt(partes[0])
    const mes = parseInt(partes[1]) - 1 // Mês começa em 0
    const ano = parseInt(partes[2])

    return new Date(ano, mes, dia)
  }
}
