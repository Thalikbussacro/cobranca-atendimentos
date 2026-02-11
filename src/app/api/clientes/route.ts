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
