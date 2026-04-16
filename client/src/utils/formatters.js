export function horasParaDecimal(horasStr) {
  const match = horasStr.match(/(\d+)h\s*(\d+)m/)
  if (!match) return 0
  return parseInt(match[1]) + parseInt(match[2]) / 60
}
