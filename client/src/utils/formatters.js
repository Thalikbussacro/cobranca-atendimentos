export function horasParaDecimal(horasStr) {
  const match = horasStr.match(/(\d+)h\s*(\d+)m/)
  if (!match) return 0
  return parseInt(match[1]) + parseInt(match[2]) / 60
}

export function formatCnpj(cnpj) {
  if (!cnpj) return ''
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14) return cnpj
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export function formatTelefone(telefone) {
  if (!telefone) return ''
  const digits = telefone.replace(/\D/g, '')
  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }
  if (digits.length === 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  }
  return telefone
}
