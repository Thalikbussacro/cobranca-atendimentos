import { Cobranca } from '@/domain/entities/Cobranca'
import { CobrancaRow } from './CobrancaRow'

interface CobrancaTableProps {
  cobrancas: Cobranca[]
  onChatOpen: (cobrancaId: number) => void
  onAction: (action: string, description: string) => void
}

export function CobrancaTable({ cobrancas, onChatOpen, onAction }: CobrancaTableProps) {
  return (
    <div className="table-responsive mt-6 border-1.5 border-default-200 rounded-xl overflow-hidden">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-default-50 border-b-2 border-default-200">
            <th className="px-4 py-3.5 text-left text-xs font-bold text-default-700 uppercase tracking-wider">
              ID / Cliente
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-bold text-default-700 uppercase tracking-wider">
              Período
            </th>
            <th className="px-4 py-3.5 text-center text-xs font-bold text-default-700 uppercase tracking-wider">
              Atend.
            </th>
            <th className="px-4 py-3.5 text-center text-xs font-bold text-default-700 uppercase tracking-wider">
              Horas
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-bold text-default-700 uppercase tracking-wider">
              NF
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-bold text-default-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3.5 text-left text-xs font-bold text-default-700 uppercase tracking-wider">
              Última Ação
            </th>
            <th className="px-4 py-3.5 text-right text-xs font-bold text-default-700 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
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
