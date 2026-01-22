import { cn } from '@/lib/utils'

interface BrandProps {
  className?: string
  variant?: 'default' | 'white'
  showText?: boolean
}

export function Brand({ className, variant = 'default', showText = true }: BrandProps) {
  const isWhite = variant === 'white'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div 
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg',
          isWhite ? 'bg-yellow-400 text-sidebar' : 'bg-so-blue text-white'
        )}
      >
        SO
      </div>
      {showText && (
        <div className="flex flex-col">
          <span 
            className={cn(
              'font-bold text-sm leading-tight',
              isWhite ? 'text-white' : 'text-so-blue'
            )}
          >
            SO AUTOMAÇÃO
          </span>
          <span 
            className={cn(
              'text-xs',
              isWhite ? 'text-white/70' : 'text-gray-500'
            )}
          >
            Atendimento do Cliente
          </span>
        </div>
      )}
    </div>
  )
}
