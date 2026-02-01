export interface Cliente {
  id: number
  nome: string
  cnpj: string
  email: string
  emails: string // String com emails separados por ; (ex: "email1@test.com;email2@test.com")
  telefone: string
}
