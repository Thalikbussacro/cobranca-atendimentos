import { Router } from 'express'

const router = Router()

router.post('/login', (req, res) => {
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

export default router
