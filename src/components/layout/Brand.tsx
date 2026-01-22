import { cn } from '@/lib/utils'

interface BrandProps {
  className?: string
}

export function Brand({ className }: BrandProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-so-blue to-so-blue-dark flex items-center justify-center text-white font-extrabold text-sm tracking-wide">
        SO
      </div>
      <div className="flex flex-col leading-tight">
        <strong className="text-base">SO Automação</strong>
        <span className="text-xs text-muted">Atendimento do Cliente</span>
      </div>
    </div>
  )
}
