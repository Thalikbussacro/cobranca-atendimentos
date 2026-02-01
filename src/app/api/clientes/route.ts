import { NextRequest, NextResponse } from 'next/server'
import { ClienteRepositorySQL } from '@/infrastructure/repositories/ClienteRepositorySQL'

const clienteRepository = new ClienteRepositorySQL()

export async function GET(request: NextRequest) {
  try {
    const clientes = await clienteRepository.findAll()
    return NextResponse.json({ clientes })
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao buscar clientes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações básicas
    if (!body.nome || !body.cnpj) {
      return NextResponse.json(
        { success: false, message: 'Nome e CNPJ são obrigatórios' },
        { status: 400 }
      )
    }

    const cliente = await clienteRepository.create(body)

    return NextResponse.json({ success: true, cliente })
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao criar cliente' },
      { status: 500 }
    )
  }
}
