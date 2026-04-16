import { Router } from 'express'
import { listar, preview, gerar, enviar, enviarTodas } from '../controllers/cobrancasController.js'

const router = Router()

router.get('/', listar)
router.get('/preview', preview)
router.post('/gerar', gerar)
router.post('/enviar/:id', enviar)
router.post('/enviar-todas', enviarTodas)

export default router
