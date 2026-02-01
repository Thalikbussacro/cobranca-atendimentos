import { NextRequest, NextResponse } from 'next/server'
import { AtendimentoRepositorySQL } from '@/infrastructure/repositories/AtendimentoRepositorySQL'
import { ClienteRepositorySQL } from '@/infrastructure/repositories/ClienteRepositorySQL'

const atendimentoRepository = new AtendimentoRepositorySQL()
const clienteRepository = new ClienteRepositorySQL()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clienteIdParam = searchParams.get('clienteId')
    const dataInicial = searchParams.get('dataInicial')
    const dataFinal = searchParams.get('dataFinal')

    if (!clienteIdParam || !dataInicial || !dataFinal) {
      return NextResponse.json(
        { success: false, message: 'Parâmetros inválidos' },
        { status: 400 }
      )
    }

    // Converter datas
    const parseDataISO = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day, 23, 59, 59)
    }

    const dtInicial = parseDataISO(dataInicial)
    const dtFinal = parseDataISO(dataFinal)

    const preview = []

    if (clienteIdParam === 'todos') {
      // Buscar todos os clientes
      const clientes = await clienteRepository.findAll()

      for (const cliente of clientes) {
        const atendimentos = await atendimentoRepository.findByClienteAndPeriodo(
          cliente.id,
          dtInicial,
          dtFinal
        )

        if (atendimentos.length > 0) {
          const totalMinutos = atendimentos.reduce(
            (acc, atend) => acc + (atend.duracaoMinutos || 0),
            0
          )
          const horas = Math.floor(totalMinutos / 60)
          const minutos = totalMinutos % 60

          preview.push({
            clienteId: cliente.id,
            clienteNome: cliente.nome,
            atendimentos: atendimentos.length,
            tempo: `${horas}h ${minutos.toString().padStart(2, '0')}m`,
          })
        }
      }
    } else {
      // Buscar cliente específico
      const clienteId = parseInt(clienteIdParam)
      const cliente = await clienteRepository.findById(clienteId)

      if (!cliente) {
        return NextResponse.json(
          { success: false, message: 'Cliente não encontrado' },
          { status: 404 }
        )
      }

      const atendimentos = await atendimentoRepository.findByClienteAndPeriodo(
        clienteId,
        dtInicial,
        dtFinal
      )

      const totalMinutos = atendimentos.reduce(
        (acc, atend) => acc + (atend.duracaoMinutos || 0),
        0
      )
      const horas = Math.floor(totalMinutos / 60)
      const minutos = totalMinutos % 60

      preview.push({
        clienteId: cliente.id,
        clienteNome: cliente.nome,
        atendimentos: atendimentos.length,
        tempo: `${horas}h ${minutos.toString().padStart(2, '0')}m`,
      })
    }

    return NextResponse.json({ preview })
  } catch (error: any) {
    console.error('Erro ao gerar preview de cobranças:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Erro ao gerar preview' },
      { status: 500 }
    )
  }
}
