export function minutosParaHoras(minutos) {
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  return `${horas.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`
}

export function formatarPeriodo(dataInicio, dataFim) {
  const fmt = (d) => {
    const dia = d.getDate().toString().padStart(2, '0')
    const mes = (d.getMonth() + 1).toString().padStart(2, '0')
    const ano = d.getFullYear()
    return `${dia}/${mes}/${ano}`
  }
  return `${fmt(dataInicio)} - ${fmt(dataFim)}`
}

export function formatarData(data) {
  const dia = data.getDate().toString().padStart(2, '0')
  const mes = (data.getMonth() + 1).toString().padStart(2, '0')
  const ano = data.getFullYear()
  return `${dia}/${mes}/${ano}`
}

export function parseDataISO(data) {
  const [ano, mes, dia] = data.split('-').map(Number)
  return new Date(ano, mes - 1, dia, 23, 59, 59)
}

export function calcularValorTotal(cobranca) {
  const horasMatch = cobranca.horas.match(/(\d+)h\s*(\d+)m/)
  if (!horasMatch) return 'R$ 0,00'

  const horas = parseInt(horasMatch[1])
  const minutos = parseInt(horasMatch[2])
  const horasDecimal = horas + minutos / 60
  const total = horasDecimal * cobranca.precoHora

  return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
