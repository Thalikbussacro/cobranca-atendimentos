'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Brand } from '@/components/layout/Brand'
import { LogOut, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ClienteLayoutProps {
  children: React.ReactNode
}

export default function ClienteLayout({ children }: ClienteLayoutProps) {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    // Verifica se está em modo preview (admin visualizando como cliente)
    const previewMode = sessionStorage.getItem('preview_mode') === 'true'
    setIsPreviewMode(previewMode)

    // Se não está em preview mode e não é cliente, redireciona
    if (!previewMode && (!isAuthenticated || user?.role !== 'cliente')) {
      router.push('/login')
    }
  }, [isAuthenticated, user, router])

  const handleLogout = () => {
    sessionStorage.removeItem('preview_mode')
    logout()
    router.push('/login')
  }

  const handleVoltarAdmin = () => {
    sessionStorage.removeItem('preview_mode')
    router.push('/cobrancas')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border px-4 py-3.5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <Brand />
          
          {isPreviewMode && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-so-blue/10 border border-so-blue/30 rounded-lg text-xs font-bold text-so-blue-dark">
              <Eye className="h-3.5 w-3.5" />
              Modo de Visualização (Admin)
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {isPreviewMode ? (
              <Button variant="light" size="sm" onClick={handleVoltarAdmin}>
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Admin
              </Button>
            ) : (
              <>
                <div className="text-sm max-sm:hidden">
                  <span className="text-muted font-semibold">Bem-vindo,</span>{' '}
                  <span className="font-extrabold text-so-blue-dark">{user?.name}</span>
                </div>
                <Button variant="light" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {children}
      </main>
    </div>
  )
}

// Import necessário
import { Eye } from 'lucide-react'
