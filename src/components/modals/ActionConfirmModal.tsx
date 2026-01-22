'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ActionVariant = 'success' | 'warning' | 'destructive' | 'info'

interface ActionConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: ActionVariant
  onConfirm: () => void
  loading?: boolean
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-500',
    buttonVariant: 'default' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-yellow-500',
    buttonVariant: 'default' as const,
  },
  destructive: {
    icon: XCircle,
    iconClass: 'text-red-500',
    buttonVariant: 'destructive' as const,
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500',
    buttonVariant: 'default' as const,
  },
}

export function ActionConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info',
  onConfirm,
  loading = false,
}: ActionConfirmModalProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-full bg-muted', config.iconClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Aguarde...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Configurações pré-definidas para ações comuns
export const actionConfigs = {
  // Ações do Cliente
  aceitarAtendimentos: {
    title: 'Aceitar Atendimentos',
    description: 'Ao aceitar, você autoriza a geração da guia de pagamento. O operador será notificado e enviará a fatura para pagamento.',
    confirmText: 'Aceitar Atendimentos',
    variant: 'success' as ActionVariant,
  },
  recusarAtendimentos: {
    title: 'Recusar Atendimentos',
    description: 'Ao recusar, a cobrança será marcada como recusada e o chat será aberto para que você possa explicar o motivo.',
    confirmText: 'Recusar Atendimentos',
    variant: 'destructive' as ActionVariant,
  },
  questionarAtendimentos: {
    title: 'Questionar Atendimentos',
    description: 'Será aberto um chat para você questionar os atendimentos incluídos nesta cobrança. O operador será notificado.',
    confirmText: 'Abrir Questionamento',
    variant: 'warning' as ActionVariant,
  },
  confirmarPagamento: {
    title: 'Confirmar Pagamento',
    description: 'Confirme que o pagamento foi realizado. O operador será notificado para verificação.',
    confirmText: 'Confirmar Pagamento',
    variant: 'success' as ActionVariant,
  },
  solicitarContato: {
    title: 'Solicitar Contato',
    description: 'O operador será notificado de que você deseja ser contatado sobre esta cobrança.',
    confirmText: 'Solicitar Contato',
    variant: 'info' as ActionVariant,
  },

  // Ações do Admin
  enviarEmail: {
    title: 'Enviar E-mail',
    description: 'O e-mail com os detalhes da cobrança será enviado para o cliente. Deseja continuar?',
    confirmText: 'Enviar E-mail',
    variant: 'info' as ActionVariant,
  },
  enviarTodosEmails: {
    title: 'Enviar Todos os E-mails',
    description: 'Todos os e-mails pendentes serão enviados para os respectivos clientes. Esta ação não pode ser desfeita.',
    confirmText: 'Enviar Todos',
    variant: 'warning' as ActionVariant,
  },
  gerarFatura: {
    title: 'Gerar e Enviar Fatura',
    description: 'A fatura será gerada e enviada para o cliente. O status será atualizado para "Fatura Enviada".',
    confirmText: 'Gerar Fatura',
    variant: 'info' as ActionVariant,
  },
  marcarPago: {
    title: 'Marcar como Pago',
    description: 'A cobrança será marcada como paga. Certifique-se de que o pagamento foi confirmado.',
    confirmText: 'Marcar como Pago',
    variant: 'success' as ActionVariant,
  },
  finalizarCobranca: {
    title: 'Finalizar Cobrança',
    description: 'A cobrança será finalizada. Esta ação encerra o processo de cobrança.',
    confirmText: 'Finalizar',
    variant: 'info' as ActionVariant,
  },
}
