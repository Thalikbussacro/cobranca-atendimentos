import { Request, Response } from 'express'
import { ClienteModel } from '../models/Cliente'

export const getAll = async (req: Request, res: Response) => {
  try {
    const clientes = await ClienteModel.findAll()
    return res.json({ clientes })
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao buscar clientes',
    })
  }
}

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const cliente = await ClienteModel.findById(id)

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado',
      })
    }

    return res.json({ cliente })
  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao buscar cliente',
    })
  }
}
