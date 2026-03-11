import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-14 md:h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 bg-so-blue rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">SO</span>
        </div>
        <h1 className="text-base md:text-lg font-semibold text-gray-800 hidden sm:block">
          Atendimento do Cliente
        </h1>
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
