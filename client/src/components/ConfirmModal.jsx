import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export function ConfirmModal({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', variant = 'destructive', onConfirm, onCancel }) {
  if (!open) return null

  const variantStyles = {
    destructive: {
      icon: 'bg-red-100',
      iconColor: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    default: {
      icon: 'bg-blue-100',
      iconColor: 'text-blue-600',
      button: 'bg-so-blue hover:bg-so-blue-dark text-white',
    },
  }

  const styles = variantStyles[variant] || variantStyles.default

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-150">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[400px] max-w-[calc(100vw-2rem)] p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
        <div className="flex items-start gap-4">
          <div className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${styles.icon}`}>
            <AlertTriangle className={`h-5 w-5 ${styles.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button className={styles.button} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
