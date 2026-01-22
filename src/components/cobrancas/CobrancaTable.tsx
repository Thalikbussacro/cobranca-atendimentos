import { Cobranca } from '@/domain/entities/Cobranca'
import { CobrancaRow } from './CobrancaRow'

interface CobrancaTableProps {
  cobrancas: Cobranca[]
  onChatOpen: (cobrancaId: number) => void
  onAction: (action: string, description: string) => void
}

export function CobrancaTable({ cobrancas, onChatOpen, onAction }: CobrancaTableProps) {
  return (
    <div className="overflow-auto border border-default-200 rounded-lg bg-white">
      <table className="w-full border-collapse min-w-[980px]">
        <thead>
          <tr className="bg-default-50">
            <th className="text-left px-3 py-3 text-xs font-bold text-default-500 uppercase tracking-wider border-b border-default-200">
              Cliente
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold text-default-500 uppercase tracking-wider border-b border-default-200">
              Período
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold text-default-500 uppercase tracking-wider border-b border-default-200">
              Atendimentos
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold text-default-500 uppercase tracking-wider border-b border-default-200">
              Total horas
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold text-default-500 uppercase tracking-wider border-b border-default-200">
              NF
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold text-default-500 uppercase tracking-wider border-b border-default-200">
              Status
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold text-default-500 uppercase tracking-wider border-b border-default-200">
              Última ação
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold text-default-500 uppercase tracking-wider border-b border-default-200">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {cobrancas.map((cobranca) => (
            <CobrancaRow
              key={cobranca.id}
              cobranca={cobranca}
              onChatOpen={onChatOpen}
              onAction={onAction}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
