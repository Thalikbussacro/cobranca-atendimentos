import { Router } from 'express'
import {
  findAllCobrancas,
  findCobrancaById,
  findAtendimentosByClienteAndPeriodo,
  findAllClientes,
  findClienteById,
  createCobranca,
  markEmailSent,
} from '../db/queries.js'
import { enviarCobrancaEmail } from '../email/mailer.js'

const router = Router()

// GET / — listar cobranças (filtros: search, status, inicio, fim)
router.get('/', async (req, res) => {
  try {
    const { search, status, inicio, fim } = req.query
    const cobrancas = await findAllCobrancas({ search, status, inicio, fim })
    return res.json({ cobrancas })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao buscar cobranças' })
  }
})

// GET /preview — preview de atendimentos por cliente/periodo
router.get('/preview', async (req, res) => {
  try {
    const { clienteId: clienteIdParam, dataInicial, dataFinal } = req.query

    if (!clienteIdParam || !dataInicial || !dataFinal) {
      return res.status(400).json({ success: false, message: 'Parâmetros inválidos' })
    }

    const parseDataISO = (dateStr) => {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day, 23, 59, 59)
    }

    const dtInicial = parseDataISO(dataInicial)
    const dtFinal = parseDataISO(dataFinal)
    const preview = []

    if (clienteIdParam === 'todos') {
      const clientes = await findAllClientes()

      for (const cliente of clientes) {
        const atendimentos = await findAtendimentosByClienteAndPeriodo(
          cliente.id,
          dtInicial,
          dtFinal
        )

        if (atendimentos.length > 0) {
          const totalMinutos = atendimentos.reduce(
            (acc, atend) => acc + (atend.duracaoMinutos || 0),
            0
          )
          const horas = Math.floor(totalMinutos / 60)
          const minutos = totalMinutos % 60

          preview.push({
            clienteId: cliente.id,
            clienteNome: cliente.nome,
            atendimentos: atendimentos.length,
            tempo: `${horas}h ${minutos.toString().padStart(2, '0')}m`,
          })
        }
      }
    } else {
      const clienteId = parseInt(clienteIdParam)
      const cliente = await findClienteById(clienteId)

      if (!cliente) {
        return res.status(404).json({ success: false, message: 'Cliente não encontrado' })
      }

      const atendimentos = await findAtendimentosByClienteAndPeriodo(
        clienteId,
        dtInicial,
        dtFinal
      )

      const totalMinutos = atendimentos.reduce(
        (acc, atend) => acc + (atend.duracaoMinutos || 0),
        0
      )
      const horas = Math.floor(totalMinutos / 60)
      const minutos = totalMinutos % 60

      preview.push({
        clienteId: cliente.id,
        clienteNome: cliente.nome,
        atendimentos: atendimentos.length,
        tempo: `${horas}h ${minutos.toString().padStart(2, '0')}m`,
      })
    }

    return res.json({ preview })
  } catch (error) {
    console.error('Erro ao gerar preview:', error)
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Erro ao gerar preview' })
  }
})

// POST /gerar — gerar cobranças para múltiplos clientes
router.post('/gerar', async (req, res) => {
  try {
    const { clienteIds, inicio, fim, precoHora } = req.body

    if (!clienteIds?.length || !inicio || !fim || !precoHora) {
      return res.status(400).json({ success: false, message: 'Parâmetros inválidos' })
    }

    const cobrancasCriadas = []

    for (const clienteId of clienteIds) {
      const cobranca = await createCobranca({
        clienteId,
        dataInicial: inicio,
        dataFinal: fim,
        precoHora,
      })
      cobrancasCriadas.push(cobranca)
    }

    return res.json({ success: true, cobrancas: cobrancasCriadas })
  } catch (error) {
    console.error('Erro ao gerar cobranças:', error)
    return res
      .status(400)
      .json({ success: false, message: error.message || 'Erro ao gerar cobranças' })
  }
})

// POST /enviar/:id — enviar email de uma cobrança
router.post('/enviar/:id', async (req, res) => {
  try {
    const cobrancaId = parseInt(req.params.id)
    const cobranca = await findCobrancaById(cobrancaId)

    if (!cobranca) {
      return res.status(404).json({ success: false, message: 'Cobrança não encontrada' })
    }

    if (!cobranca.clienteEmails || cobranca.clienteEmails.trim() === '') {
      return res
        .status(400)
        .json({ success: false, message: 'Cliente não possui emails cadastrados' })
    }

    await enviarCobrancaEmail(cobranca)
    await markEmailSent(cobrancaId)

    return res.json({ success: true, message: 'E-mail enviado com sucesso' })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return res
      .status(500)
      .json({ success: false, message: error.message || 'Erro ao enviar e-mail' })
  }
})

// POST /enviar-todas — enviar email de todas as cobranças pendentes
router.post('/enviar-todas', async (req, res) => {
  try {
    const cobrancas = await findAllCobrancas({ status: 'nao-enviado' })

    if (cobrancas.length === 0) {
      return res.json({ success: true, message: 'Nenhuma cobrança pendente', enviadas: 0 })
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
})

export default router
