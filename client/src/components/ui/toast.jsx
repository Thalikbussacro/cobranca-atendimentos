import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cva } from 'class-variance-authority'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToastStore } from '@/stores/useToastStore'

const toastVariants = cva(
  'relative flex items-start gap-3 w-[360px] max-w-[calc(100vw-2rem)] rounded-lg border px-4 py-3 shadow-lg',
  {
    variants: {
      variant: {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const iconColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
}

function ToastItem({ toast }) {
  const removeToast = useToastStore((s) => s.removeToast)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), toast.duration - 300)
    const removeTimer = setTimeout(() => removeToast(toast.id), toast.duration)
    return () => {
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [toast.id, toast.duration, removeToast])

  const handleClose = () => {
    setExiting(true)
    setTimeout(() => removeToast(toast.id), 200)
  }

  const Icon = icons[toast.type] || Info

  return (
    <div
      className={cn(
        toastVariants({ variant: toast.type }),
        exiting
          ? 'animate-out fade-out slide-out-to-right duration-200'
          : 'animate-in slide-in-from-right-full fade-in duration-300'
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconColors[toast.type])} />
      <p className="text-sm flex-1 pr-6">{toast.message}</p>
      <button
        onClick={handleClose}
        className="absolute right-2 top-2 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body
  )
}
