import { Request, Response } from 'express'

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuário e senha são obrigatórios',
      })
    }

    const validUsername = process.env.AUTH_USERNAME
    const validPassword = process.env.AUTH_PASSWORD

    if (username !== validUsername || password !== validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos',
      })
    }

    const user = {
      id: '1',
      name: 'admin',
      email: 'admin@empresagenerica.com.br',
      role: 'admin' as const,
    }

    return res.json({
      success: true,
      user,
      message: 'Login realizado com sucesso',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao processar login',
    })
  }
}
