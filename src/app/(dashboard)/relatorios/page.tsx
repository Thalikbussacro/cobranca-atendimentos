'use client'

import { useState } from 'react'
import { Card, CardBody, Button, Input, Select, SelectItem } from '@heroui/react'
import { FileText, FileSpreadsheet } from 'lucide-react'

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(false)
  const [periodo, setPeriodo] = useState('3')

  const periodos = [
    { key: '3', label: 'Últimos 3 meses' },
    { key: '6', label: 'Últimos 6 meses' },
    { key: '12', label: 'Último ano' },
  ]

  const handleGenerateReport = () => {
    setLoading(true)
    setTimeout(() => {
      alert('Relatório gerado.')
      setLoading(false)
    }, 1000)
  }

  const handleExportPDF = () => {
    alert('Exportando relatório em PDF.')
  }

  const handleExportExcel = () => {
    alert('Exportando relatório em Excel.')
  }

  return (
    <>
      <Card shadow="none" className="border border-default-200">
        <CardBody className="gap-4">
          <div>
            <div className="font-bold text-base">Relatórios</div>
            <div className="text-xs text-default-500 mt-0.5">
              Gere relatórios personalizados por cliente, período e status.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            <Input 
              label="Cliente" 
              placeholder="Pesquisar cliente"
              variant="bordered"
            />

            <Select
              label="Período"
              selectedKeys={[periodo]}
              onSelectionChange={(keys) => setPeriodo(Array.from(keys)[0]?.toString() || '3')}
              variant="bordered"
              items={periodos}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>
          </div>

          <div className="flex justify-end gap-2.5">
            <Button 
              color="primary"
              size="sm" 
              onClick={handleGenerateReport} 
              isLoading={loading}
              className="font-bold"
            >
              Gerar relatório
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card shadow="none" className="border border-default-200">
        <CardBody className="gap-3">
          <div>
            <div className="font-bold text-sm">Exportações</div>
            <div className="text-xs text-default-500 mt-0.5">
              Exporte relatórios em diferentes formatos.
            </div>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <Button 
              variant="flat" 
              size="sm" 
              onClick={handleExportPDF}
              startContent={<FileText className="h-4 w-4" />}
            >
              Exportar PDF
            </Button>
            <Button 
              variant="flat" 
              size="sm" 
              onClick={handleExportExcel}
              startContent={<FileSpreadsheet className="h-4 w-4" />}
            >
              Exportar Excel
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  )
}
