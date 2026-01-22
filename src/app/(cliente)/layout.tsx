'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Brand } from '@/components/layout/Brand'
import { LogOut, ChevronDown } from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface ClienteLayoutProps {
  children: React.ReactNode
}

export default function ClienteLayout({ children }: ClienteLayoutProps) {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleVoltarAdmin = () => {
    router.push('/cobrancas')
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Brand />
        </div>

        <div className="flex items-center gap-3">
          {/* Voltar ao Admin (se for admin visualizando como cliente) */}
          {user.role === 'admin' && (
            <Button variant="outline" size="sm" onClick={handleVoltarAdmin}>
              Voltar ao Admin
            </Button>
          )}

          {/* User badge */}
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-sm">
            <div className="w-6 h-6 bg-so-blue rounded-full flex items-center justify-center text-white text-xs">
              {getInitials(user.name)}
            </div>
            <span className="font-medium">{user.name}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
