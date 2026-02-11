import { NextRequest, NextResponse } from 'next/server'
import { ClienteRepositorySQL } from '@/infrastructure/repositories/ClienteRepositorySQL'

const clienteRepository = new ClienteRepositorySQL()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID inválido' },
        { status: 400 }
      )
    }

    const cliente = await clienteRepository.findById(id)

    if (!cliente) {
      return NextResponse.json(
        { success: false, message: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ cliente })
  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao buscar cliente' },
      { status: 500 }
    )
  }
}
