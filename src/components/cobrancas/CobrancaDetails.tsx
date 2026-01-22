'use client'

import { Cobranca } from '@/domain/entities/Cobranca'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Edit, 
  FileText, 
  Paperclip, 
  Send, 
  CheckCircle, 
  Mail, 
  RefreshCw, 
  MessageCircle,
  Clock
} from 'lucide-react'

interface CobrancaDetailsProps {
  cobranca: Cobranca
  onAction: (action: string, cobrancaId: number) => void
}

export function CobrancaDetails({ cobranca, onAction }: CobrancaDetailsProps) {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Atendimentos */}
      <div className="lg:col-span-2">
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
          Atendimentos Incluídos
        </h4>
        <div className="space-y-2">
          {cobranca.itens.map((item, idx) => (
            <Card key={idx} className="border-l-4 border-l-so-blue">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{item.data} - {item.solicitante}</div>
                    <div className="text-sm text-muted-foreground">Tempo: {item.tempo}</div>
                  </div>
                  <Badge variant="outline">Cobrar</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Problema:</strong> {item.resumo}
                </p>
                {item.solucao && (
                  <p className="text-sm text-muted-foreground mt-1">
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
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
          Ações do Operador
        </h4>
        <Card>
          <CardContent className="p-3 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onAction('editar', cobranca.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onAction('gerar-pdf', cobranca.id)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onAction('anexar-nf', cobranca.id)}
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Anexar NF
            </Button>

            <Separator className="my-2" />

            <Button
              size="sm"
              className="w-full justify-start"
              onClick={() => onAction('enviar', cobranca.id)}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar para cliente
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onAction('reenviar', cobranca.id)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reenviar e-mail
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onAction('alterar-email', cobranca.id)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Alterar e-mail
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onAction('chat', cobranca.id)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Conversar com cliente
            </Button>

            <Separator className="my-2" />

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-green-600 hover:text-green-700"
              onClick={() => onAction('pagar', cobranca.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como pago
            </Button>
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
