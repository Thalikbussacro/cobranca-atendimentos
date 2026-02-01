import { NextRequest, NextResponse } from 'next/server'
import { CobrancaRepositorySQL } from '@/infrastructure/repositories/CobrancaRepositorySQL'

const cobrancaRepository = new CobrancaRepositorySQL()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cobranca = await cobrancaRepository.findById(parseInt(id))

    if (!cobranca) {
      return NextResponse.json(
        { success: false, message: 'Cobrança não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, cobranca })
  } catch (error: any) {
    console.error('Erro ao buscar cobrança:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao buscar cobrança' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const cobranca = await cobrancaRepository.update(parseInt(id), body)

    if (!cobranca) {
      return NextResponse.json(
        { success: false, message: 'Cobrança não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, cobranca })
  } catch (error: any) {
    console.error('Erro ao atualizar cobrança:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao atualizar cobrança' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sucesso = await cobrancaRepository.delete(parseInt(id))

    if (!sucesso) {
      return NextResponse.json(
        { success: false, message: 'Cobrança não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao deletar cobrança:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao deletar cobrança' },
      { status: 500 }
    )
  }
}
