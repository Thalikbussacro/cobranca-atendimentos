import { IClienteRepository } from '@/domain/repositories/IClienteRepository'
import { Cliente } from '@/domain/entities/Cliente'
import { db } from '@/infrastructure/database/sqlServerConnection'
import { DbCliente } from '@/infrastructure/database/types'

export class ClienteRepositorySQL implements IClienteRepository {
  async findAll(): Promise<Cliente[]> {
    try {
      const query = `
        SELECT
          CodCliente as id,
          Descricao as nome,
          CNPJ as cnpj,
          EMail as emails,
          Telefone as telefone
        FROM Cad_Cliente
        ORDER BY Descricao
      `

      const result = await db.query<DbCliente>(query)

      return result.map((row) => this.mapToCliente(row))
    } catch (error) {
      console.error('Erro ao buscar todos os clientes:', error)
      throw new Error('Erro ao buscar clientes do banco de dados')
    }
  }

  async findById(id: number): Promise<Cliente | null> {
    try {
      const query = `
        SELECT
          CodCliente as id,
          Descricao as nome,
          CNPJ as cnpj,
          EMail as emails,
          Telefone as telefone
        FROM Cad_Cliente
        WHERE CodCliente = @id
      `

      const result = await db.query<DbCliente>(query, { id })

      if (result.length === 0) {
        return null
      }

      return this.mapToCliente(result[0])
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error)
      throw new Error('Erro ao buscar cliente do banco de dados')
    }
  }

  async create(data: Omit<Cliente, 'id'>): Promise<Cliente> {
    try {
      const result = await db.transaction(async (transaction) => {
        // Buscar próximo ID
        const getMaxIdQuery = `
          SELECT ISNULL(MAX(CodCliente), 0) + 1 as novoId
          FROM Cad_Cliente
        `
        const maxIdResult = await transaction.request().query(getMaxIdQuery)
        const novoId = maxIdResult.recordset[0].novoId

        // Inserir cliente
        const insertQuery = `
          INSERT INTO Cad_Cliente (CodCliente, Descricao, CNPJ, EMail, Telefone)
          VALUES (@id, @nome, @cnpj, @emails, @telefone)
        `

        await transaction
          .request()
          .input('id', novoId)
          .input('nome', data.nome)
          .input('cnpj', data.cnpj || null)
          .input('emails', data.emails || null)
          .input('telefone', data.telefone || null)
          .query(insertQuery)

        return { id: novoId, ...data }
      })

      return result
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      throw new Error('Erro ao criar cliente no banco de dados')
    }
  }

  async update(id: number, data: Partial<Cliente>): Promise<Cliente | null> {
    try {
      // Verificar se cliente existe
      const clienteExistente = await this.findById(id)
      if (!clienteExistente) {
        return null
      }

      // Construir query de update dinâmica
      const updates: string[] = []
      const params: any = { id }

      if (data.nome !== undefined) {
        updates.push('Descricao = @nome')
        params.nome = data.nome
      }
      if (data.cnpj !== undefined) {
        updates.push('CNPJ = @cnpj')
        params.cnpj = data.cnpj
      }
      if (data.emails !== undefined) {
        updates.push('EMail = @emails')
        params.emails = data.emails
      }
      if (data.telefone !== undefined) {
        updates.push('Telefone = @telefone')
        params.telefone = data.telefone
      }

      if (updates.length === 0) {
        return clienteExistente
      }

      const updateQuery = `
        UPDATE Cad_Cliente
        SET ${updates.join(', ')}
        WHERE CodCliente = @id
      `

      await db.execute(updateQuery, params)

      // Retornar cliente atualizado
      return await this.findById(id)
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      throw new Error('Erro ao atualizar cliente no banco de dados')
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deleteQuery = `
        DELETE FROM Cad_Cliente
        WHERE CodCliente = @id
      `

      const result = await db.execute(deleteQuery, { id })

      return result.rowsAffected[0] > 0
    } catch (error) {
      console.error('Erro ao deletar cliente:', error)
      throw new Error('Erro ao deletar cliente do banco de dados')
    }
  }

  private mapToCliente(row: any): Cliente {
    return {
      id: row.id,
      nome: row.nome || '',
      cnpj: row.cnpj || '',
      email: row.emails ? row.emails.split(';')[0] : '',
      emails: row.emails || '',
      telefone: row.telefone || '',
    }
  }
}
