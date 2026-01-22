'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, User, FileText, Wrench } from 'lucide-react'
import { AtendimentoItem } from '@/domain/entities/Cobranca'

interface AtendimentoDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  atendimento: AtendimentoItem | null
  clienteNome?: string
  cobrancaId?: number
}

export function AtendimentoDetailModal({
  open,
  onOpenChange,
  atendimento,
  clienteNome,
  cobrancaId,
}: AtendimentoDetailModalProps) {
  if (!atendimento) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Detalhes do Atendimento</span>
            {cobrancaId && (
              <Badge variant="outline" className="text-so-blue">
                #{cobrancaId}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cliente */}
          {clienteNome && (
            <div className="text-sm text-muted-foreground">
              Cliente: <span className="font-medium text-foreground">{clienteNome}</span>
            </div>
          )}

          <Separator />

          {/* Data e Solicitante */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-so-blue" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Data/Hora</div>
                <div className="font-medium">{atendimento.data}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <User className="h-4 w-4 text-so-blue" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Solicitante</div>
                <div className="font-medium">{atendimento.solicitante}</div>
              </div>
            </div>
          </div>

          {/* Tempo */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Clock className="h-4 w-4 text-so-blue" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Tempo de Atendimento</div>
              <div className="font-medium">{atendimento.tempo}</div>
            </div>
          </div>

          <Separator />

          {/* Problema */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Problema Relatado</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              {atendimento.resumo}
            </div>
          </div>

          {/* Solução */}
          {atendimento.solucao && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Solução Aplicada</span>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                {atendimento.solucao}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
