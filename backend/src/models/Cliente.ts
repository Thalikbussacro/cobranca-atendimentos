import { db } from '../config/database'

export interface Cliente {
  id: number
  nome: string
  cnpj: string
  email: string
  emails: string
  telefone: string
}

export const ClienteModel = {
  async findAll(): Promise<Cliente[]> {
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

    const result = await db.query(query)

    return result.map((row: any) => ({
      id: row.id,
      nome: row.nome || '',
      cnpj: row.cnpj || '',
      email: row.emails ? row.emails.split(';')[0] : '',
      emails: row.emails || '',
      telefone: row.telefone || '',
    }))
  },

  async findById(id: number): Promise<Cliente | null> {
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

    const result = await db.query(query, { id })

    if (result.length === 0) {
      return null
    }

    const row = result[0]
    return {
      id: row.id,
      nome: row.nome || '',
      cnpj: row.cnpj || '',
      email: row.emails ? row.emails.split(';')[0] : '',
      emails: row.emails || '',
      telefone: row.telefone || '',
    }
  },
}
