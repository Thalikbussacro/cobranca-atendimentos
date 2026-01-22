import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Mock authentication - aceita qualquer usuário/senha não vazia
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Mock: admin ou cliente
    // admin123 = admin
    // cliente1, cliente2, etc = cliente
    let user

    if (username === 'admin' || username === 'admin123' || username === 'operador01') {
      user = {
        id: '1',
        name: username,
        email: `${username}@soautomacao.com.br`,
        role: 'admin' as const,
      }
    } else {
      // Mock cliente - extrai número do username (ex: cliente1 -> clienteId 1)
      const clienteMatch = username.match(/cliente(\d+)/)
      const clienteId = clienteMatch ? parseInt(clienteMatch[1]) : 1

      user = {
        id: `cliente_${clienteId}`,
        name: username,
        email: `${username}@exemplo.com.br`,
        role: 'cliente' as const,
        clienteId,
      }
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
