'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { VersionModal } from '@/components/modals/VersionModal'
import { useAuth } from '@/hooks/useAuth'
import { useCobrancas } from '@/hooks/useCobrancas'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { cobrancas } = useCobrancas()
  const [showVersionModal, setShowVersionModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen grid grid-cols-[270px_1fr] max-lg:grid-cols-1">
      <Sidebar
        cobrancasCount={cobrancas.length}
        onVersionClick={() => setShowVersionModal(true)}
      />

      <main className="flex flex-col min-w-0">
        <Header
          title="Cobranças"
          subtitle="Painel para acompanhar cobranças geradas e ações do operador."
          userName={user.name}
          onVersionClick={() => setShowVersionModal(true)}
          onLogout={handleLogout}
        />

        <div className="p-4 flex flex-col gap-3.5">{children}</div>
      </main>

      <VersionModal
        isOpen={showVersionModal}
        onClose={() => setShowVersionModal(false)}
      />
    </div>
  )
}
