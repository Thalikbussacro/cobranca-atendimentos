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
import { ChevronDown, ChevronUp, Mail, Loader2, Trash2, Inbox } from 'lucide-react'
import { sortCobrancas } from '@/utils/sorting'
import { StatusBadge } from '@/components/StatusBadge'
import { SortableHeader } from '@/components/SortableHeader'
import { CobrancaDetails } from '@/components/CobrancaDetails'

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><div className="h-4 w-8 bg-gray-200 rounded animate-pulse" /></TableCell>
      <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
      <TableCell className="hidden md:table-cell"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /></TableCell>
      <TableCell className="text-center"><div className="h-4 w-6 bg-gray-200 rounded animate-pulse mx-auto" /></TableCell>
      <TableCell className="hidden lg:table-cell"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
      <TableCell><div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" /></TableCell>
      <TableCell className="text-right"><div className="h-7 w-24 bg-gray-200 rounded animate-pulse ml-auto" /></TableCell>
    </TableRow>
  )
}

export function TabelaCobrancas({ cobrancas, loading, onEnviarEmail, enviandoEmailId, onCancelar }) {
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
      {/* Contagem de registros */}
      {!loading && cobrancas.length > 0 && (
        <div className="px-4 py-2 bg-muted/30 border-b text-xs text-muted-foreground">
          {cobrancas.length} cobrança(s) encontrada(s)
        </div>
      )}

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
              N
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
              Periodo
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
            <TableHead className="text-right">Acoes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : sortedCobrancas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Inbox className="h-10 w-10 mb-3 text-gray-300" />
                  <p className="text-sm font-medium">Nenhuma cobranca encontrada</p>
                  <p className="text-xs mt-1">Gere novas cobrancas usando o formulario acima</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedCobrancas.map((cobranca) => {
              const isExpanded = expandedId === cobranca.id

              return (
                <Fragment key={cobranca.id}>
                  <TableRow
                    className={`hover:bg-muted/30 transition-colors cursor-pointer ${isExpanded ? 'bg-muted/20' : ''}`}
                    onClick={() => toggleExpand(cobranca.id)}
                  >
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
                      <div className="flex items-center justify-end gap-1 md:gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs md:text-sm h-7 md:h-8"
                          onClick={() => onEnviarEmail(cobranca.id)}
                          disabled={cobranca.emailEnviado || enviandoEmailId === cobranca.id}
                          title={cobranca.emailEnviado ? 'E-mail ja enviado' : 'Enviar e-mail'}
                        >
                          {enviandoEmailId === cobranca.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4 mr-1" />
                          )}
                          <span className="hidden sm:inline">
                            {enviandoEmailId === cobranca.id ? 'Enviando...' : 'Enviar'}
                          </span>
                        </Button>
                        {!cobranca.emailEnviado && onCancelar && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs md:text-sm h-7 md:h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => onCancelar(cobranca.id)}
                            title="Cancelar cobranca"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="animate-in fade-in slide-in-from-top-1 duration-200">
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
