'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCobrancas } from '@/hooks/useCobrancas'
import { Card, CardBody, Button } from '@heroui/react'
import { Badge } from '@/components/ui/Badge'
import { statusLabel } from '@/presentation/constants/status'
import { ChevronDown, ChevronUp, FileText, Download, MessageCircle, AlertCircle } from 'lucide-react'

export default function PortalClientePage() {
  const { user } = useAuth()
  const { cobrancas, loading } = useCobrancas()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Filtrar cobranças do cliente
  const clienteCobrancas = cobrancas.filter((c) => {
    // Mock: filtrar por clienteId se tiver, senão por nome
    if (user?.clienteId) {
      return c.clienteId === user.clienteId
    }
    return c.cliente.toLowerCase().includes('cooperativa') || c.cliente.toLowerCase().includes('alfa')
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted font-semibold">Carregando suas cobranças...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-text mb-1">Minhas Cobranças</h1>
        <p className="text-sm text-muted">
          Visualize e acompanhe as cobranças de atendimentos técnicos da SO Automação
        </p>
      </div>

      {clienteCobrancas.length === 0 ? (
        <Card shadow="none" className="border border-default-200">
          <CardBody>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-default-400 mb-3" />
              <div className="text-default-600 font-semibold mb-2">Nenhuma cobrança encontrada</div>
              <div className="text-sm text-default-500">
                Você não possui cobranças no momento.
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {clienteCobrancas.map((cobranca) => {
            const st = statusLabel[cobranca.status]
            const isExpanded = expandedId === cobranca.id

            return (
              <Card key={cobranca.id} shadow="none" className="border border-default-200">
                <CardBody className="gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base">Cobrança #{cobranca.id}</h3>
                        <Badge variant={st.variant}>{st.text}</Badge>
                        {cobranca.notificacao && (
                          <Badge variant="red">Nova mensagem</Badge>
                        )}
                      </div>
                      <div className="text-sm text-default-500">
                        Período: <b>{cobranca.periodo}</b>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-default-500 mb-1">Total de Atendimentos</div>
                      <div className="text-2xl font-bold text-primary">{cobranca.atendimentos}</div>
                      <div className="text-xs text-default-500 font-semibold">{cobranca.horas}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-sm flex-1">
                      <span className="text-default-500">Última atualização:</span>{' '}
                      <b>{cobranca.ultimaAcao}</b>
                    </div>
                    {cobranca.nf && (
                      <div className="text-sm">
                        <span className="text-default-500">NF:</span> <b>{cobranca.nf}</b>
                      </div>
                    )}
                  </div>

                <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                  <Button
                    variant="flat"
                    size="sm"
                    fullWidth
                    startContent={isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    onClick={() => setExpandedId(isExpanded ? null : cobranca.id)}
                  >
                    {isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                  </Button>

                  <Button
                    color="primary"
                    size="sm"
                    fullWidth
                    startContent={<MessageCircle className="h-4 w-4" />}
                    onClick={() => alert('Abrir chat com atendente')}
                    className="font-bold"
                  >
                    Falar com Atendente
                  </Button>

                  <Button
                    variant="flat"
                    size="sm"
                    fullWidth
                    startContent={<FileText className="h-4 w-4" />}
                    onClick={() => alert('Solicitar guia de pagamento')}
                  >
                    Solicitar Guia
                  </Button>

                  {cobranca.status === 'ENVIADA' && (
                    <Button
                      variant="flat"
                      size="sm"
                      fullWidth
                      color="warning"
                      startContent={<AlertCircle className="h-4 w-4" />}
                      onClick={() => alert('Questionar cobrança')}
                    >
                      Questionar Cobrança
                    </Button>
                  )}

                  {cobranca.nf && (
                    <Button
                      variant="flat"
                      size="sm"
                      fullWidth
                      startContent={<Download className="h-4 w-4" />}
                      onClick={() => alert('Download NF')}
                    >
                      Baixar NF
                    </Button>
                  )}

                  <Button
                    variant="flat"
                    size="sm"
                    fullWidth
                    startContent={<FileText className="h-4 w-4" />}
                    onClick={() => alert('Download relatório')}
                  >
                    Relatório PDF
                  </Button>
                </div>

                  {isExpanded && (
                    <>
                      <div className="h-px bg-default-200" />
                      <div>
                        <div className="text-xs font-bold text-default-500 uppercase tracking-wider mb-2">
                          Atendimentos Incluídos
                        </div>
                        <div className="flex flex-col gap-2">
                          {cobranca.itens.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-default-50 border border-default-200 rounded-lg p-3"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-bold text-sm">
                                    {item.data} • {item.solicitante}
                                  </div>
                                  <div className="text-xs text-default-500 font-semibold">
                                    Tempo: {item.tempo}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm mb-1">
                                <b>Solicitação:</b> {item.resumo}
                              </div>
                              <div className="text-sm text-default-700">
                                <b>Solução:</b> {item.solucao}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
