export function criarAtendimento(row) {
  return {
    id: row.id,
    clienteId: row.clienteId,
    dataInicio: new Date(row.dataInicio),
    dataFim: new Date(row.dataFim),
    problema: row.problema || '',
    solucao: row.solucao || '',
    solicitante: row.solicitante || '',
    duracaoMinutos: row.duracaoMinutos || 0,
  }
}
