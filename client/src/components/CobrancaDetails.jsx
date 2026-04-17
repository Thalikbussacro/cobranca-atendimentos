import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { horasParaDecimal, formatCnpj } from '@/utils/formatters'

export function CobrancaDetails({ cobranca }) {
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
                  <p className="text-sm font-medium">{formatCnpj(cobranca.clienteCnpj)}</p>
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
