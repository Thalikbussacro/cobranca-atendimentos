import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import clientesRouter from './routes/clientes.js'
import cobrancasRouter from './routes/cobrancas.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json())

// Auth
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios' })
    }

    if (username !== process.env.AUTH_USERNAME || password !== process.env.AUTH_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' })
    }

    return res.json({
      success: true,
      user: { id: '1', name: 'admin', email: 'admin@empresagenerica.com.br', role: 'admin' },
      message: 'Login realizado com sucesso',
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao processar login' })
  }
})

// API Routes
app.use('/api/clientes', clientesRouter)
app.use('/api/cobrancas', cobrancasRouter)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: err.message || 'Erro interno do servidor' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})
