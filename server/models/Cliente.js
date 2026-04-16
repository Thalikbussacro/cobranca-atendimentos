export function criarCliente(row) {
  return {
    id: row.id,
    nome: row.nome || '',
    cnpj: row.cnpj || '',
    email: row.emails ? row.emails.split(';')[0] : '',
    emails: row.emails || '',
    telefone: row.telefone || '',
  }
}
