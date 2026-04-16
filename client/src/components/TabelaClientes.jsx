import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SortableHeader } from '@/components/SortableHeader'
import { Inbox } from 'lucide-react'
import { formatCnpj, formatTelefone } from '@/utils/formatters'

function sortClientes(clientes, { field, direction }) {
  if (!field || !direction) return clientes
  return [...clientes].sort((a, b) => {
    let valA = a[field] ?? ''
    let valB = b[field] ?? ''
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()
    if (valA < valB) return direction === 'asc' ? -1 : 1
    if (valA > valB) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function TabelaClientes({ clientes, loading }) {
  const [sortState, setSortState] = useState({ field: null, direction: null })

  const handleSort = (field) => {
    setSortState((prev) => {
      if (prev.field === field) {
        if (prev.direction === 'asc') return { field, direction: 'desc' }
        if (prev.direction === 'desc') return { field: null, direction: null }
      }
      return { field, direction: 'asc' }
    })
  }

  const sortedClientes = useMemo(
    () => sortClientes(clientes, sortState),
    [clientes, sortState]
  )

  return (
    <div className="border rounded-lg overflow-x-auto">
      {!loading && clientes.length > 0 && (
        <div className="px-4 py-2 bg-muted/30 border-b text-xs text-muted-foreground">
          {clientes.length} cliente(s)
        </div>
      )}

      <Table className="min-w-[500px]">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <SortableHeader
              field="id"
              currentField={sortState.field}
              currentDirection={sortState.direction}
              onSort={handleSort}
              className="w-[60px]"
            >
              Cod.
            </SortableHeader>
            <SortableHeader
              field="nome"
              currentField={sortState.field}
              currentDirection={sortState.direction}
              onSort={handleSort}
            >
              Nome
            </SortableHeader>
            <SortableHeader
              field="cnpj"
              currentField={sortState.field}
              currentDirection={sortState.direction}
              onSort={handleSort}
              className="hidden md:table-cell"
            >
              CNPJ
            </SortableHeader>
            <TableHead className="hidden lg:table-cell">E-mail</TableHead>
            <TableHead className="hidden lg:table-cell">Telefone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="h-4 w-8 bg-gray-200 rounded animate-pulse" /></TableCell>
                <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
                <TableCell className="hidden md:table-cell"><div className="h-4 w-36 bg-gray-200 rounded animate-pulse" /></TableCell>
                <TableCell className="hidden lg:table-cell"><div className="h-4 w-40 bg-gray-200 rounded animate-pulse" /></TableCell>
                <TableCell className="hidden lg:table-cell"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /></TableCell>
              </TableRow>
            ))
          ) : sortedClientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Inbox className="h-10 w-10 mb-3 text-gray-300" />
                  <p className="text-sm font-medium">Nenhum cliente encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedClientes.map((cliente) => (
              <TableRow key={cliente.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-so-blue text-xs md:text-sm">
                  #{cliente.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{cliente.nome}</div>
                  <div className="text-xs text-muted-foreground md:hidden mt-0.5">
                    {formatCnpj(cliente.cnpj)}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell text-sm">
                  {formatCnpj(cliente.cnpj)}
                </TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell text-sm">
                  {cliente.email}
                </TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell text-sm">
                  {formatTelefone(cliente.telefone)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
