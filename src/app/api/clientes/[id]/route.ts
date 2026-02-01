import { NextRequest, NextResponse } from 'next/server'
import { ClienteRepositorySQL } from '@/infrastructure/repositories/ClienteRepositorySQL'

const clienteRepository = new ClienteRepositorySQL()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const cliente = await clienteRepository.update(id, body)

    if (!cliente) {
      return NextResponse.json(
        { success: false, message: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, cliente })
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao atualizar cliente' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'ID inválido' },
        { status: 400 }
      )
    }

    const sucesso = await clienteRepository.delete(id)

    if (!sucesso) {
      return NextResponse.json(
        { success: false, message: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao deletar cliente:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao deletar cliente' },
      { status: 500 }
    )
  }
}
