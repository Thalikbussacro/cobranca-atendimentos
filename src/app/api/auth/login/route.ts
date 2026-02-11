import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validação de campos obrigatórios
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Credenciais do .env (com fallback para desenvolvimento)
    const validUsername = process.env.AUTH_USERNAME
    const validPassword = process.env.AUTH_PASSWORD

    // Verifica credenciais
    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { success: false, message: 'Usuário ou senha inválidos' },
        { status: 401 }
      )
    }

    // Retorna usuário autenticado
    const user = {
      id: '1',
      name: 'admin',
      email: 'admin@empresagenerica.com.br',
      role: 'admin' as const,
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'Login realizado com sucesso',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao processar login' },
      { status: 500 }
    )
  }
}
