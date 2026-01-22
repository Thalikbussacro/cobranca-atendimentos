'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCobrancas } from '@/hooks/useCobrancas'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar, ChevronDown, ChevronUp, MessageCircle, CheckCircle, XCircle, HelpCircle, Download, ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/cobrancas/StatusBadge'
import { ChatModal } from '@/components/chat/ChatModal'
import { ActionConfirmModal, actionConfigs } from '@/components/modals/ActionConfirmModal'
import { AtendimentoDetailModal } from '@/components/modals/AtendimentoDetailModal'
import { statusConfig } from '@/presentation/constants/status'
import { Cobranca, AtendimentoItem } from '@/domain/entities/Cobranca'

type ActionType = 'aceitar' | 'recusar' | 'questionar' | 'contato' | 'pagamento' | null

export default function PortalClientePage() {
  const { user } = useAuth()
  const { cobrancas, loading, filters, setFilters } = useCobrancas()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedCobranca, setSelectedCobranca] = useState<Cobranca | null>(null)
  const [actionModal, setActionModal] = useState<{ open: boolean; type: ActionType; cobranca: Cobranca | null }>({
    open: false,
    type: null,
    cobranca: null,
  })
  const [atendimentoModal, setAtendimentoModal] = useState<{
    open: boolean
    atendimento: AtendimentoItem | null
    cobranca: Cobranca | null
  }>({
    open: false,
    atendimento: null,
    cobranca: null,
  })

  // Filtrar cobranças apenas do cliente logado
  const clienteCobrancas = cobrancas.filter((c) => {
    // Se o usuário tem clienteId, mostrar apenas suas cobranças
    if (user?.clienteId) {
      return c.clienteId === user.clienteId
    }
    // Admin vendo como cliente - mostrar todas
    return true
  })

  // Aplicar filtro de status
  const filteredCobrancas = clienteCobrancas.filter((c) => {
    if (filters.status && filters.status !== 'all') {
      return c.status === filters.status
    }
    return true
  })

  const handleOpenChat = (cobranca: Cobranca) => {
    setSelectedCobranca(cobranca)
    setChatOpen(true)
  }

  const handleAction = (type: ActionType, cobranca: Cobranca) => {
    setActionModal({ open: true, type, cobranca })
  }

  const handleConfirmAction = () => {
    if (!actionModal.cobranca || !actionModal.type) return

    // Em uma aplicação real, aqui faria a chamada à API
    console.log(`Ação ${actionModal.type} confirmada para cobrança ${actionModal.cobranca.id}`)

    // Se for questionar ou recusar, abre o chat
    if (actionModal.type === 'questionar' || actionModal.type === 'recusar' || actionModal.type === 'contato') {
      setSelectedCobranca(actionModal.cobranca)
      setChatOpen(true)
    }

    setActionModal({ open: false, type: null, cobranca: null })
  }

  const handleExpandDetails = (cobranca: Cobranca) => {
    setExpandedId(expandedId === cobranca.id ? null : cobranca.id)
    // Registrar interação do cliente
    console.log(`Cliente visualizou detalhes da cobrança ${cobranca.id}`)
  }

  const handleAtendimentoClick = (atendimento: AtendimentoItem, cobranca: Cobranca) => {
    setAtendimentoModal({ open: true, atendimento, cobranca })
  }

  const getActionConfig = () => {
    switch (actionModal.type) {
      case 'aceitar':
        return actionConfigs.aceitarAtendimentos
      case 'recusar':
        return actionConfigs.recusarAtendimentos
      case 'questionar':
        return actionConfigs.questionarAtendimentos
      case 'contato':
        return actionConfigs.solicitarContato
      case 'pagamento':
        return actionConfigs.confirmarPagamento
      default:
        return actionConfigs.aceitarAtendimentos
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando cobranças...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header da página */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Minhas Cobranças</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Visualize e gerencie suas cobranças de atendimentos técnicos.
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-4 md:mb-6">
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                type="date"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full sm:w-[150px]"
                placeholder="Data inicial"
              />
            </div>

            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px]">Nº</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-center">Atend.</TableHead>
                <TableHead className="hidden sm:table-cell">Horas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCobrancas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 md:py-8 text-muted-foreground text-sm">
                    Nenhuma cobrança encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCobrancas.map((cobranca) => {
                  const isExpanded = expandedId === cobranca.id

                  return (
                    <>
                      <TableRow key={cobranca.id}>
                        <TableCell className="font-medium text-so-blue text-sm">
                          #{cobranca.id}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          <span className="hidden sm:inline">{cobranca.periodo}</span>
                          <span className="sm:hidden text-xs">{cobranca.periodo.split(' - ')[0]}</span>
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {cobranca.atendimentos}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{cobranca.horas}</TableCell>
                        <TableCell>
                          <StatusBadge status={cobranca.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-so-blue text-xs sm:text-sm px-1"
                            onClick={() => handleExpandDetails(cobranca)}
                          >
                            <span className="hidden sm:inline">Detalhes</span>
                            <span className="sm:hidden">Ver</span>
                            {isExpanded ? (
                              <ChevronUp className="ml-0.5 sm:ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-0.5 sm:ml-1 h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/20 p-3 md:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              {/* Atendimentos */}
                              <div>
                                <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Atendimentos Incluídos</h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Toque para ver detalhes
                                </p>
                                <div className="space-y-2 max-h-[250px] md:max-h-[300px] overflow-y-auto">
                                  {cobranca.itens.map((item, idx) => (
                                    <Card 
                                      key={idx}
                                      className="cursor-pointer hover:shadow-md transition-shadow"
                                      onClick={() => handleAtendimentoClick(item, cobranca)}
                                    >
                                      <CardContent className="p-2 md:p-3">
                                        <div className="flex justify-between items-start">
                                          <div className="text-xs md:text-sm flex-1">
                                            <div className="font-medium">{item.data} - {item.solicitante}</div>
                                            <div className="text-muted-foreground line-clamp-2">{item.resumo}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                              Tempo: {item.tempo}
                                            </div>
                                          </div>
                                          <ExternalLink className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground ml-2 flex-shrink-0" />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>

                              {/* Ações */}
                              <div>
                                <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Ações</h4>
                                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                                  <Button 
                                    variant="outline" 
                                    className="justify-start text-xs md:text-sm h-9 md:h-10"
                                    onClick={() => handleOpenChat(cobranca)}
                                  >
                                    <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                                    <span className="hidden sm:inline">Falar com </span>Atendente
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    className="justify-start text-green-600 hover:text-green-700 text-xs md:text-sm h-9 md:h-10"
                                    onClick={() => handleAction('aceitar', cobranca)}
                                  >
                                    <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                                    Aceitar
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    className="justify-start text-yellow-600 hover:text-yellow-700 text-xs md:text-sm h-9 md:h-10"
                                    onClick={() => handleAction('questionar', cobranca)}
                                  >
                                    <HelpCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                                    Questionar
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    className="justify-start text-red-600 hover:text-red-700 text-xs md:text-sm h-9 md:h-10"
                                    onClick={() => handleAction('recusar', cobranca)}
                                  >
                                    <XCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                                    Recusar
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    className="justify-start text-xs md:text-sm h-9 md:h-10"
                                    onClick={() => handleAction('pagamento', cobranca)}
                                  >
                                    <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                                    <span className="hidden sm:inline">Confirmar </span>Pagamento
                                  </Button>
                                  
                                  <Button variant="outline" className="justify-start text-xs md:text-sm h-9 md:h-10">
                                    <Download className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                                    <span className="hidden sm:inline">Baixar </span>Relatório
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Chat */}
      {selectedCobranca && (
        <ChatModal
          open={chatOpen}
          onOpenChange={setChatOpen}
          cobrancaId={selectedCobranca.id}
          clienteNome={selectedCobranca.cliente}
          isClienteView={true}
        />
      )}

      {/* Modal de Confirmação de Ação */}
      {actionModal.type && (
        <ActionConfirmModal
          open={actionModal.open}
          onOpenChange={(open) => setActionModal({ ...actionModal, open })}
          {...getActionConfig()}
          onConfirm={handleConfirmAction}
        />
      )}

      {/* Modal de Detalhes do Atendimento */}
      <AtendimentoDetailModal
        open={atendimentoModal.open}
        onOpenChange={(open) => setAtendimentoModal({ ...atendimentoModal, open })}
        atendimento={atendimentoModal.atendimento}
        clienteNome={atendimentoModal.cobranca?.cliente}
        cobrancaId={atendimentoModal.cobranca?.id}
      />
    </div>
  )
}
