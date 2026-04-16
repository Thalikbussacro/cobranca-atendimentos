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
    cobrar: row.cobrar || 'SIM',
    protocolo: row.protocolo || '',
    sistema: row.sistema || '',
    tipoAtendimento: row.tipoAtendimento || '',
    departamento: row.departamento || '',
    prioridade: row.prioridade || 'Normal',
    status: row.status || 'Finalizado',
  }
}
