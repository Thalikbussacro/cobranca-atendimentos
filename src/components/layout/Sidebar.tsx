'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Brand } from './Brand'
import { FileText, Plus, BarChart3, Info } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
  color: 'blue' | 'yellow' | 'green' | 'gray'
}

const navItems: NavItem[] = [
  {
    label: 'Cobranças',
    href: '/cobrancas',
    icon: <FileText className="h-4 w-4" />,
    color: 'blue',
  },
  {
    label: 'Nova Cobrança',
    href: '/nova-cobranca',
    icon: <Plus className="h-4 w-4" />,
    color: 'yellow',
  },
  {
    label: 'Relatórios',
    href: '/relatorios',
    icon: <BarChart3 className="h-4 w-4" />,
    color: 'green',
  },
]

interface SidebarProps {
  cobrancasCount?: number
  onVersionClick: () => void
}

export function Sidebar({ cobrancasCount = 0, onVersionClick }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-[270px] bg-white border-r border-border p-4 sticky top-0 h-screen overflow-auto max-lg:relative max-lg:h-auto">
      <Brand className="mb-2.5" />

      <div className="mt-4 mb-2 text-xs font-extrabold text-muted uppercase tracking-wider">
        Cobrança
      </div>

      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all select-none',
                'hover:bg-slate-50 hover:border-slate-200',
                {
                  'bg-so-blue/12 border-so-blue/25 text-so-blue-dark font-extrabold': isActive,
                  'bg-transparent border-transparent': !isActive,
                }
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn('w-2.5 h-2.5 rounded-full', {
                    'bg-so-blue': item.color === 'blue',
                    'bg-warning': item.color === 'yellow',
                    'bg-success': item.color === 'green',
                    'bg-muted': item.color === 'gray',
                  })}
                />
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.href === '/cobrancas' && cobrancasCount > 0 && (
                <span className="px-2 py-0.5 bg-so-blue/10 border border-so-blue/30 text-so-blue-dark text-xs font-extrabold rounded-full">
                  {cobrancasCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 mb-2 text-xs font-extrabold text-muted uppercase tracking-wider">
        Atalhos
      </div>

      <nav className="flex flex-col gap-1.5">
        <button
          onClick={onVersionClick}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-all select-none text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-muted" />
            <Info className="h-4 w-4" />
            <span>Ver como Cliente</span>
          </div>
        </button>
      </nav>

      <div className="mt-4 text-xs text-muted leading-relaxed">
        <strong>Dica:</strong> isto é um mockup funcional.
        <br />
        Depois você liga com SQL/API.
      </div>
    </aside>
  )
}
