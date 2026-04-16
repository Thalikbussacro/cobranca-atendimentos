import { useState, useMemo, Fragment } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronDown, ChevronUp, Mail, Loader2 } from 'lucide-react'
import { sortCobrancas } from '@/utils/sorting'
import { StatusBadge } from '@/components/StatusBadge'
import { SortableHeader } from '@/components/SortableHeader'
import { CobrancaDetails } from '@/components/CobrancaDetails'

export function TabelaCobrancas({ cobrancas, onEnviarEmail, enviandoEmailId }) {
  const [expandedId, setExpandedId] = useState(null)
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

  const sortedCobrancas = useMemo(
    () => sortCobrancas(cobrancas, sortState),
    [cobrancas, sortState]
  )

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <SortableHeader
              field="id"
              currentField={sortState.field}
              currentDirection={sortState.direction}
              onSort={handleSort}
              className="w-[60px] md:w-[80px]"
            >
              Nº
            </SortableHeader>
            <SortableHeader
              field="cliente"
              currentField={sortState.field}
              currentDirection={sortState.direction}
              onSort={handleSort}
            >
              Cliente
            </SortableHeader>
            <SortableHeader
              field="periodo"
              currentField={sortState.field}
              currentDirection={sortState.direction}
              onSort={handleSort}
              className="hidden md:table-cell"
            >
              Período
            </SortableHeader>
            <SortableHeader
              field="atendimentos"
              currentField={sortState.field}
              currentDirection={sortState.direction}
              onSort={handleSort}
              className="text-center"
            >
              Atend.
            </SortableHeader>
            <TableHead className="hidden lg:table-cell">Horas</TableHead>
            <SortableHeader
              field="emailEnviado"
              currentField={sortState.field}
              currentDirection={sortState.direction}
              onSort={handleSort}
            >
              Status
            </SortableHeader>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCobrancas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 md:py-8 text-muted-foreground text-sm"
              >
                Nenhuma cobrança encontrada.
              </TableCell>
            </TableRow>
          ) : (
            sortedCobrancas.map((cobranca) => {
              const isExpanded = expandedId === cobranca.id

              return (
                <Fragment key={cobranca.id}>
                  <TableRow className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-so-blue text-xs md:text-sm">
                      #{cobranca.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-so-blue text-sm">{cobranca.cliente}</div>
                        <div className="text-xs text-muted-foreground md:hidden mt-0.5">
                          {cobranca.periodo}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {cobranca.periodo}
                    </TableCell>
                    <TableCell className="text-center text-sm">{cobranca.atendimentos}</TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell text-sm">
                      {cobranca.horas}
                    </TableCell>
                    <TableCell>
                      <StatusBadge emailEnviado={cobranca.emailEnviado} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 md:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs md:text-sm h-7 md:h-8"
                          onClick={() => onEnviarEmail(cobranca.id)}
                          disabled={cobranca.emailEnviado || enviandoEmailId === cobranca.id}
                          title={cobranca.emailEnviado ? 'E-mail já enviado' : 'Enviar e-mail'}
                        >
                          {enviandoEmailId === cobranca.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4 mr-1" />
                          )}
                          <span className="hidden sm:inline">
                            {enviandoEmailId === cobranca.id ? 'Enviando...' : 'Enviar E-mail'}
                          </span>
                          <span className="sm:hidden">
                            {enviandoEmailId === cobranca.id ? '...' : 'Enviar'}
                          </span>
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-so-blue text-xs md:text-sm px-1 md:px-2"
                          onClick={() => toggleExpand(cobranca.id)}
                        >
                          <span className="hidden sm:inline">Detalhes</span>
                          <span className="sm:hidden">Ver</span>
                          {isExpanded ? (
                            <ChevronUp className="ml-0.5 md:ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-0.5 md:ml-1 h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0 bg-muted/20">
                        <CobrancaDetails cobranca={cobranca} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
