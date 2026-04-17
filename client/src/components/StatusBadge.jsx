import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock } from 'lucide-react'

export function StatusBadge({ emailEnviado }) {
  return emailEnviado ? (
    <Badge variant="success" className="gap-1">
      <CheckCircle2 className="h-3 w-3" />
      Enviado
    </Badge>
  ) : (
    <Badge variant="secondary" className="gap-1">
      <Clock className="h-3 w-3" />
      Pendente
    </Badge>
  )
}
