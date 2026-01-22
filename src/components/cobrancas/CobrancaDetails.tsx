'use client'

import { Cobranca, AtendimentoItem } from '@/domain/entities/Cobranca'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Edit, 
  FileText, 
  Paperclip, 
  Send, 
  CheckCircle, 
  Mail, 
  RefreshCw, 
  MessageCircle,
  XCircle,
  ExternalLink
} from 'lucide-react'

interface CobrancaDetailsProps {
  cobranca: Cobranca
  onAction: (action: string, cobrancaId: number) => void
  onChatOpen?: () => void
  onAtendimentoClick?: (atendimento: AtendimentoItem) => void
}

export function CobrancaDetails({ cobranca, onAction, onChatOpen, onAtendimentoClick }: CobrancaDetailsProps) {
  return (
    <div className="p-3 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Atendimentos */}
      <div className="lg:col-span-2">
        <h4 className="text-xs md:text-sm font-semibold mb-2 md:mb-3 text-muted-foreground uppercase tracking-wider">
          Atendimentos Incluídos
        </h4>
        <div className="space-y-2 max-h-[300px] md:max-h-[400px] overflow-y-auto">
          {cobranca.itens.map((item, idx) => (
            <Card 
              key={idx} 
              className="border-l-4 border-l-so-blue cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onAtendimentoClick?.(item)}
            >
              <CardContent className="p-2 md:p-4">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                  <div>
                    <div className="font-medium text-sm">{item.data} - {item.solicitante}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">Tempo: {item.tempo}</div>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <Badge variant="outline" className="text-xs">Cobrar</Badge>
                    {onAtendimentoClick && (
                      <ExternalLink className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                  <strong>Problema:</strong> {item.resumo}
                </p>
                {item.solucao && (
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">
                    <strong>Solução:</strong> {item.solucao}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div>
        <h4 className="text-xs md:text-sm font-semibold mb-2 md:mb-3 text-muted-foreground uppercase tracking-wider">
          Ações do Operador
        </h4>
        <Card>
          <CardContent className="p-2 md:p-3">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 md:gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs md:text-sm h-8 md:h-9"
                onClick={() => onAction('editar', cobranca.id)}
              >
                <Edit className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Editar
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs md:text-sm h-8 md:h-9"
                onClick={() => onAction('gerar-pdf', cobranca.id)}
              >
                <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Gerar PDF
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs md:text-sm h-8 md:h-9"
                onClick={() => onAction('anexar-nf', cobranca.id)}
              >
                <Paperclip className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Anexar NF
              </Button>

              <Button
                size="sm"
                className="justify-start text-xs md:text-sm h-8 md:h-9"
                onClick={() => onAction('enviar', cobranca.id)}
              >
                <Send className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Enviar
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs md:text-sm h-8 md:h-9"
                onClick={() => onAction('gerar-fatura', cobranca.id)}
              >
                <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Fatura
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs md:text-sm h-8 md:h-9"
                onClick={() => onAction('reenviar', cobranca.id)}
              >
                <RefreshCw className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Reenviar
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs md:text-sm h-8 md:h-9"
                onClick={() => onAction('alterar-email', cobranca.id)}
              >
                <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                E-mail
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs md:text-sm h-8 md:h-9"
                onClick={onChatOpen}
              >
                <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Chat
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start text-green-600 hover:text-green-700 text-xs md:text-sm h-8 md:h-9"
                onClick={() => onAction('pagar', cobranca.id)}
              >
                <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Pago
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs md:text-sm h-8 md:h-9"
                onClick={() => onAction('finalizar', cobranca.id)}
              >
                <XCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Finalizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info de e-mails */}
        {cobranca.emailsEnviados && cobranca.emailsEnviados.length > 0 && (
          <Card className="mt-4">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">E-mails Enviados</CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              {cobranca.emailsEnviados.map((email, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                  <Mail className="h-3 w-3" />
                  <span>{email}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
