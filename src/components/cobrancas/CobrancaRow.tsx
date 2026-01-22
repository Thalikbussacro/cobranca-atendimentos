import { useState } from 'react'
import { Cobranca } from '@/domain/entities/Cobranca'
import { Badge } from '@/components/ui/Badge'
import { CobrancaDetails } from './CobrancaDetails'
import { statusLabel } from '@/presentation/constants/status'
import { Button } from '@heroui/react'
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'

interface CobrancaRowProps {
  cobranca: Cobranca
  onChatOpen: (cobrancaId: number) => void
  onAction: (action: string, description: string) => void
}

export function CobrancaRow({ cobranca, onChatOpen, onAction }: CobrancaRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <tr className="hover:bg-default-50/50 transition-colors">
        <td className="px-4 py-4 border-b border-default-200">
          <div className="font-bold text-primary">#{cobranca.id}</div>
          <div className="text-default-600 font-semibold text-sm mt-0.5">{cobranca.cliente}</div>
        </td>
        <td className="px-4 py-4 border-b border-default-200 text-sm text-default-600">
          {cobranca.periodo}
        </td>
        <td className="px-4 py-4 border-b border-default-200 text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-lg min-w-[50px]">
            {cobranca.atendimentos}
          </div>
        </td>
        <td className="px-4 py-4 border-b border-default-200 text-center">
          <div className="inline-flex items-center justify-center bg-default-100 text-default-700 font-bold text-sm px-3 py-1 rounded-lg min-w-[60px]">
            {cobranca.horas}
          </div>
        </td>
        <td className="px-4 py-4 border-b border-default-200">
          {cobranca.nf ? (
            <div className="text-sm font-bold text-success">{cobranca.nf}</div>
          ) : (
            <span className="text-xs text-default-400">Pendente</span>
          )}
        </td>
        <td className="px-4 py-4 border-b border-default-200">
          <Badge variant={statusLabel[cobranca.status]?.variant || 'gray'}>
            {statusLabel[cobranca.status]?.text || cobranca.status}
          </Badge>
        </td>
        <td className="px-4 py-4 border-b border-default-200 text-xs text-default-500">
          {cobranca.ultimaAcao}
        </td>
        <td className="px-4 py-4 border-b border-default-200">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="bordered"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              startContent={isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              className="border-1.5"
            >
              {isExpanded ? 'Fechar' : 'Detalhes'}
            </Button>

            <Button
              color="primary"
              variant="flat"
              size="sm"
              onClick={() => onChatOpen(cobranca.id)}
              startContent={<MessageSquare className="h-4 w-4" />}
              className="font-semibold"
            >
              Chat
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
