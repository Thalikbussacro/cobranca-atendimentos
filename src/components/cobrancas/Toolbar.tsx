import { Plus } from 'lucide-react'
import { Button, Input, Select, SelectItem } from '@heroui/react'

interface ToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  onNewCobranca: () => void
}

export function Toolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onNewCobranca,
}: ToolbarProps) {
  const statusOptions = [
    { key: '', label: 'Todos status' },
    { key: 'ABERTO', label: 'Em aberto' },
    { key: 'AGUARDANDO_NF', label: 'Aguardando NF' },
    { key: 'ENVIADA', label: 'Enviada' },
    { key: 'PAGA', label: 'Paga' },
    { key: 'CONTESTADA', label: 'Contestada' },
    { key: 'CANCELADA', label: 'Cancelada' },
  ]

  return (
    <div className="flex items-center gap-2.5 flex-wrap justify-between">
      <div className="flex items-center gap-2.5 flex-wrap">
        <Button 
          color="primary" 
          size="sm" 
          onClick={onNewCobranca}
          startContent={<Plus className="h-4 w-4" />}
          className="font-bold"
        >
          Nova Cobrança
        </Button>
        <Input
          placeholder="Buscar por cliente, NF, período..."
          value={search}
          onValueChange={onSearchChange}
          className="min-w-[280px]"
          variant="bordered"
          size="sm"
        />
      </div>

      <Select
        selectedKeys={status ? [status] : []}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0]?.toString() || ''
          onStatusChange(value)
        }}
        variant="bordered"
        size="sm"
        placeholder="Filtrar por status"
        className="min-w-[200px]"
        items={statusOptions}
      >
        {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
      </Select>
    </div>
  )
}
