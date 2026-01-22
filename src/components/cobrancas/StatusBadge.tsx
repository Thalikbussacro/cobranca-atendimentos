'use client'

import { StatusCobranca } from '@/domain/entities/Cobranca'
import { getStatusConfig } from '@/presentation/constants/status'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HelpCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: StatusCobranca
  showHelp?: boolean
}

export function StatusBadge({ status, showHelp = true }: StatusBadgeProps) {
  const config = getStatusConfig(status)

  return (
    <div className="flex items-center gap-1">
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
      
      {showHelp && (
        <Popover>
          <PopoverTrigger asChild>
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" side="top">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={config.variant} className="text-xs">
                  {config.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Ação: {config.executor === 'ambos' ? 'Admin/Cliente' : config.executor === 'admin' ? 'Admin' : 'Cliente'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {config.description}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
