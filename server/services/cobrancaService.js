import { findAllCobrancas, findCobrancaById, createCobranca, deleteCobranca, deleteCobrancasNaoEnviadas } from '../repositories/cobrancaRepository.js'
import { findAtendimentosByClienteAndPeriodo, findAtendimentosByCobranca } from '../repositories/atendimentoRepository.js'
import { criarAtendimento } from '../models/Atendimento.js'
import { criarCobranca } from '../models/Cobranca.js'
import { minutosParaHoras, formatarData, parseDataISO } from '../utils/formatters.js'
import { listarClientes, buscarClientePorId } from './clienteService.js'

async function enriquecerCobranca(row) {
  const cobranca = criarCobranca(row)
  const atendimentosRaw = await findAtendimentosByCobranca(cobranca.id)
  cobranca.itens = atendimentosRaw.map((r) => {
    const atend = criarAtendimento(r)
    return {
      data: formatarData(atend.dataInicio),
      solicitante: atend.solicitante,
      resumo: atend.problema,
      solucao: atend.solucao,
      tempo: minutosParaHoras(atend.duracaoMinutos || 0),
    }
  })
  return cobranca
}

export async function listarCobrancas(filtros) {
  const rows = await findAllCobrancas(filtros)
  const cobrancas = []
  for (const row of rows) {
    cobrancas.push(await enriquecerCobranca(row))
  }
  return cobrancas
}

export async function buscarCobrancaPorId(id) {
  const row = await findCobrancaById(id)
  if (!row) return null
  return enriquecerCobranca(row)
}

export async function gerarPreview(clienteIdParam, dataInicial, dataFinal) {
  const dtInicial = parseDataISO(dataInicial)
  const dtFinal = parseDataISO(dataFinal)
  const preview = []

  if (clienteIdParam === 'todos') {
    const clientes = await listarClientes()

    for (const cliente of clientes) {
      const atendimentosRaw = await findAtendimentosByClienteAndPeriodo(
        cliente.id,
        dtInicial,
        dtFinal
      )
      const atendimentos = atendimentosRaw.map(criarAtendimento)

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
    const clienteId = parseInt(clienteIdParam)
    const cliente = await buscarClientePorId(clienteId)

    if (!cliente) return null

    const atendimentosRaw = await findAtendimentosByClienteAndPeriodo(
      clienteId,
      dtInicial,
      dtFinal
    )
    const atendimentos = atendimentosRaw.map(criarAtendimento)

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

  return preview
}

export async function cancelarCobranca(id) {
  const row = await findCobrancaById(id)
  if (!row) {
    throw Object.assign(new Error('Cobrança não encontrada'), { statusCode: 404 })
  }
  if (row.emailEnviado) {
    throw Object.assign(new Error('Não é possível cancelar cobrança com e-mail já enviado'), { statusCode: 400 })
  }
  await deleteCobranca(id)
}

export async function cancelarTodasNaoEnviadas() {
  return deleteCobrancasNaoEnviadas()
}

export async function gerarCobrancas(clienteIds, inicio, fim, precoHora) {
  const cobrancasCriadas = []

  for (const clienteId of clienteIds) {
    const novoCodigo = await createCobranca({
      clienteId,
      dataInicial: inicio,
      dataFinal: fim,
      precoHora,
    })
    const cobranca = await buscarCobrancaPorId(novoCodigo)
    if (!cobranca) throw new Error('Erro ao buscar cobrança criada')
    cobrancasCriadas.push(cobranca)
  }

  return cobrancasCriadas
}
