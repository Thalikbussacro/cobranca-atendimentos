import { Router } from 'express'
import { listar } from '../controllers/clientesController.js'

const router = Router()

router.get('/', listar)

export default router
