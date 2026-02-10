import { Cobranca } from '@/domain/entities/Cobranca'

/**
 * Calcula o valor total da cobrança
 */
function calcularValorTotal(cobranca: Cobranca): string {
  // Parse horas "08h 40m" -> minutos -> valor
  const horasMatch = cobranca.horas.match(/(\d+)h\s*(\d+)m/)
  if (!horasMatch) {
    return 'R$ 0,00'
  }

  const horas = parseInt(horasMatch[1])
  const minutos = parseInt(horasMatch[2])
  const horasDecimal = horas + minutos / 60
  const total = horasDecimal * cobranca.precoHora

  return total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Formata o preço por hora
 */
function formatarPrecoHora(preco: number): string {
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Gera versão texto plano do email (fallback)
 */
export function gerarTextoPlanoCobranca(cobranca: Cobranca): string {
  const valorTotal = calcularValorTotal(cobranca)
  const precoHoraFormatado = formatarPrecoHora(cobranca.precoHora)

  let texto = `EMPRESA GENÉRICA\n`
  texto += `Atendimentos Prestados - ${cobranca.periodo}\n`
  texto += `================================================================\n\n`

  texto += `Prezado(a) ${cobranca.cliente},\n\n`

  texto += `Segue a relação dos atendimentos técnicos prestados no período de ${cobranca.periodo}.\n\n`

  texto += `FORMA DE PAGAMENTO\n`
  texto += `------------------\n`
  texto += `Por favor, responda este e-mail informando a forma de pagamento:\n\n`
  texto += `( ) PIX\n`
  texto += `( ) Boleto Bancário\n`
  texto += `( ) Transferência Bancária\n\n`
  texto += `Podemos lançar no CNPJ: ${cobranca.clienteCnpj}?\n\n`

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

  texto += `\nFORMA DE PAGAMENTO\n`
  texto += `------------------\n`
  texto += `Por favor, responda este e-mail informando a forma de pagamento:\n\n`
  texto += `( ) PIX\n`
  texto += `( ) Boleto Bancário\n`
  texto += `( ) Transferência Bancária\n\n`
  texto += `Podemos lançar no CNPJ: ${cobranca.clienteCnpj}?\n\n`
  texto += `================================================================\n\n`
  texto += `Atenciosamente,\n`
  texto += `Empresa Genérica\n`
  texto += `Sistema de Cobranças de Atendimentos\n`

  return texto
}

/**
 * Gera HTML completo do email de cobrança
 */
export function gerarHTMLCobranca(cobranca: Cobranca): string {
  const valorTotal = calcularValorTotal(cobranca)
  const precoHoraFormatado = formatarPrecoHora(cobranca.precoHora)

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Empresa Genérica - Atendimentos Prestados - ${cobranca.periodo}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #E8F4F8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #E8F4F8; padding: 20px;">
    <tr>
      <td align="center">
        <!-- Container principal -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #1A5F7A; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                EMPRESA GENÉRICA
              </h1>
              <p style="margin: 10px 0 0 0; color: #E8F4F8; font-size: 16px;">
                Atendimentos Prestados - ${cobranca.periodo}
              </p>
            </td>
          </tr>

          <!-- Saudação Inicial -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <p style="margin: 0 0 15px 0; color: #333333; font-size: 14px; line-height: 1.6;">
                Prezado(a) <strong>${cobranca.cliente}</strong>,
              </p>
              <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                Segue a relação dos atendimentos técnicos prestados no período de <strong>${cobranca.periodo}</strong>.
              </p>
            </td>
          </tr>

          <!-- Forma de Pagamento -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; border-top: 1px solid #dee2e6;">
              <h2 style="margin: 0 0 15px 0; color: #1A5F7A; font-size: 16px; font-weight: bold;">
                Forma de Pagamento
              </h2>
              <p style="margin: 0 0 10px 0; color: #333333; font-size: 13px; line-height: 1.6;">
                Por favor, responda este e-mail informando:
              </p>
              <p style="margin: 0 0 10px 0; color: #333333; font-size: 13px; line-height: 1.6;">
                <strong>Forma de pagamento:</strong> PIX, Boleto Bancário ou Transferência Bancária<br>
                <strong>Se podemos faturar no CNPJ:</strong> ${cobranca.clienteCnpj}
              </p>
            </td>
          </tr>

          <!-- Resumo Financeiro -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1A5F7A; font-size: 16px; font-weight: bold;">
                Resumo Financeiro
              </h2>
              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-left: 3px solid #1A5F7A;">
                <tr>
                  <td style="color: #666666; font-size: 13px;">Total de Atendimentos:</td>
                  <td style="color: #333333; font-size: 13px; font-weight: bold; text-align: right;">${cobranca.atendimentos}</td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 13px;">Horas Totais:</td>
                  <td style="color: #333333; font-size: 13px; font-weight: bold; text-align: right;">${cobranca.horas}</td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 13px;">Preço por Hora:</td>
                  <td style="color: #333333; font-size: 13px; font-weight: bold; text-align: right;">${precoHoraFormatado}</td>
                </tr>
                <tr style="border-top: 2px solid #dee2e6;">
                  <td style="color: #333333; font-size: 15px; padding-top: 10px;"><strong>Valor Total:</strong></td>
                  <td style="color: #1A5F7A; font-size: 18px; font-weight: bold; text-align: right; padding-top: 10px;">${valorTotal}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tabela de Atendimentos -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1A5F7A; font-size: 16px; font-weight: bold;">
                Detalhamento dos Atendimentos
              </h2>
              <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #dee2e6; border-radius: 4px;">
                <thead>
                  <tr style="background-color: #1A5F7A;">
                    <th style="color: #ffffff; font-size: 12px; text-align: left; padding: 12px; border-bottom: 2px solid #0f4a5f;">Data</th>
                    <th style="color: #ffffff; font-size: 12px; text-align: left; padding: 12px; border-bottom: 2px solid #0f4a5f;">Solicitante</th>
                    <th style="color: #ffffff; font-size: 12px; text-align: left; padding: 12px; border-bottom: 2px solid #0f4a5f;">Problema</th>
                    <th style="color: #ffffff; font-size: 12px; text-align: left; padding: 12px; border-bottom: 2px solid #0f4a5f;">Solução</th>
                    <th style="color: #ffffff; font-size: 12px; text-align: center; padding: 12px; border-bottom: 2px solid #0f4a5f;">Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  ${cobranca.itens
                    .map(
                      (item, index) => `
                  <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f8f9fa'};">
                    <td style="color: #333333; font-size: 13px; padding: 10px; border-bottom: 1px solid #dee2e6;">${item.data}</td>
                    <td style="color: #333333; font-size: 13px; padding: 10px; border-bottom: 1px solid #dee2e6;">${item.solicitante}</td>
                    <td style="color: #333333; font-size: 13px; padding: 10px; border-bottom: 1px solid #dee2e6;">${item.resumo}</td>
                    <td style="color: #333333; font-size: 13px; padding: 10px; border-bottom: 1px solid #dee2e6;">${item.solucao}</td>
                    <td style="color: #333333; font-size: 13px; padding: 10px; text-align: center; border-bottom: 1px solid #dee2e6;">${item.tempo}</td>
                  </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1A5F7A; padding: 15px; text-align: center;">
              <p style="margin: 0; color: #E8F4F8; font-size: 12px;">
                Empresa Genérica | Sistema de Cobranças
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
