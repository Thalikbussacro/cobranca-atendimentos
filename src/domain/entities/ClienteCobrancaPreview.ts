export interface ClienteCobrancaPreview {
  clienteId: number
  clienteNome: string
  totalAtendimentos: number
  totalHoras: string
  atendimentosPendentes: number
}

export interface CobrancaPreview {
  clientes: ClienteCobrancaPreview[]
  totalGeral: {
    atendimentos: number
    horas: string
  }
}
