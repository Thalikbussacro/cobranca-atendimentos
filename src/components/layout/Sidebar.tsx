'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { FileText, Plus, BarChart3, Receipt, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

const menuItems = [
  {
    icon: Receipt,
    label: 'Cobranças',
    href: '/cobrancas',
  },
  {
    icon: Plus,
    label: 'Nova',
    href: '/nova-cobranca',
    highlight: true,
  },
  {
    icon: FileText,
    label: 'Cobranças',
    href: '/cobrancas',
    subItem: true,
  },
  {
    icon: BarChart3,
    label: 'Relatórios',
    href: '/relatorios',
  },
]

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

export function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      "bg-sidebar flex flex-col h-screen",
      mobile 
        ? "w-[280px] fixed inset-y-0 left-0 z-50" 
        : "w-[220px] max-lg:hidden"
    )}>
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-sidebar font-bold text-lg">SO</span>
          </div>
          <span className="text-white font-semibold text-sm">
            AUTOMAÇÃO
          </span>
        </div>
        {mobile && onClose && (
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Menu */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={index} href={item.href} onClick={mobile ? onClose : undefined}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm',
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white',
                    item.highlight && 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30',
                    item.subItem && 'ml-4 text-xs'
                  )}
                >
                  <Icon className={cn('h-4 w-4', item.highlight && 'text-yellow-400')} />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-white/50 text-xs">
          <div className="mb-1">Onde resolver está:</div>
          <div className="text-white/30">SO Automação</div>
        </div>
      </div>
    </aside>
  )
}
