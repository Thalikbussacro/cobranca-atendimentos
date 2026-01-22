'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, FileText, Calendar } from 'lucide-react'

export default function RelatoriosPage() {
  const [formData, setFormData] = useState({
    tipo: 'cobrancas',
    dataInicial: '',
    dataFinal: '',
    formato: 'pdf',
  })

  const handleExportar = () => {
    alert('Relatório gerado com sucesso! (mock)')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Relatórios</h2>
        <p className="text-muted-foreground">
          Exporte relatórios de cobranças e atendimentos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerar Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de Relatório */}
          <div className="space-y-2">
            <Label>Tipo de Relatório</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData({ ...formData, tipo: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cobrancas">Cobranças por Período</SelectItem>
                <SelectItem value="atendimentos">Atendimentos Detalhados</SelectItem>
                <SelectItem value="clientes">Resumo por Cliente</SelectItem>
                <SelectItem value="financeiro">Relatório Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Período */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicial">Data Inicial</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dataInicial"
                  type="date"
                  value={formData.dataInicial}
                  onChange={(e) => setFormData({ ...formData, dataInicial: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFinal">Data Final</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dataFinal"
                  type="date"
                  value={formData.dataFinal}
                  onChange={(e) => setFormData({ ...formData, dataFinal: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Formato */}
          <div className="space-y-2">
            <Label>Formato de Exportação</Label>
            <Select
              value={formData.formato}
              onValueChange={(value) => setFormData({ ...formData, formato: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão */}
          <div className="pt-4">
            <Button onClick={handleExportar} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
