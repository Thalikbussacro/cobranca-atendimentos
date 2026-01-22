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

    let user

    // Login admin
    if (username === 'admin' || username === 'admin123' || username === 'operador01' || username.startsWith('op')) {
      user = {
        id: '1',
        name: username,
        email: `${username}@soautomacao.com.br`,
        role: 'admin' as const,
      }
    } 
    // Login cliente via código (COB1001, etc)
    else if (username.startsWith('COB')) {
      // Extrai ID da cobrança do código (COB1001 -> 1001)
      const cobrancaId = parseInt(username.substring(3))
      const clienteId = cobrancaId % 10 || 1 // Mock simples
      
      user = {
        id: `cliente_${clienteId}`,
        name: `Cliente ${clienteId}`,
        email: `cliente${clienteId}@exemplo.com.br`,
        role: 'cliente' as const,
        clienteId,
      }
    }
    // Login cliente direto (cliente1, cliente2, etc)
    else {
      const clienteMatch = username.match(/cliente(\d+)/)
      const clienteId = clienteMatch ? parseInt(clienteMatch[1]) : 1

      user = {
        id: `cliente_${clienteId}`,
        name: `Cliente ${clienteId}`,
        email: `cliente${clienteId}@exemplo.com.br`,
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
