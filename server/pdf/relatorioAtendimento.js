import PDFDocument from 'pdfkit'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo.png')

const EMPRESA = 'EMPRESA GENÉRICA LTDA'
const EMPRESA_LOCAL = 'Joaçaba - Santa Catarina - Brasil'
const EMPRESA_CURTO = 'EMPRESA GENÉRICA'
const EMPRESA_SITE = 'www.empresa.com.br'
const OPERADOR = 'THALIK RABI BUSSACRO'

function fmtData(date) {
  const d = date.getDate().toString().padStart(2, '0')
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

function fmtDataHora(date) {
  return `${fmtData(date)} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`
}

function fmtHora(date) {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`
}

function fmtDuracao(minutos) {
  const h = Math.floor(minutos / 60).toString().padStart(2, '0')
  const m = (minutos % 60).toString().padStart(2, '0')
  return `${h}:${m}:00`
}

function linhaH(doc, y, x1, x2) {
  doc.moveTo(x1, y).lineTo(x2, y).stroke()
}

/**
 * Trunca texto por palavras até caber na altura máxima disponível.
 * Retorna o texto truncado (com "..." se cortado).
 */
function truncarTexto(doc, texto, width, maxHeight) {
  if (!texto) return ''
  const fullHeight = doc.heightOfString(texto, { width })
  if (fullHeight <= maxHeight) return texto

  // Busca binária por quantidade de caracteres que cabem
  const palavras = texto.split(' ')
  let lo = 0
  let hi = palavras.length
  let melhor = 0

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    const tentativa = palavras.slice(0, mid).join(' ') + '...'
    const h = doc.heightOfString(tentativa, { width })
    if (h <= maxHeight) {
      melhor = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }

  if (melhor === 0) return '...'
  return palavras.slice(0, melhor).join(' ') + '...'
}

function desenharPagina(doc, cobranca, item, pageIndex, totalPages) {
  const agora = new Date()
  const margin = 40
  const pageW = doc.page.width - margin * 2
  const rightEdge = margin + pageW

  doc.lineWidth(0.5).strokeColor('#333')

  // === CABEÇALHO ===
  let y = margin

  // Logo
  try {
    doc.image(LOGO_PATH, margin, y, { height: 40 })
  } catch {
    // sem logo, segue com texto
  }

  // Dados empresa (ao lado do logo)
  const textoX = margin + 130
  doc.font('Helvetica-Bold').fontSize(9)
  doc.text(EMPRESA, textoX, y + 2, { width: 350 })
  doc.font('Helvetica').fontSize(7)
  doc.text(EMPRESA_LOCAL, textoX, y + 14)
  doc.text(EMPRESA_CURTO, textoX, y + 24)
  doc.font('Helvetica-Bold').fontSize(8)
  doc.text('RELATÓRIO DE ATENDIMENTO INDIVIDUAL', textoX, y + 35)

  // Data/hora/página (canto direito)
  doc.font('Helvetica').fontSize(7)
  const infoX = rightEdge - 130
  doc.text(`Data: ${fmtData(agora)}`, infoX, y + 2, { width: 130, align: 'right' })
  doc.text(`Hora: ${fmtHora(agora)}`, infoX, y + 12, { width: 130, align: 'right' })
  doc.text(`Página: ${pageIndex} / ${totalPages}`, infoX, y + 22, { width: 130, align: 'right' })

  y += 50
  linhaH(doc, y, margin, rightEdge)

  // === DADOS DO ATENDIMENTO ===
  y += 8
  const col1 = margin + 5
  const col2 = margin + pageW * 0.55

  doc.font('Helvetica-Bold').fontSize(8)
  doc.text(`ATENDIMENTO:  ${item.id}`, col1, y)
  doc.text(`PROTOCOLO DE ATENDIMENTO:  ${item.protocolo || ''}`, col2, y)

  y += 14
  doc.text(`CLIENTE:  ${cobranca.clienteId} - ${cobranca.cliente}`, col1, y)
  doc.text(`CIDADE:  ${cobranca.clienteCidade || ''}`, col2, y)

  y += 14
  doc.text(`SISTEMA:  ${item.sistema || ''}`, col1, y)

  y += 14
  doc.text(`TIPO DE ATENDIMENTO:  ${item.tipoAtendimento || ''}`, col1, y)
  doc.text(`DEPARTAMENTO:  ${item.departamento || ''}`, col2, y)

  y += 14
  doc.text(`SOLICITANTE:  ${item.solicitante || ''}`, col1, y)
  doc.text(`OPERADOR DO ATEND.:  ${OPERADOR}`, col2, y)

  y += 14
  doc.text(`PRIORIDADE:  ${item.prioridade || 'Normal'}`, col2, y)
  doc.text(`STATUS:  ${item.status || 'Finalizado'}`, col2 + 150, y)

  y += 16
  linhaH(doc, y, margin, rightEdge)

  // === COBRAR ATENDIMENTO ===
  const cobrarAltura = 26
  const cobrarLinhaTop = y
  const cobrarLinhaBot = y + cobrarAltura
  doc.font('Helvetica-Bold').fontSize(8)
  const cobrarTexto = 'COBRAR ATENDIMENTO DO CLIENTE?'
  const cbSize = 10
  const textH = 8 // altura aproximada da fonte
  const cobrarTextY = cobrarLinhaTop + (cobrarAltura - textH) / 2
  doc.text(cobrarTexto, col1, cobrarTextY)

  // checkbox
  const cbX = col1 + doc.widthOfString(cobrarTexto) + 10
  doc.rect(cbX, cobrarTextY - 1, cbSize, cbSize).stroke()
  if (item.cobrar === 'SIM') {
    doc.font('Helvetica-Bold').fontSize(9)
    doc.text('X', cbX + 2, cobrarTextY - 1)
  }

  y = cobrarLinhaBot
  linhaH(doc, y, margin, rightEdge)

  // === RELATAÇÃO COMPLETA ===
  y += 8
  doc.font('Helvetica-Bold').fontSize(9)
  doc.text('Relatação Completa do Atendimento:', col1, y, { width: pageW - 10 })
  y += 16

  const textWidth = pageW - 10

  // Limite inferior: rodapé começa 110px acima do fim da página, com margem de segurança
  const footerBase = doc.page.height - margin - 110
  const maxTextY = footerBase - 20 // margem antes do rodapé

  // Espaço reservado para labels + finalização (SUPORTE: + label + linha final)
  const reservaSuporte = 40 // label SUPORTE + espaço
  const reservaFinal = 20  // linha de finalização

  // Abertura
  doc.font('Helvetica-Bold').fontSize(7.5)
  doc.text(`> Abertura de Atendimento: ${fmtDataHora(item.dataInicio)}`, col1, y, { width: textWidth })
  y += 12

  // CLIENTE (problema)
  if (y < maxTextY) {
    doc.font('Helvetica-Bold').fontSize(7.5)
    doc.text('CLIENTE:', col1, y, { width: textWidth })
    y += 10
  }
  if (y < maxTextY) {
    doc.font('Helvetica').fontSize(7.5)
    const maxH = maxTextY - y - reservaSuporte - reservaFinal
    if (maxH > 0) {
      const textoTruncado = truncarTexto(doc, item.resumo, textWidth, maxH)
      doc.text(textoTruncado, col1, y, { width: textWidth })
      const alturaReal = doc.heightOfString(textoTruncado, { width: textWidth })
      y += alturaReal + 10
    }
  }

  // SUPORTE (solução)
  if (y < maxTextY) {
    doc.font('Helvetica-Bold').fontSize(7.5)
    doc.text('SUPORTE:', col1, y, { width: textWidth })
    y += 10
  }
  if (y < maxTextY) {
    doc.font('Helvetica').fontSize(7.5)
    const maxH = maxTextY - y - reservaFinal
    if (maxH > 0) {
      const textoTruncado = truncarTexto(doc, item.solucao, textWidth, maxH)
      doc.text(textoTruncado, col1, y, { width: textWidth })
      const alturaReal = doc.heightOfString(textoTruncado, { width: textWidth })
      y += alturaReal + 10
    }
  }

  // Finalização
  if (y < maxTextY) {
    doc.font('Helvetica-Bold').fontSize(7.5)
    doc.text(`> Finalizado o Atendimento: ${fmtDataHora(item.dataFim)}`, col1, y, { width: textWidth })
  }

  // Linha de datas
  linhaH(doc, footerBase, margin, rightEdge)
  doc.font('Helvetica-Bold').fontSize(8)
  const duracao = fmtDuracao(item.duracaoMinutos || 0)
  doc.text(
    `ATENDIMENTO -> INÍCIO:  ${fmtDataHora(item.dataInicio)}     FINAL:  ${fmtDataHora(item.dataFim)}     TEMPO TOTAL: ${duracao}`,
    col1,
    footerBase + 8,
    { width: textWidth }
  )

  // Assinaturas
  const assinaturaY = footerBase + 28
  linhaH(doc, assinaturaY, margin, rightEdge)

  const assinaCol1 = margin + 50
  const assinaCol2 = margin + pageW * 0.55 + 50
  const linhaAssinaW = 180

  // Linhas de assinatura (espaço para assinar)
  const linhaAssinaY = assinaturaY + 35
  doc.lineWidth(0.5)
  linhaH(doc, linhaAssinaY, assinaCol1, assinaCol1 + linhaAssinaW)
  linhaH(doc, linhaAssinaY, assinaCol2, assinaCol2 + linhaAssinaW)

  // Nome e cargo abaixo da linha
  doc.font('Helvetica-Bold').fontSize(8)
  doc.text(OPERADOR, assinaCol1, linhaAssinaY + 4, { width: linhaAssinaW, align: 'center' })
  doc.font('Helvetica').fontSize(7)
  doc.text('Responsável Atendimento ao Cliente', assinaCol1, linhaAssinaY + 16, { width: linhaAssinaW, align: 'center' })

  doc.font('Helvetica-Bold').fontSize(8)
  doc.text(item.solicitante || '', assinaCol2, linhaAssinaY + 4, { width: linhaAssinaW, align: 'center' })
  doc.font('Helvetica').fontSize(7)
  doc.text('Solicitante do Atendimento', assinaCol2, linhaAssinaY + 16, { width: linhaAssinaW, align: 'center' })

  // Barra inferior
  const barraY = linhaAssinaY + 35
  linhaH(doc, barraY, margin, rightEdge)
  doc.font('Helvetica-Bold').fontSize(7)
  doc.text(EMPRESA_CURTO, col1, barraY + 4)
  doc.font('Helvetica').fontSize(7)
  doc.text(EMPRESA_SITE, margin + pageW * 0.4, barraY + 4)

  linhaH(doc, barraY + 16, margin, rightEdge)
}

export function gerarPdfCobranca(cobranca) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
      autoFirstPage: false,
    })

    const chunks = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const itens = cobranca.itens || []
    const total = itens.length

    itens.forEach((item, index) => {
      doc.addPage()
      // Bloquear auto-paginação do pdfkit durante o desenho da página.
      // Sem isso, qualquer .text() que ultrapasse a margem inferior
      // faz o pdfkit criar uma página fantasma automaticamente.
      const originalAddPage = doc.addPage
      doc.addPage = () => doc
      desenharPagina(doc, cobranca, item, index + 1, total)
      doc.addPage = originalAddPage
    })

    if (total === 0) {
      doc.addPage()
      doc.font('Helvetica').fontSize(12)
      doc.text('Nenhum atendimento encontrado para esta cobrança.', 40, 100)
    }

    doc.end()
  })
}
