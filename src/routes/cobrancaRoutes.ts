import { Router } from 'express'
import * as cobrancaController from '../controllers/cobrancaController'

const router = Router()

router.get('/', cobrancaController.getAll)
router.get('/preview', cobrancaController.preview)
router.get('/:id', cobrancaController.getById)
router.post('/', cobrancaController.create)
router.post('/:id/enviar-email', cobrancaController.sendEmail)

export default router
