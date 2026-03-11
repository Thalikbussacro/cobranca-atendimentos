import { Router } from 'express'
import * as clienteController from '../controllers/clienteController'

const router = Router()

router.get('/', clienteController.getAll)
router.get('/:id', clienteController.getById)

export default router
