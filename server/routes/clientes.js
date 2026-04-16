import { Router } from 'express'
import { findAllClientes } from '../repositories/clienteRepository.js'
import { criarCliente } from '../models/Cliente.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const rows = await findAllClientes()
    const clientes = rows.map(criarCliente)
    return res.json({ clientes })
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return res.status(500).json({ success: false, message: 'Erro ao buscar clientes' })
  }
})

export default router
