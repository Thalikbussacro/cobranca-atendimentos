'use client'

import { useState } from 'react'
import { Cobranca } from '@/domain/entities/Cobranca'
import { statusLabel } from '@/presentation/constants/status'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@heroui/react'
import { CobrancaDetails } from './CobrancaDetails'
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'

interface CobrancaRowProps {
  cobranca: Cobranca
  onChatOpen: (cobrancaId: number) => void
  onAction: (action: string, description: string) => void
}

export function CobrancaRow({ cobranca, onChatOpen, onAction }: CobrancaRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const st = statusLabel[cobranca.status]

  return (
    <>
      <tr className="hover:bg-default-50 transition-colors">
        <td className="px-3 py-3 border-b border-default-200">
          <b>#{cobranca.id}</b>
          <br />
          <span className="text-default-500 font-semibold text-sm">{cobranca.cliente}</span>
        </td>
        <td className="px-3 py-3 border-b border-default-200 text-sm">{cobranca.periodo}</td>
        <td className="px-3 py-3 border-b border-default-200">
          <b className="text-sm">{cobranca.atendimentos}</b>
        </td>
        <td className="px-3 py-3 border-b border-default-200">
          <b className="text-sm">{cobranca.horas}</b>
        </td>
        <td className="px-3 py-3 border-b border-default-200">
          {cobranca.nf ? (
            <b className="text-sm">{cobranca.nf}</b>
          ) : (
            <span className="text-default-400 font-semibold">—</span>
          )}
        </td>
        <td className="px-3 py-3 border-b border-default-200">
          <div className="flex gap-1.5 flex-wrap">
            <Badge variant={st.variant}>{st.text}</Badge>
            {cobranca.notificacao && <Badge variant="red">Nova mensagem</Badge>}
          </div>
        </td>
        <td className="px-3 py-3 border-b border-default-200 text-sm text-default-500 font-semibold">
          {cobranca.ultimaAcao}
        </td>
        <td className="px-3 py-3 border-b border-default-200">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="flat"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              startContent={isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            >
              {isExpanded ? 'Fechar' : 'Detalhes'}
            </Button>
            <Button 
              color="primary"
              size="sm" 
              onClick={() => onChatOpen(cobranca.id)}
              startContent={<MessageSquare className="h-4 w-4" />}
              className="font-bold"
            >
              Atendente
            </Button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={8} className="p-0 border-b border-default-200">
            <CobrancaDetails cobranca={cobranca} onAction={onAction} onChatOpen={onChatOpen} />
          </td>
        </tr>
      )}
    </>
  )
}
