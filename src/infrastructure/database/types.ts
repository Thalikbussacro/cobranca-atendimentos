// Tipos que representam as tabelas do SQL Server

/**
 * Tabela: Cad_Cliente
 * Representa um cliente no banco de dados
 */
export interface DbCliente {
  CodCliente: number
  Descricao: string
  CNPJ: string | null
  EMail: string | null
  Telefone: string | null
}

/**
 * Tabela: Opr_Atendimento
 * Representa um atendimento realizado
 */
export interface DbAtendimento {
  CodAtendimento: number
  CodCliente: number
  DataHoraInicial: Date
  DataHoraFinal: Date
  ProblemaRelatado: string | null
  SolucaoRepassada: string | null
  Solicitante: string | null
  CobrarAtendimento: string // 'SIM' ou 'NAO'
}

/**
 * Tabela: Cad_Cobranca
 * Representa uma cobrança gerada
 */
export interface DbCobranca {
  CodCobranca: number
  CodCliente: number
  PrecoHora: number
  DataHoraInicial: Date
  DataHoraFinal: Date
  EmailEnviado: boolean // BIT no SQL Server
}

/**
 * Tabela: Cad_Cobranca_Item
 * Representa a relação entre cobrança e atendimentos
 */
export interface DbCobrancaItem {
  CodCobranca: number
  CodAtendimento: number
}

/**
 * Resultado agregado de query de cobranças com JOIN
 */
export interface DbCobrancaComCliente {
  // Dados da cobrança
  id: number
  clienteId: number
  precoHora: number
  DataHoraInicial: Date
  DataHoraFinal: Date
  emailEnviado: boolean

  // Dados do cliente
  cliente: string
  clienteCnpj: string | null
  clienteEmails: string | null // mapeado de EMail

  // Dados agregados
  totalAtendimentos: number
  totalMinutos: number
}

/**
 * Resultado de query de atendimento com detalhes
 */
export interface DbAtendimentoDetalhado extends DbAtendimento {
  duracaoMinutos?: number
}
