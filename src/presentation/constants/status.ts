import { StatusCobranca } from '@/domain/entities/Cobranca'

export interface StatusConfig {
  text: string
  variant: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
}

export type StatusLabel = Record<StatusCobranca, StatusConfig>

export const statusLabel: StatusLabel = {
  ABERTO: { text: 'Em aberto', variant: 'yellow' },
  AGUARDANDO_NF: { text: 'Aguardando NF', variant: 'gray' },
  ENVIADA: { text: 'Enviada', variant: 'blue' },
  PAGA: { text: 'Paga', variant: 'green' },
  CONTESTADA: { text: 'Contestada', variant: 'red' },
  CANCELADA: { text: 'Cancelada', variant: 'gray' },
}
