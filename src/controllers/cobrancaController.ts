import { Request, Response } from 'express'
import { CobrancaModel } from '../models/Cobranca'
import { AtendimentoModel } from '../models/Atendimento'
import { ClienteModel } from '../models/Cliente'

export const getAll = async (req: Request, res: Response) => {
  try {
    const { search, status, periodo } = req.query

    const cobrancas = await CobrancaModel.findAll({
      search: search as string,
      status: status as string,
    })

    return res.json({ cobrancas })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar cobranças',
    })
  }
}

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const cobranca = await CobrancaModel.findById(id)

    if (!cobranca) {
      return res.status(404).json({
        success: false,
        message: 'Cobrança não encontrada',
      })
    }

    return res.json({ success: true, cobranca })
  } catch (error: any) {
    console.error('Erro ao buscar cobrança:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao buscar cobrança',
    })
  }
}

export const preview = async (req: Request, res: Response) => {
  try {
    const { clienteId: clienteIdParam, dataInicial, dataFinal } = req.query

    if (!clienteIdParam || !dataInicial || !dataFinal) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros inválidos',
      })
    }

    const parseDataISO = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day, 23, 59, 59)
    }

    const dtInicial = parseDataISO(dataInicial as string)
    const dtFinal = parseDataISO(dataFinal as string)

    const preview = []

    if (clienteIdParam === 'todos') {
      const clientes = await ClienteModel.findAll()

      for (const cliente of clientes) {
        const atendimentos = await AtendimentoModel.findByClienteAndPeriodo(
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
      const clienteId = parseInt(clienteIdParam as string)
      const cliente = await ClienteModel.findById(clienteId)

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado',
        })
      }

      const atendimentos = await AtendimentoModel.findByClienteAndPeriodo(
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
  } catch (error: any) {
    console.error('Erro ao gerar preview de cobranças:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao gerar preview',
    })
  }
}

export const create = async (req: Request, res: Response) => {
  try {
    const cobranca = await CobrancaModel.create(req.body)
    return res.json({ success: true, cobranca })
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Erro ao criar cobrança',
    })
  }
}

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const cobrancaId = parseInt(req.params.id)

    const cobranca = await CobrancaModel.findById(cobrancaId)
    if (!cobranca) {
      return res.status(404).json({
        success: false,
        message: 'Cobrança não encontrada',
      })
    }

    if (!cobranca.clienteEmails || cobranca.clienteEmails.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Cliente não possui emails cadastrados',
      })
    }

    // Importar dinamicamente o serviço de email
    const { enviarCobrancaEmail } = await import('../services/emailService')
    await enviarCobrancaEmail(cobranca)

    await CobrancaModel.markEmailSent(cobrancaId)

    return res.json({
      success: true,
      message: 'E-mail enviado com sucesso',
    })
  } catch (error: any) {
    console.error('Erro ao enviar e-mail:', error)
    const message = error.message || 'Erro ao enviar e-mail'
    return res.status(500).json({ success: false, message })
  }
}
