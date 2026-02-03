/**
 * Valida se uma string é um email válido usando regex básica
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email.trim())
}

/**
 * Parse string de emails separados por ponto-e-vírgula
 * Retorna apenas emails válidos
 */
export function parseEmails(emailsStr: string): string[] {
  if (!emailsStr || emailsStr.trim() === '') {
    return []
  }

  return emailsStr
    .split(';')
    .map((e) => e.trim())
    .filter((e) => e && validarEmail(e))
}
