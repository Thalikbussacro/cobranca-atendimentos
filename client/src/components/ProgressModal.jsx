import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Send, CheckCircle2, AlertTriangle, X } from 'lucide-react'

export function ProgressModal({ progresso, onCancelar, onFechar }) {
  if (!progresso) return null

  const finalizado = progresso.atual === null
  const total = progresso.total
  const processados = progresso.enviadas + progresso.erros
  const pct = total > 0 ? Math.round((processados / total) * 100) : 0

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[440px] max-w-[calc(100vw-2rem)] p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`flex items-center justify-center h-10 w-10 rounded-full ${finalizado ? 'bg-green-100' : 'bg-blue-100'}`}>
            {finalizado ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Send className="h-5 w-5 text-blue-600 animate-pulse" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {finalizado ? 'Envio concluído' : 'Enviando e-mails...'}
            </h2>
            <p className="text-sm text-gray-500">
              {finalizado
                ? `${processados} de ${total} processado(s)`
                : `${processados + 1} de ${total}`}
            </p>
          </div>
        </div>

        {/* Cliente atual */}
        {!finalizado && progresso.atual && (
          <div className="mb-4 px-3 py-2 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500 mb-0.5">Enviando para:</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {progresso.atual}
            </p>
          </div>
        )}

        {/* Barra de progresso */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-600">Progresso</span>
            <span className="text-xs font-semibold text-gray-800">{pct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                finalizado ? 'bg-green-500' : 'bg-blue-600'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Contadores */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 px-3 py-2 bg-green-50 rounded-md text-center">
            <p className="text-lg font-bold text-green-700">{progresso.enviadas}</p>
            <p className="text-xs text-green-600">Enviado(s)</p>
          </div>
          <div className="flex-1 px-3 py-2 bg-red-50 rounded-md text-center">
            <p className="text-lg font-bold text-red-700">{progresso.erros}</p>
            <p className="text-xs text-red-600">Erro(s)</p>
          </div>
          <div className="flex-1 px-3 py-2 bg-gray-50 rounded-md text-center">
            <p className="text-lg font-bold text-gray-700">{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2">
          {finalizado ? (
            <Button onClick={onFechar} className="bg-so-blue hover:bg-so-blue-dark">
              Fechar
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onCancelar}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1.5" />
              Cancelar Envio
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
