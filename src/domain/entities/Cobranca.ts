export type StatusCobranca = 
  | 'ABERTO' 
  | 'AGUARDANDO_NF' 
  | 'ENVIADA' 
  | 'PAGA' 
  | 'CONTESTADA' 
  | 'CANCELADA'

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
  periodo: string
  atendimentos: number
  horas: string
  nf: string
  status: StatusCobranca
  ultimaAcao: string
  notificacao: boolean
  itens: AtendimentoItem[]
}

export interface CreateCobrancaDTO {
  cliente: string
  dataInicial: string
  dataFinal: string
  status: StatusCobranca
}
