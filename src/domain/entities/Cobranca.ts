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
