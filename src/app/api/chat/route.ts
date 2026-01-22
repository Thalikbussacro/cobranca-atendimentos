import { NextRequest, NextResponse } from 'next/server'

// Mock chat storage (em produção, seria banco de dados)
const chatMessages: Record<number, any[]> = {}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cobrancaId = searchParams.get('cobrancaId')

  if (!cobrancaId) {
    return NextResponse.json({ messages: [] })
  }

  const id = parseInt(cobrancaId)
  const messages = chatMessages[id] || []

  return NextResponse.json({ messages })
}

export async function POST(request: NextRequest) {
  try {
    const { cobrancaId, text, author, isMe } = await request.json()

    if (!cobrancaId || !text || !author) {
      return NextResponse.json(
        { success: false, message: 'Dados incompletos' },
        { status: 400 }
      )
    }

    const message = {
      id: Date.now().toString(),
      cobrancaId,
      author,
      text,
      timestamp: new Date(),
      isMe: isMe || false,
    }

    if (!chatMessages[cobrancaId]) {
      chatMessages[cobrancaId] = []
    }

    chatMessages[cobrancaId].push(message)

    // Mock de resposta automática do atendente
    if (isMe) {
      setTimeout(() => {
        const response = {
          id: (Date.now() + 1).toString(),
          cobrancaId,
          author: 'Atendente',
          text: 'Ok. Vou revisar os atendimentos e te retorno com o resumo para enviar ao cliente.',
          timestamp: new Date(),
          isMe: false,
        }
        chatMessages[cobrancaId].push(response)
      }, 700)
    }

    return NextResponse.json({ success: true, message })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}
