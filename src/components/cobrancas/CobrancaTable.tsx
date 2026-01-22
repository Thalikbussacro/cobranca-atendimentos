'use client'

import { useState } from 'react'
import { Cobranca } from '@/domain/entities/Cobranca'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CobrancaDetails } from './CobrancaDetails'

interface CobrancaTableProps {
  cobrancas: Cobranca[]
  onAction: (action: string, cobrancaId: number) => void
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' }> = {
  ABERTO: { label: 'Em aberto', variant: 'warning' },
  AGUARDANDO_NF: { label: 'Aguardando NF', variant: 'secondary' },
  ENVIADA: { label: 'Enviada', variant: 'info' },
  PAGA: { label: 'Paga', variant: 'success' },
  FECHADA: { label: 'Fechada', variant: 'success' },
  CONTESTADA: { label: 'Contestada', variant: 'destructive' },
  CANCELADA: { label: 'Cancelada', variant: 'secondary' },
}

export function CobrancaTable({ cobrancas, onAction }: CobrancaTableProps) {
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
            <TableHead>Clients</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="text-center">Atendimentos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cobrancas.map((cobranca) => {
            const isExpanded = expandedId === cobranca.id
            const status = statusConfig[cobranca.status] || statusConfig.ABERTO

            return (
              <>
                <TableRow key={cobranca.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-so-blue">
                    {cobranca.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-so-blue">{cobranca.cliente}</div>
                      <div className="text-xs text-muted-foreground">Versão do operador</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cobranca.periodo}
                  </TableCell>
                  <TableCell className="text-center">
                    {cobranca.atendimentos}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0 bg-muted/20">
                      <CobrancaDetails 
                        cobranca={cobranca} 
                        onAction={onAction}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
