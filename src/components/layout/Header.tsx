'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronDown, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="h-14 md:h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-gray-600"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Logo/Title */}
        <div className="w-8 h-8 bg-so-blue rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">SO</span>
        </div>
        <h1 className="text-base md:text-lg font-semibold text-gray-800 hidden sm:block">
          Atendimento do Cliente
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* User badge */}
        <div className="flex items-center gap-2 bg-so-blue text-white px-2 md:px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
          <div className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
            {getInitials(user?.name || 'OP')}
          </div>
          <span className="hidden md:inline">{user?.name || 'Operador'}</span>
          <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-500 h-8 w-8 md:h-9 md:w-9"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
