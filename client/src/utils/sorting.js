export function sortCobrancas(cobrancas, sortState) {
  if (!sortState.field || !sortState.direction) return cobrancas

  return [...cobrancas].sort((a, b) => {
    let comparison = 0

    switch (sortState.field) {
      case 'id':
        comparison = a.id - b.id
        break
      case 'cliente':
        comparison = a.cliente.localeCompare(b.cliente)
        break
      case 'periodo':
        comparison = a.periodo.localeCompare(b.periodo)
        break
      case 'atendimentos':
        comparison = a.atendimentos - b.atendimentos
        break
      case 'emailEnviado':
        comparison = (a.emailEnviado ? 1 : 0) - (b.emailEnviado ? 1 : 0)
        break
    }

    return sortState.direction === 'asc' ? comparison : -comparison
  })
}
