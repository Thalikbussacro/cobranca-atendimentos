import { listarCobrancas, gerarPreview, gerarCobrancas, cancelarCobranca, cancelarTodasNaoEnviadas } from '../services/cobrancaService.js'
import { enviarCobranca, enviarTodasPendentes } from '../services/emailService.js'

export async function listar(req, res) {
  try {
    const { search, status, inicio, fim } = req.query
    const cobrancas = await listarCobrancas({ search, status, inicio, fim })
    return res.json({ cobrancas })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao buscar cobranças' })
  }
}

export async function preview(req, res) {
  try {
    const { clienteId, dataInicial, dataFinal } = req.query

    if (!clienteId || !dataInicial || !dataFinal) {
      return res.status(400).json({ success: false, message: 'Parâmetros inválidos' })
    }

    const result = await gerarPreview(clienteId, dataInicial, dataFinal)

    if (result === null) {
      return res.status(404).json({ success: false, message: 'Cliente não encontrado' })
    }

    return res.json({ preview: result })
  } catch (error) {
    console.error('Erro ao gerar preview:', error)
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Erro ao gerar preview' })
  }
}

export async function gerar(req, res) {
  try {
    const { clienteIds, inicio, fim, precoHora } = req.body

    if (!clienteIds?.length || !inicio || !fim || !precoHora) {
      return res.status(400).json({ success: false, message: 'Parâmetros inválidos' })
    }

    const cobrancas = await gerarCobrancas(clienteIds, inicio, fim, precoHora)
    return res.json({ success: true, cobrancas })
  } catch (error) {
    console.error('Erro ao gerar cobranças:', error)
    return res
      .status(400)
      .json({ success: false, message: error.message || 'Erro ao gerar cobranças' })
  }
}

export async function enviar(req, res) {
  try {
    const cobrancaId = parseInt(req.params.id)
    await enviarCobranca(cobrancaId)
    return res.json({ success: true, message: 'E-mail enviado com sucesso' })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    const statusCode = error.statusCode || 500
    return res
      .status(statusCode)
      .json({ success: false, message: error.message || 'Erro ao enviar e-mail' })
  }
}

export async function cancelar(req, res) {
  try {
    const id = parseInt(req.params.id)
    await cancelarCobranca(id)
    return res.json({ success: true, message: 'Cobrança cancelada com sucesso' })
  } catch (error) {
    console.error('Erro ao cancelar cobrança:', error)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({ success: false, message: error.message || 'Erro ao cancelar cobrança' })
  }
}

export async function cancelarTodas(req, res) {
  try {
    const canceladas = await cancelarTodasNaoEnviadas()
    return res.json({
      success: true,
      message: `${canceladas} cobrança(s) cancelada(s) com sucesso`,
      canceladas,
    })
  } catch (error) {
    console.error('Erro ao cancelar cobranças:', error)
    return res.status(500).json({ success: false, message: error.message || 'Erro ao cancelar cobranças' })
  }
}

export async function enviarTodas(req, res) {
  try {
    const enviadas = await enviarTodasPendentes()

    if (enviadas === 0) {
      return res.json({ success: true, message: 'Nenhuma cobrança pendente', enviadas: 0 })
    }

    return res.json({
      success: true,
      message: `${enviadas} e-mail(s) enviado(s) com sucesso`,
      enviadas,
    })
  } catch (error) {
    console.error('Erro ao enviar e-mails:', error)
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Erro ao enviar e-mails' })
  }
}
