import { StatusCobranca } from '@/domain/entities/Cobranca'

export interface StatusConfig {
  label: string
  description: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  executor: 'admin' | 'cliente' | 'ambos'
}

export const statusConfig: Record<StatusCobranca, StatusConfig> = {
  GERADA: {
    label: 'Aguardando Envio',
    description: 'A cobrança foi gerada, porém o primeiro e-mail ainda não foi enviado. O admin deve enviar individualmente ou pelo botão "Enviar Todos".',
    variant: 'secondary',
    executor: 'admin',
  },
  ENVIADA: {
    label: 'Enviada ao Cliente',
    description: 'O e-mail foi disparado para o cliente, aguardando resposta (aceitar, questionar ou recusar).',
    variant: 'info',
    executor: 'admin',
  },
  ACEITA: {
    label: 'Aceita pelo Cliente',
    description: 'O cliente aceitou os atendimentos e está aguardando o admin gerar e enviar a guia de pagamento.',
    variant: 'success',
    executor: 'cliente',
  },
  FATURA_ENVIADA: {
    label: 'Fatura Enviada',
    description: 'O admin enviou a fatura/cotação e está aguardando confirmação de pagamento do cliente.',
    variant: 'info',
    executor: 'admin',
  },
  PAGA: {
    label: 'Paga',
    description: 'O cliente confirmou o pagamento ou o admin marcou como pago.',
    variant: 'success',
    executor: 'ambos',
  },
  FINALIZADA: {
    label: 'Finalizada',
    description: 'A cobrança foi finalizada pelo admin.',
    variant: 'default',
    executor: 'admin',
  },
  CONTESTADA: {
    label: 'Contestada',
    description: 'O cliente contestou a cobrança através do botão "Questionar Atendimentos".',
    variant: 'warning',
    executor: 'cliente',
  },
  CONTATO_SOLICITADO: {
    label: 'Contato Solicitado',
    description: 'O cliente solicitou contato através do chat.',
    variant: 'warning',
    executor: 'cliente',
  },
  RECUSADA: {
    label: 'Recusada',
    description: 'O cliente recusou a cobrança através do botão "Recusar Atendimentos".',
    variant: 'destructive',
    executor: 'cliente',
  },
}

export const getStatusConfig = (status: StatusCobranca): StatusConfig => {
  return statusConfig[status] || statusConfig.GERADA
}
