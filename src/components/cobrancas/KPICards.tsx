import { Card, CardBody } from '@heroui/react'
import { Badge } from '@/components/ui/Badge'
import { Clock, FileText, Send, CheckCircle } from 'lucide-react'

interface KPICardsProps {
  aberto: number
  aguardandoNF: number
  enviadas: number
  pagas: number
}

export function KPICards({ aberto, aguardandoNF, enviadas, pagas }: KPICardsProps) {
  return (
    <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <Card shadow="none" className="border border-default-200">
        <CardBody>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0">
              <small className="text-default-500 font-semibold text-xs">Em aberto</small>
              <strong className="text-2xl font-bold">{aberto}</strong>
            </div>
            <Clock className="h-5 w-5 text-warning" />
          </div>
        </CardBody>
      </Card>

      <Card shadow="none" className="border border-default-200">
        <CardBody>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0">
              <small className="text-default-500 font-semibold text-xs">Aguardando NF</small>
              <strong className="text-2xl font-bold">{aguardandoNF}</strong>
            </div>
            <FileText className="h-5 w-5 text-default-400" />
          </div>
        </CardBody>
      </Card>

      <Card shadow="none" className="border border-default-200">
        <CardBody>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0">
              <small className="text-default-500 font-semibold text-xs">Enviadas</small>
              <strong className="text-2xl font-bold">{enviadas}</strong>
            </div>
            <Send className="h-5 w-5 text-primary" />
          </div>
        </CardBody>
      </Card>

      <Card shadow="none" className="border border-default-200">
        <CardBody>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0">
              <small className="text-default-500 font-semibold text-xs">Pagas</small>
              <strong className="text-2xl font-bold">{pagas}</strong>
            </div>
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
