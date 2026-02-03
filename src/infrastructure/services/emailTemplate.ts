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
  <title>Cobrança #${cobranca.id}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <!-- Container principal -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Cobrança #${cobranca.id}
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                Empresa Genérica - Sistema de Cobranças
              </p>
            </td>
          </tr>

          <!-- Dados do Cliente -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 15px 0; color: #333333; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                Dados do Cliente
              </h2>
              <table width="100%" cellpadding="5" cellspacing="0">
                <tr>
                  <td style="color: #666666; font-size: 14px; padding: 5px 0;">
                    <strong>Nome:</strong>
                  </td>
                  <td style="color: #333333; font-size: 14px; padding: 5px 0;">
                    ${cobranca.cliente}
                  </td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px; padding: 5px 0;">
                    <strong>CNPJ:</strong>
                  </td>
                  <td style="color: #333333; font-size: 14px; padding: 5px 0;">
                    ${cobranca.clienteCnpj}
                  </td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px; padding: 5px 0;">
                    <strong>Período:</strong>
                  </td>
                  <td style="color: #333333; font-size: 14px; padding: 5px 0;">
                    ${cobranca.periodo}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Resumo Financeiro -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #333333; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                Resumo
              </h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #f8f9fa; border-radius: 4px;">
                <tr>
                  <td style="color: #666666; font-size: 14px;">
                    <strong>Total de Atendimentos:</strong>
                  </td>
                  <td style="color: #333333; font-size: 14px; text-align: right;">
                    ${cobranca.atendimentos}
                  </td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px;">
                    <strong>Horas Totais:</strong>
                  </td>
                  <td style="color: #333333; font-size: 14px; text-align: right;">
                    ${cobranca.horas}
                  </td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px;">
                    <strong>Preço por Hora:</strong>
                  </td>
                  <td style="color: #333333; font-size: 14px; text-align: right;">
                    ${precoHoraFormatado}
                  </td>
                </tr>
                <tr style="border-top: 2px solid #dee2e6;">
                  <td style="color: #333333; font-size: 18px; padding-top: 12px;">
                    <strong>Valor Total:</strong>
                  </td>
                  <td style="color: #667eea; font-size: 24px; font-weight: bold; text-align: right; padding-top: 12px;">
                    ${valorTotal}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tabela de Atendimentos -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #333333; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                Detalhamento dos Atendimentos
              </h2>
              <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #dee2e6; border-radius: 4px;">
                <thead>
                  <tr style="background-color: #667eea;">
                    <th style="color: #ffffff; font-size: 12px; text-align: left; padding: 12px; border-bottom: 2px solid #5568d3;">Data</th>
                    <th style="color: #ffffff; font-size: 12px; text-align: left; padding: 12px; border-bottom: 2px solid #5568d3;">Solicitante</th>
                    <th style="color: #ffffff; font-size: 12px; text-align: left; padding: 12px; border-bottom: 2px solid #5568d3;">Problema</th>
                    <th style="color: #ffffff; font-size: 12px; text-align: left; padding: 12px; border-bottom: 2px solid #5568d3;">Solução</th>
                    <th style="color: #ffffff; font-size: 12px; text-align: center; padding: 12px; border-bottom: 2px solid #5568d3;">Tempo</th>
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
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 13px;">
                <strong>Instruções de Pagamento:</strong>
              </p>
              <p style="margin: 0 0 15px 0; color: #666666; font-size: 13px;">
                Entre em contato para obter os dados bancários para pagamento.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                Este é um email automático. Por favor, não responda.
              </p>
              <p style="margin: 5px 0 0 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} Empresa Genérica. Todos os direitos reservados.
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
