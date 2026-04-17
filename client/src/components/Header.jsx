import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, FileText, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Cobranças', path: '/cobrancas', icon: FileText },
  { label: 'Clientes', path: '/clientes', icon: Users },
]

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-14 md:h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 bg-so-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">SO</span>
          </div>
          <h1 className="text-base md:text-lg font-semibold text-gray-800 hidden sm:block">
            Atendimento do Cliente
          </h1>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-so-blue-light text-so-blue'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-2 bg-so-blue text-white px-2 md:px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
          <span>{user?.name || 'Operador'}</span>
        </div>

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
