'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Brand } from './Brand'
import { cn } from '@/lib/utils'
import { FileText, Plus, BarChart } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/cobrancas', label: 'Cobranças', icon: FileText },
    { href: '/nova-cobranca', label: 'Nova Cobrança', icon: Plus },
    { href: '/relatorios', label: 'Relatórios', icon: BarChart },
  ]

  return (
    <aside className="w-64 bg-white border-r-2 border-default-200 flex flex-col overflow-hidden max-lg:hidden">
      <div className="p-5 border-b-2 border-default-200">
        <Brand />
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all',
                  isActive
                    ? 'bg-primary text-white font-bold shadow-sm'
                    : 'text-default-600 hover:bg-default-100 font-medium'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t-2 border-default-200 text-xs text-default-500 bg-default-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="font-bold">Sistema Ativo</span>
        </div>
        <div className="font-medium">Versão 1.0.0</div>
      </div>
    </aside>
  )
}
