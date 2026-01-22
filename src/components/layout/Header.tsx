'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@heroui/react'
import { User, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  onVersionClick: () => void
}

export function Header({ onVersionClick }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const titleMap: { [key: string]: string } = {
    '/cobrancas': 'Cobranças',
    '/nova-cobranca': 'Nova Cobrança',
    '/relatorios': 'Relatórios',
  }
  
  const title = titleMap[pathname] || 'Painel'

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b-2 border-default-200 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      <h1 className="text-xl font-bold text-default-800">{title}</h1>

      <div className="flex items-center gap-3">
        <Button
          variant="bordered"
          size="md"
          onClick={onVersionClick}
          className="border-1.5 font-semibold max-sm:text-xs max-sm:px-3"
        >
          <span className="max-sm:hidden">Visualizar como Cliente</span>
          <span className="sm:hidden">Ver Cliente</span>
        </Button>

        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-default-100 rounded-xl border-1.5 border-default-300">
          <User className="h-4 w-4 text-default-500" />
          <span className="text-sm font-bold text-default-700">{user?.name}</span>
        </div>

        <Button
          color="danger"
          variant="flat"
          size="md"
          onClick={handleLogout}
          startContent={<LogOut className="h-4 w-4" />}
          className="font-semibold max-sm:px-3"
        >
          <span className="max-sm:hidden">Sair</span>
        </Button>
      </div>
    </header>
  )
}
