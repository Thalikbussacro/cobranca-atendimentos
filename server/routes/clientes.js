import { Router } from 'express'
import { findAllClientes } from '../db/queries.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const clientes = await findAllClientes()
    return res.json({ clientes })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao buscar clientes' })
  }
})

export default router
