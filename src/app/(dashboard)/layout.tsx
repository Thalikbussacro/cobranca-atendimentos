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
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onVersionClick={() => setShowVersionModal(true)} />
        <main className="flex-1 overflow-y-auto p-6 max-sm:p-4">{children}</main>
      </div>

      <VersionModal
        isOpen={showVersionModal}
        onClose={() => setShowVersionModal(false)}
      />
    </div>
  )
}
