'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Send, Search } from 'lucide-react'

interface ToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  periodo: string
  onPeriodoChange: (value: string) => void
  onNewCobranca: () => void
  onEnviarTodos: () => void
}

export function Toolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  periodo,
  onPeriodoChange,
  onNewCobranca,
  onEnviarTodos,
}: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
      {/* Action Buttons */}
      <div className="flex items-center gap-2 md:gap-3">
        <Button onClick={onNewCobranca} className="text-xs md:text-sm h-9 md:h-10 flex-1 sm:flex-none">
          <Plus className="h-4 w-4 mr-1.5 md:mr-2" />
          <span className="hidden sm:inline">Nova </span>Cobrança
        </Button>

        <Button variant="outline" onClick={onEnviarTodos} className="text-xs md:text-sm h-9 md:h-10 flex-1 sm:flex-none">
          <Send className="h-4 w-4 mr-1.5 md:mr-2" />
          Enviar Todos Pendentes
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full sm:w-[150px] md:w-[200px] h-9 md:h-10 text-sm"
          />
        </div>

        <Select value={periodo || 'todos'} onValueChange={onPeriodoChange}>
          <SelectTrigger className="w-[130px] sm:w-[150px] h-9 md:h-10 text-xs md:text-sm">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os períodos</SelectItem>
            <SelectItem value="mes-atual">Mês atual</SelectItem>
            <SelectItem value="mes-anterior">Mês anterior</SelectItem>
            <SelectItem value="trimestre">Último trimestre</SelectItem>
            <SelectItem value="ano">Ano atual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status || 'all'} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[130px] sm:w-[150px] h-9 md:h-10 text-xs md:text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="enviado">E-mail Enviado</SelectItem>
            <SelectItem value="nao-enviado">Não Enviado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
