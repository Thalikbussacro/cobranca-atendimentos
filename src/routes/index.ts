import { Router } from 'express'
import authRoutes from './authRoutes'
import clienteRoutes from './clienteRoutes'
import cobrancaRoutes from './cobrancaRoutes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/clientes', clienteRoutes)
router.use('/cobrancas', cobrancaRoutes)

export default router
