'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Send, Search, Calendar } from 'lucide-react'

interface ToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  dataInicial: string
  dataFinal: string
  onDataInicialChange: (value: string) => void
  onDataFinalChange: (value: string) => void
  onNewCobranca: () => void
  onEnviarTodos: () => void
}

export function Toolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  dataInicial,
  dataFinal,
  onDataInicialChange,
  onDataFinalChange,
  onNewCobranca,
  onEnviarTodos,
}: ToolbarProps) {
  return (
    <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
      {/* Action Buttons */}
      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <Button onClick={onNewCobranca} className="text-xs md:text-sm h-9 md:h-10">
          <Plus className="h-4 w-4 mr-1.5 md:mr-2" />
          Nova Cobrança
        </Button>

        <Button variant="outline" onClick={onEnviarTodos} className="text-xs md:text-sm h-9 md:h-10">
          <Send className="h-4 w-4 mr-1.5 md:mr-2" />
          Enviar Todos Pendentes
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 md:gap-4">
        <div className="flex-1 w-full sm:max-w-[250px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 md:h-10 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 w-full sm:max-w-[160px]">
          <Label htmlFor="data-inicial" className="text-xs mb-1 block">Data Inicial</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="data-inicial"
              type="date"
              value={dataInicial}
              onChange={(e) => onDataInicialChange(e.target.value)}
              className="pl-9 h-9 md:h-10 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 w-full sm:max-w-[160px]">
          <Label htmlFor="data-final" className="text-xs mb-1 block">Data Final</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="data-final"
              type="date"
              value={dataFinal}
              onChange={(e) => onDataFinalChange(e.target.value)}
              className="pl-9 h-9 md:h-10 text-sm"
            />
          </div>
        </div>

        <div className="w-full sm:w-auto sm:min-w-[150px]">
          <Label htmlFor="status-filter" className="text-xs mb-1 block">Status</Label>
          <Select value={status || 'all'} onValueChange={onStatusChange}>
            <SelectTrigger id="status-filter" className="h-9 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="enviado">E-mail Enviado</SelectItem>
              <SelectItem value="nao-enviado">Não Enviado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
