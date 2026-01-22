import { NextRequest, NextResponse } from 'next/server'
import { cobrancaService } from '@/application/services/CobrancaService'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const cobrancas = await cobrancaService.getCobrancas.execute({
      search,
      status,
    })

    return NextResponse.json({ cobrancas })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar cobranças' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const cobranca = await cobrancaService.createCobranca.execute(body)

    return NextResponse.json({ success: true, cobranca })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao criar cobrança' },
      { status: 400 }
    )
  }
}
