import { NextRequest, NextResponse } from 'next/server'
import { CobrancaRepositorySQL } from '@/infrastructure/repositories/CobrancaRepositorySQL'

const cobrancaRepository = new CobrancaRepositorySQL()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cobrancaId = parseInt(id)

    // Verificar se cobrança existe
    const cobranca = await cobrancaRepository.findById(cobrancaId)
    if (!cobranca) {
      return NextResponse.json(
        { success: false, message: 'Cobrança não encontrada' },
        { status: 404 }
      )
    }

    // Marcar como enviado
    await cobrancaRepository.markEmailSent(cobrancaId)

    // TODO: Implementar envio real via SMTP
    // const emailService = new EmailService()
    // await emailService.enviarCobranca(cobranca)

    return NextResponse.json({
      success: true,
      message: 'E-mail marcado como enviado. Implementação de SMTP será feita no futuro.',
    })
  } catch (error: any) {
    console.error('Erro ao enviar e-mail:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao enviar e-mail' },
      { status: 500 }
    )
  }
}
