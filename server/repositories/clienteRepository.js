import { db } from '../db/connection.js'

export async function findAllClientes() {
  return db.query(`
    SELECT
      CodCliente as id,
      Descricao as nome,
      CNPJ as cnpj,
      EMail as emails,
      Telefone as telefone
    FROM Cad_Cliente
    ORDER BY Descricao
  `)
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

  return result.length === 0 ? null : result[0]
}
