import { enviarCobrancaEmail } from '../email/mailer.js'
import { markEmailSent } from '../repositories/cobrancaRepository.js'
import { buscarCobrancaPorId, listarCobrancas } from './cobrancaService.js'

export async function enviarCobranca(cobrancaId) {
  const cobranca = await buscarCobrancaPorId(cobrancaId)

  if (!cobranca) {
    throw Object.assign(new Error('Cobrança não encontrada'), { statusCode: 404 })
  }

  if (!cobranca.clienteEmails || cobranca.clienteEmails.trim() === '') {
    throw Object.assign(new Error('Cliente não possui emails cadastrados'), { statusCode: 400 })
  }

  await enviarCobrancaEmail(cobranca)
  await markEmailSent(cobrancaId)
}

export async function enviarTodasPendentes() {
  const cobrancas = await listarCobrancas({ status: 'nao-enviado' })

  if (cobrancas.length === 0) {
    return 0
  }

  let enviadas = 0

  for (const cobranca of cobrancas) {
    if (!cobranca.clienteEmails || cobranca.clienteEmails.trim() === '') {
      continue
    }

    await enviarCobrancaEmail(cobranca)
    await markEmailSent(cobranca.id)
    enviadas++
  }

  return enviadas
}
