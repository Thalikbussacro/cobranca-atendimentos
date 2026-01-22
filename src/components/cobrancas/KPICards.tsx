import { Clock, FileText, Send, CheckCircle } from 'lucide-react'

interface KPICardsProps {
  aberto: number
  aguardandoNF: number
  enviadas: number
  pagas: number
}

export function KPICards({ aberto, aguardandoNF, enviadas, pagas }: KPICardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1 mb-6">
      <div className="app-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-default-500 uppercase tracking-wide mb-2">Em Aberto</div>
            <div className="text-3xl font-bold text-warning">{aberto}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-warning" />
          </div>
        </div>
      </div>

      <div className="app-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-default-500 uppercase tracking-wide mb-2">Aguardando NF</div>
            <div className="text-3xl font-bold text-default-600">{aguardandoNF}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-default-100 flex items-center justify-center">
            <FileText className="h-6 w-6 text-default-500" />
          </div>
        </div>
      </div>

      <div className="app-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-default-500 uppercase tracking-wide mb-2">Enviadas</div>
            <div className="text-3xl font-bold text-primary">{enviadas}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Send className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="app-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-default-500 uppercase tracking-wide mb-2">Pagas</div>
            <div className="text-3xl font-bold text-success">{pagas}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
        </div>
      </div>
    </div>
  )
}
