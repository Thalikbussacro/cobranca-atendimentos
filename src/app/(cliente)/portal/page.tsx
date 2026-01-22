'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCobrancas } from '@/hooks/useCobrancas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar, ChevronDown, ChevronUp, MessageCircle, FileText, Download } from 'lucide-react'

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' }> = {
  ABERTO: { label: 'Em aberto', variant: 'warning' },
  ENVIADA: { label: 'Enviada', variant: 'info' },
  PAGA: { label: 'Paga', variant: 'success' },
  FECHADA: { label: 'Fechada', variant: 'success' },
}

export default function PortalClientePage() {
  const { user } = useAuth()
  const { cobrancas, loading } = useCobrancas()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    dataInicial: '',
    dataFinal: '',
    cliente: 'all',
    status: 'all',
  })

  // Filtrar cobranças do cliente
  const clienteCobrancas = cobrancas.filter((c) => {
    if (user?.clienteId) {
      return c.clienteId === user.clienteId
    }
    return true // Admin vendo todos
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando cobranças...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header da página */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Cobranças</h2>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={filters.dataInicial}
                onChange={(e) => setFilters({ ...filters, dataInicial: e.target.value })}
                className="w-[150px]"
              />
              <span className="text-muted-foreground">até</span>
              <Input
                type="date"
                value={filters.dataFinal}
                onChange={(e) => setFilters({ ...filters, dataFinal: e.target.value })}
                className="w-[150px]"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ABERTO">Em aberto</SelectItem>
                <SelectItem value="ENVIADA">Enviada</SelectItem>
                <SelectItem value="PAGA">Paga</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              Buscar novas operados
            </Button>

            <Button variant="outline" size="sm">
              Reenviar e-mail
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nº</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-center">Atendimentos</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clienteCobrancas.map((cobranca) => {
                const isExpanded = expandedId === cobranca.id
                const status = statusConfig[cobranca.status] || statusConfig.ABERTO

                return (
                  <>
                    <TableRow key={cobranca.id}>
                      <TableCell className="font-medium text-so-blue">
                        {cobranca.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-so-blue">{cobranca.cliente}</div>
                        <div className="text-xs text-muted-foreground">Versão do operador</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cobranca.periodo}
                      </TableCell>
                      <TableCell className="text-center">
                        {cobranca.atendimentos}
                      </TableCell>
                      <TableCell>{cobranca.horas}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-so-blue"
                          onClick={() => setExpandedId(isExpanded ? null : cobranca.id)}
                        >
                          Detalhes
                          {isExpanded ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/20 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Atendimentos */}
                            <div>
                              <h4 className="font-semibold mb-3">Atendimentos</h4>
                              <div className="space-y-2">
                                {cobranca.itens.map((item, idx) => (
                                  <Card key={idx}>
                                    <CardContent className="p-3">
                                      <div className="text-sm">
                                        <div className="font-medium">{item.data} - {item.solicitante}</div>
                                        <div className="text-muted-foreground">{item.resumo}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                          Tempo: {item.tempo}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>

                            {/* Ações */}
                            <div>
                              <h4 className="font-semibold mb-3">Ações</h4>
                              <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Falar com Atendente
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Solicitar Guia
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                  <Download className="h-4 w-4 mr-2" />
                                  Baixar Relatório
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
