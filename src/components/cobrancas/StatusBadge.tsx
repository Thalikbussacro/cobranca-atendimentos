'use client'

import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  emailEnviado: boolean
}

export function StatusBadge({ emailEnviado }: StatusBadgeProps) {
  return (
    <Badge variant={emailEnviado ? 'default' : 'secondary'}>
      {emailEnviado ? 'E-mail Enviado' : 'Não Enviado'}
    </Badge>
  )
}
