import { NextRequest, NextResponse } from 'next/server'
import { CobrancaRepositorySQL } from '@/infrastructure/repositories/CobrancaRepositorySQL'
import { EmailServiceSMTP } from '@/infrastructure/services/EmailService'

const cobrancaRepository = new CobrancaRepositorySQL()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cobrancaId = parseInt(id)

    // Buscar cobrança completa
    const cobranca = await cobrancaRepository.findById(cobrancaId)
    if (!cobranca) {
      return NextResponse.json(
        { success: false, message: 'Cobrança não encontrada' },
        { status: 404 }
      )
    }

    // Validar que o cliente tem emails cadastrados
    if (!cobranca.clienteEmails || cobranca.clienteEmails.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          message: 'Cliente não possui emails cadastrados',
        },
        { status: 400 }
      )
    }

    // Enviar email (pode lançar exceção)
    const emailService = new EmailServiceSMTP()
    await emailService.enviarCobranca(cobranca)

    // Só marca como enviado se chegou aqui (envio bem-sucedido)
    await cobrancaRepository.markEmailSent(cobrancaId)

    return NextResponse.json({
      success: true,
      message: 'E-mail enviado com sucesso',
    })
  } catch (error: any) {
    console.error('Erro ao enviar e-mail:', error)

    // Retornar erro específico
    const message = error.message || 'Erro ao enviar e-mail'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
