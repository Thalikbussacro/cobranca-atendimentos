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
import { Plus, Send, LayoutGrid, List, Search } from 'lucide-react'

interface ToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  onNewCobranca: () => void
  onEnviarTodas: () => void
}

export function Toolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onNewCobranca,
  onEnviarTodas,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
      <div className="flex items-center gap-3">
        <Button onClick={onNewCobranca}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Cobranças
        </Button>

        <Button variant="outline" onClick={onEnviarTodas}>
          <Send className="h-4 w-4 mr-2" />
          Enviar todos e-mails
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar verafa"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-[200px]"
          />
        </div>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ABERTO">Em aberto</SelectItem>
            <SelectItem value="AGUARDANDO_NF">Aguardando NF</SelectItem>
            <SelectItem value="ENVIADA">Enviada</SelectItem>
            <SelectItem value="PAGA">Paga</SelectItem>
            <SelectItem value="CONTESTADA">Contestada</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border rounded-md">
          <Button variant="ghost" size="icon" className="rounded-r-none">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-l-none border-l">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
