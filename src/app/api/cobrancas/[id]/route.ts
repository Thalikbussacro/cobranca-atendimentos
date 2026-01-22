import { NextRequest, NextResponse } from 'next/server'
import { cobrancaService } from '@/application/services/CobrancaService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cobrancas = await cobrancaService.getCobrancas.execute()
    const cobranca = cobrancas.find((c) => c.id === parseInt(id))

    if (!cobranca) {
      return NextResponse.json(
        { success: false, message: 'Cobrança não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, cobranca })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar cobrança' },
      { status: 500 }
    )
  }
}
