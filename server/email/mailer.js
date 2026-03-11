import nodemailer from 'nodemailer'

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email.trim())
}

function parseEmails(emailsStr) {
  if (!emailsStr || emailsStr.trim() === '') return []
  return emailsStr
    .split(';')
    .map((e) => e.trim())
    .filter((e) => e && validarEmail(e))
}

function calcularValorTotal(cobranca) {
  const horasMatch = cobranca.horas.match(/(\d+)h\s*(\d+)m/)
  if (!horasMatch) return 'R$ 0,00'

  const horas = parseInt(horasMatch[1])
  const minutos = parseInt(horasMatch[2])
  const horasDecimal = horas + minutos / 60
  const total = horasDecimal * cobranca.precoHora

  return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarPrecoHora(preco) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function gerarTextoPlanoCobranca(cobranca) {
  const valorTotal = calcularValorTotal(cobranca)
  const precoHoraFormatado = formatarPrecoHora(cobranca.precoHora)

  let texto = `EMPRESA GENÉRICA\n`
  texto += `Atendimentos Prestados - ${cobranca.periodo}\n`
  texto += `================================================================\n\n`
  texto += `Prezado(a) ${cobranca.cliente},\n\n`
  texto += `Segue a relação dos atendimentos técnicos prestados no período de ${cobranca.periodo}.\n\n`
  texto += `RESUMO FINANCEIRO\n`
  texto += `-----------------\n`
  texto += `Total de Atendimentos: ${cobranca.atendimentos}\n`
  texto += `Horas Totais: ${cobranca.horas}\n`
  texto += `Preço por Hora: ${precoHoraFormatado}\n`
  texto += `VALOR TOTAL: ${valorTotal}\n\n`
  texto += `DETALHAMENTO DOS ATENDIMENTOS\n`
  texto += `------------------------------\n\n`

  cobranca.itens.forEach((item, index) => {
    texto += `${index + 1}. ${item.data} - ${item.solicitante}\n`
    texto += `   Tempo: ${item.tempo}\n`
    texto += `   Problema: ${item.resumo}\n`
    texto += `   Solução: ${item.solucao}\n\n`
  })

  return texto
}

export async function enviarCobrancaEmail(cobranca) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    throw new Error(
      'Variáveis SMTP não configuradas. Verifique SMTP_HOST e SMTP_USER no .env'
    )
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const emails = parseEmails(cobranca.clienteEmails)

  if (emails.length === 0) {
    throw new Error('Nenhum email válido encontrado para o cliente. Verifique o cadastro.')
  }

  const text = gerarTextoPlanoCobranca(cobranca)
  const subject = `Empresa Genérica - Atendimentos Prestados - ${cobranca.periodo}`

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@empresagenerica.com',
    to: emails.join(', '),
    subject,
    text,
  })

  console.log('✓ EMAIL ENVIADO:', info.messageId)
}
