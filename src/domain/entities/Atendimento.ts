export interface Atendimento {
  id: number
  clienteId: number
  dataInicio: Date
  dataFim: Date
  problema: string
  solucao: string
  solicitante: string
  cobrarAtendimento: boolean
  duracaoMinutos?: number
}

export interface CreateAtendimentoDTO {
  clienteId: number
  dataInicio: Date
  dataFim: Date
  problema: string
  solucao: string
  solicitante: string
  cobrarAtendimento: boolean
}
