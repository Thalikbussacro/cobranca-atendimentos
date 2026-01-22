'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useAuth } from '@/hooks/useAuth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [showVersionModal, setShowVersionModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onVersionClick={() => setShowVersionModal(true)} />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Modal Ver como Cliente */}
      <Dialog open={showVersionModal} onOpenChange={setShowVersionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visualizar como Cliente</DialogTitle>
            <DialogDescription>
              Você será redirecionado para o portal do cliente para visualizar
              como seus clientes veem as cobranças.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => router.push('/portal')}>
              Ir para Portal do Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
