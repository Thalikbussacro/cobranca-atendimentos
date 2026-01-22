export type StatusCobranca = 
  | 'GERADA'
  | 'ENVIADA'
  | 'ACEITA'
  | 'FATURA_ENVIADA'
  | 'PAGA'
  | 'FINALIZADA'
  | 'CONTESTADA'
  | 'CONTATO_SOLICITADO'
  | 'RECUSADA'

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
  periodo: string
  atendimentos: number
  horas: string
  nf: string
  status: StatusCobranca
  ultimaAcao: string
  notificacao: boolean
  itens: AtendimentoItem[]
  emailsEnviados?: string[]
  ultimaInteracaoCliente?: string
  codigoAcesso?: string
}

export interface CreateCobrancaDTO {
  cliente: string
  clienteId: number
  dataInicial: string
  dataFinal: string
  status: StatusCobranca
}
