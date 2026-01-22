'use client'

import { Button } from '@/components/ui/Button'
import { getInitials } from '@/lib/utils'
import { LogOut, Info } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  userName: string
  onVersionClick: () => void
  onLogout: () => void
}

export function Header({ title, subtitle, userName, onVersionClick, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border px-4 py-3.5 flex items-center justify-between gap-3 sticky top-0 z-10 max-md:flex-col max-md:items-stretch">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex flex-col leading-tight min-w-0">
          <strong className="text-[15px]">{title}</strong>
          {subtitle && (
            <span className="text-xs text-muted truncate max-w-full">{subtitle}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 max-md:justify-between flex-wrap">
        <Button variant="light" size="sm" onClick={onVersionClick} className="max-sm:text-xs max-sm:px-2">
          <Info className="h-4 w-4" />
          <span className="max-sm:hidden">Visualizar como Cliente</span>
          <span className="sm:hidden">Ver Cliente</span>
        </Button>

        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-full border border-default-200 bg-white">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-so-blue to-so-blue-dark flex items-center justify-center text-white font-extrabold text-xs">
            {getInitials(userName)}
          </div>
          <div className="flex flex-col leading-tight max-sm:hidden">
            <small className="text-xs text-default-500 font-semibold">Operador</small>
            <span className="text-[13px] font-extrabold">{userName}</span>
          </div>
        </div>

        <Button color="danger" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  )
}
