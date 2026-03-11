import express from 'express'
import cors from 'cors'
import path from 'path'
import routes from './routes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// API Routes (devem vir antes dos arquivos estáticos)
app.use('/api', routes)

// Servir arquivos estáticos do frontend (produção)
const publicPath = path.join(__dirname, 'public')
app.use(express.static(publicPath))

// SPA fallback - todas as rotas não-API retornam index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

// Error handler (deve ser o último middleware)
app.use(errorHandler)

export default app
