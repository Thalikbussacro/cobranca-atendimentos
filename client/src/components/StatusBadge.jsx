import { Badge } from '@/components/ui/badge'

export function StatusBadge({ emailEnviado }) {
  return (
    <Badge variant={emailEnviado ? 'default' : 'secondary'}>
      {emailEnviado ? 'E-mail Enviado' : 'Não Enviado'}
    </Badge>
  )
}
