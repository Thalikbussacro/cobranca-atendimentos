export interface EmailEnvio {
  destinatario: string
  dataEnvio: Date
  status: 'enviado' | 'falhou' | 'lido'
}

export interface CobrancaEmail {
  cobrancaId: number
  emails: EmailEnvio[]
  ultimoEnvio?: Date
}
