import { useState, useMemo, Fragment } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronDown, ChevronUp, Mail, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// === StatusBadge ===
function StatusBadge({ emailEnviado }) {
  return (
    <Badge variant={emailEnviado ? 'default' : 'secondary'}>
      {emailEnviado ? 'E-mail Enviado' : 'Não Enviado'}
    </Badge>
  )
}

// === SortableHeader ===
function SortableHeader({ children, field, currentField, currentDirection, onSort, className }) {
  const isActive = currentField === field

  return (
    <TableHead
      className={cn('cursor-pointer select-none hover:bg-muted/70 transition-colors', className)}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{children}</span>
        <span className="text-muted-foreground">
          {isActive ? (
            currentDirection === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
          )}
        </span>
      </div>
    </TableHead>
  )
}

// === CobrancaDetails ===
function horasParaDecimal(horasStr) {
  const match = horasStr.match(/(\d+)h\s*(\d+)m/)
  if (!match) return 0
  return parseInt(match[1]) + parseInt(match[2]) / 60
}

function CobrancaDetails({ cobranca }) {
  const horasDecimais = horasParaDecimal(cobranca.horas)
  const precoTotal = horasDecimais * cobranca.precoHora
  const [expandedAtendimento, setExpandedAtendimento] = useState(null)

  const toggleAtendimento = (idx) => {
    setExpandedAtendimento(expandedAtendimento === idx ? null : idx)
  }

  return (
    <div className="p-3 md:p-6">
      <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <Card className="border-l-4 border-l-so-blue">
            <CardContent className="p-3 md:p-4">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Cliente
              </h5>
              <div className="space-y-1.5">
                <div>
                  <span className="text-xs text-muted-foreground">CNPJ:</span>
                  <p className="text-sm font-medium">{cobranca.clienteCnpj}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">E-mails:</span>
                  <p className="text-sm font-medium break-words">
                    {cobranca.clienteEmails.split(';').map((email, idx) => (
                      <span key={idx} className="block">
                        {email}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-400">
            <CardContent className="p-3 md:p-4">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Valores
              </h5>
              <div className="space-y-1.5">
                <div>
                  <span className="text-xs text-muted-foreground">Preço por Hora:</span>
                  <p className="text-sm font-medium">
                    {cobranca.precoHora.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Horas Comerciais:</span>
                  <p className="text-sm font-medium">
                    {horasDecimais.toFixed(2)}h ({cobranca.horas})
                  </p>
                </div>
                <div className="pt-1 border-t">
                  <span className="text-xs text-muted-foreground">Valor Total:</span>
                  <p className="text-base md:text-lg font-bold text-so-blue">
                    {precoTotal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <h4 className="text-xs md:text-sm font-semibold mb-2 md:mb-3 text-muted-foreground uppercase tracking-wider">
        Atendimentos Incluídos ({cobranca.atendimentos})
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[400px] md:max-h-[500px] overflow-y-auto">
        {cobranca.itens.map((item, idx) => {
          const isExpanded = expandedAtendimento === idx
          const shouldTruncate =
            !isExpanded &&
            (item.resumo.length > 100 || (item.solucao && item.solucao.length > 100))

          return (
            <Card
              key={idx}
              className="border-l-4 border-l-so-blue hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => toggleAtendimento(idx)}
            >
              <CardContent className="p-3 md:p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {item.data} - {item.solicitante}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Tempo: {item.tempo}
                    </div>
                  </div>
                  {shouldTruncate && (
                    <div className="ml-2 text-so-blue">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-0.5">Problema:</p>
                    <p
                      className={`text-xs md:text-sm text-muted-foreground ${
                        !isExpanded && item.resumo.length > 100 ? 'line-clamp-2' : ''
                      }`}
                    >
                      {item.resumo}
                    </p>
                  </div>

                  {item.solucao && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-0.5">
                        Solução:
                      </p>
                      <p
                        className={`text-xs md:text-sm text-muted-foreground ${
                          !isExpanded && item.solucao.length > 100 ? 'line-clamp-2' : ''
                        }`}
                      >
                        {item.solucao}
                      </p>
                    </div>
                  )}
                </div>

                {shouldTruncate && (
                  <div className="mt-2 text-xs text-so-blue font-medium">
                    {isExpanded ? 'Clique para recolher' : 'Clique para expandir'}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// === TabelaCobrancas ===
function sortCobrancas(cobrancas, sortState) {
  if (!sortState.field || !sortState.direction) return cobrancas

  return [...cobrancas].sort((a, b) => {
    let comparison = 0

    switch (sortState.field) {
      case 'id':
        comparison = a.id - b.id
        break
      case 'cliente':
        comparison = a.cliente.localeCompare(b.cliente)
        break
      case 'periodo':
        comparison = a.periodo.localeCompare(b.periodo)
        break
      case 'atendimentos':
        comparison = a.atendimentos - b.atendimentos
        break
      case 'emailEnviado':
        comparison = (a.emailEnviado ? 1 : 0) - (b.emailEnviado ? 1 : 0)
        break
    }

    return sortState.direction === 'asc' ? comparison : -comparison
  })
}

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
