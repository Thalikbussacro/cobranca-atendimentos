'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'

interface HeaderProps {
  onVersionClick?: () => void
}

export function Header({ onVersionClick }: HeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-so-blue rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">SO</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-800">
          Atendimento do Cliente
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Ver versao do cliente */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={onVersionClick}
          className="text-gray-600"
        >
          Ver versão do cliente
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>

        {/* User badge */}
        <div className="flex items-center gap-2 bg-so-blue text-white px-3 py-1.5 rounded-full text-sm font-medium">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
            {getInitials(user?.name || 'OP')}
          </div>
          <span>{user?.name || 'Operador'}</span>
          <ChevronDown className="h-4 w-4" />
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
