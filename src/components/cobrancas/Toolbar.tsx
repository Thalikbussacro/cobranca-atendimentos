import { Plus, Send } from 'lucide-react'
import { Button, Input, Select, SelectItem } from '@heroui/react'
import { EnviarTodosButton } from './EnviarTodosButton'

interface ToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  onNewCobranca: () => void
  totalCobrancas: number
  onEnviarTodas: () => Promise<void>
}

export function Toolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onNewCobranca,
  totalCobrancas,
  onEnviarTodas,
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
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button 
          color="primary" 
          size="md" 
          onClick={onNewCobranca}
          startContent={<Plus className="h-4 w-4" />}
          className="font-bold px-6"
        >
          Nova Cobrança
        </Button>

        <EnviarTodosButton totalCobrancas={totalCobrancas} onConfirm={onEnviarTodas} />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Buscar por cliente, NF, período..."
          value={search}
          onValueChange={onSearchChange}
          className="flex-1 min-w-[280px]"
          variant="bordered"
          size="md"
          classNames={{
            input: "text-sm",
            inputWrapper: "border-1.5 border-default-300"
          }}
        />

        <Select
          selectedKeys={status ? [status] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0]?.toString() || ''
            onStatusChange(value)
          }}
          variant="bordered"
          size="md"
          placeholder="Filtrar por status"
          className="min-w-[220px]"
          items={statusOptions}
          classNames={{
            trigger: "border-1.5 border-default-300"
          }}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </div>
    </div>
  )
}
