import { minutosParaHoras, formatarPeriodo } from '../utils/formatters.js'

export function criarCobranca(row) {
  return {
    id: row.id,
    cliente: row.cliente || '',
    clienteId: row.clienteId,
    clienteCnpj: row.clienteCnpj || '',
    clienteEmails: row.clienteEmails || '',
    periodo: formatarPeriodo(new Date(row.DataHoraInicial), new Date(row.DataHoraFinal)),
    atendimentos: row.totalAtendimentos || 0,
    horas: minutosParaHoras(row.totalMinutos || 0),
    precoHora: row.precoHora || 0,
    emailEnviado: row.emailEnviado || false,
    itens: [],
  }
}

export function criarItemCobranca(atendimento) {
  return {
    data: atendimento.dataFormatada,
    solicitante: atendimento.solicitante,
    resumo: atendimento.problema,
    solucao: atendimento.solucao,
    tempo: atendimento.tempoFormatado,
  }
}
