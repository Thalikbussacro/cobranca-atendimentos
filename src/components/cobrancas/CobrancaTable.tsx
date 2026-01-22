'use client'

import { useState } from 'react'
import { Cobranca } from '@/domain/entities/Cobranca'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import { CobrancaDetails } from './CobrancaDetails'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'

interface CobrancaTableProps {
  cobrancas: Cobranca[]
  onAction: (action: string, cobrancaId: number) => void
  onChat: (cobranca: Cobranca) => void
}

// Calcula os dias desde a última interação
function getDaysSinceInteraction(ultimaInteracao?: string): number | null {
  if (!ultimaInteracao) return null
  
  const lastDate = new Date(ultimaInteracao)
  const now = new Date()
  const diffTime = now.getTime() - lastDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// Retorna a classe de cor baseada nos dias de inatividade
function getInactivityClass(days: number | null): string {
  if (days === null) return ''
  if (days > 10) return 'bg-red-50 hover:bg-red-100'
  if (days > 5) return 'bg-yellow-50 hover:bg-yellow-100'
  return ''
}

// Formata a data de última interação
function formatLastInteraction(ultimaInteracao?: string): string {
  if (!ultimaInteracao) return '-'
  
  const date = new Date(ultimaInteracao)
  const days = getDaysSinceInteraction(ultimaInteracao)
  const formattedDate = date.toLocaleDateString('pt-BR')
  
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days !== null && days <= 7) return `${days} dias atrás`
  
  return formattedDate
}

export function CobrancaTable({ cobrancas, onAction, onChat }: CobrancaTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px]">Nº</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="text-center">Atend.</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Última Interação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cobrancas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhuma cobrança encontrada.
              </TableCell>
            </TableRow>
          ) : (
            cobrancas.map((cobranca) => {
              const isExpanded = expandedId === cobranca.id
              const daysSinceInteraction = getDaysSinceInteraction(cobranca.ultimaInteracaoCliente)
              const inactivityClass = getInactivityClass(daysSinceInteraction)

              return (
                <>
                  <TableRow 
                    key={cobranca.id} 
                    className={cn('transition-colors', inactivityClass || 'hover:bg-muted/30')}
                  >
                    <TableCell className="font-medium text-so-blue">
                      #{cobranca.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-so-blue">{cobranca.cliente}</div>
                        <div className="text-xs text-muted-foreground">
                          Código: {cobranca.codigoAcesso || '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {cobranca.periodo}
                    </TableCell>
                    <TableCell className="text-center">
                      {cobranca.atendimentos}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={cobranca.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={cn(
                          'text-sm',
                          daysSinceInteraction !== null && daysSinceInteraction > 10 && 'text-red-600 font-medium',
                          daysSinceInteraction !== null && daysSinceInteraction > 5 && daysSinceInteraction <= 10 && 'text-yellow-600 font-medium'
                        )}>
                          {formatLastInteraction(cobranca.ultimaInteracaoCliente)}
                        </span>
                        {daysSinceInteraction !== null && daysSinceInteraction > 5 && (
                          <span className="text-xs text-muted-foreground">
                            {daysSinceInteraction} dias sem interação
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onChat(cobranca)}
                          title="Abrir chat"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-so-blue"
                          onClick={() => toggleExpand(cobranca.id)}
                        >
                          Detalhes
                          {isExpanded ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0 bg-muted/20">
                        <CobrancaDetails 
                          cobranca={cobranca} 
                          onAction={onAction}
                          onChatOpen={() => onChat(cobranca)}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
