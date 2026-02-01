'use client'

import { Cobranca } from '@/domain/entities/Cobranca'
import { Card, CardContent } from '@/components/ui/card'

interface CobrancaDetailsProps {
  cobranca: Cobranca
}

// Converte "08h 40m" para horas decimais (8.67)
function horasParaDecimal(horasStr: string): number {
  const match = horasStr.match(/(\d+)h\s*(\d+)m/)
  if (!match) return 0

  const horas = parseInt(match[1])
  const minutos = parseInt(match[2])

  return horas + (minutos / 60)
}

export function CobrancaDetails({ cobranca }: CobrancaDetailsProps) {
  const horasDecimais = horasParaDecimal(cobranca.horas)
  const precoTotal = horasDecimais * cobranca.precoHora

  return (
    <div className="p-3 md:p-6">
      {/* Informações do Cliente e Cobrança */}
      <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Informações do Cliente */}
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

          {/* Informações da Cobrança */}
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
                      currency: 'BRL'
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
                      currency: 'BRL'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Atendimentos */}
      <h4 className="text-xs md:text-sm font-semibold mb-2 md:mb-3 text-muted-foreground uppercase tracking-wider">
        Atendimentos Incluídos ({cobranca.atendimentos})
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[400px] md:max-h-[500px] overflow-y-auto">
        {cobranca.itens.map((item, idx) => (
          <Card
            key={idx}
            className="border-l-4 border-l-so-blue"
          >
            <CardContent className="p-3 md:p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-sm">{item.data} - {item.solicitante}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Tempo: {item.tempo}</div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                <strong>Problema:</strong> {item.resumo}
              </p>
              {item.solucao && (
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  <strong>Solução:</strong> {item.solucao}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
