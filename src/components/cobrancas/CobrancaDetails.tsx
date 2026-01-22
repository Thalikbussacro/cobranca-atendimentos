import { Cobranca } from '@/domain/entities/Cobranca'
import { Badge } from '@/components/ui/Badge'
import { Button, Card, CardBody } from '@heroui/react'
import { Edit, FileText, Paperclip, Send, CheckCircle, Mail, RefreshCw, MessageCircle } from 'lucide-react'
import { CobrancaEmailInfo } from './CobrancaEmailInfo'

interface CobrancaDetailsProps {
  cobranca: Cobranca
  onAction: (action: string, description: string) => void
  onChatOpen: (cobrancaId: number) => void
}

export function CobrancaDetails({ cobranca, onAction, onChatOpen }: CobrancaDetailsProps) {
  // Mock de e-mails enviados
  const emailsMock = cobranca.emailsEnviados
    ? cobranca.emailsEnviados.map((email) => ({
        destinatario: email,
        dataEnvio: '20/01/2026 14:30',
        status: 'enviado' as const,
      }))
    : []

  return (
    <div className="bg-default-50 p-6 border-t-2 border-default-200">
      <div className="grid grid-cols-[1fr_1fr_0.8fr] gap-4 max-xl:grid-cols-[1.5fr_1fr] max-lg:grid-cols-1">
        <div>
          <div className="text-xs font-bold text-default-500 uppercase tracking-wider mb-2">
            Atendimentos incluídos
          </div>
          <div className="flex flex-col gap-2">
            {cobranca.itens.map((item, idx) => (
              <Card key={idx} shadow="none" className="border border-default-200">
                <CardBody>
                  <div className="flex items-center justify-between gap-2.5 flex-wrap mb-2">
                    <div>
                      <strong className="text-sm">
                        {item.data} • {item.solicitante}
                      </strong>
                      <br />
                      <small className="text-xs text-default-500 font-semibold">Tempo: {item.tempo}</small>
                    </div>
                    <Badge variant="gray">Cobrar</Badge>
                  </div>
                  <p className="text-sm text-default-700 mb-1">
                    <b>Problema:</b> {item.resumo}
                  </p>
                  <p className="text-sm text-default-700">
                    <b>Solução:</b> {item.solucao}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <CobrancaEmailInfo
            emails={emailsMock}
            ultimaInteracao={cobranca.ultimaInteracaoCliente}
          />
        </div>

        <div>
          <div className="text-xs font-bold text-default-600 uppercase tracking-wider mb-3">
            Ações do Operador
          </div>
          <div className="app-card-inner p-3 space-y-2">
              <Button
                variant="flat"
                size="sm"
                className="w-full justify-start"
                startContent={<Edit className="h-4 w-4" />}
                onClick={() =>
                  onAction('Editar cobrança', 'Editar período, observações e itens da cobrança.')
                }
              >
                Editar
              </Button>

              <Button
                variant="flat"
                size="sm"
                className="w-full justify-start"
                startContent={<FileText className="h-4 w-4" />}
                onClick={() =>
                  onAction('Gerar PDF', 'Gerar documento com detalhamento dos atendimentos.')
                }
              >
                Gerar PDF
              </Button>

              <Button
                variant="flat"
                size="sm"
                className="w-full justify-start"
                startContent={<Paperclip className="h-4 w-4" />}
                onClick={() =>
                  onAction('Anexar NF', 'Fazer upload do PDF da nota fiscal.')
                }
              >
                Anexar NF
              </Button>

              <Button
                color="primary"
                size="sm"
                className="w-full justify-start font-bold"
                startContent={<Send className="h-4 w-4" />}
                onClick={() =>
                  onAction('Enviar para cliente', 'Enviar cobrança e documentos por e-mail.')
                }
              >
                Enviar para cliente
              </Button>

              <Button
                variant="flat"
                size="sm"
                className="w-full justify-start"
                startContent={<RefreshCw className="h-4 w-4" />}
                onClick={() =>
                  onAction('Reenviar e-mail', 'Reenviar documentos para o cliente.')
                }
              >
                Reenviar e-mail
              </Button>

              <Button
                variant="flat"
                size="sm"
                className="w-full justify-start"
                startContent={<Mail className="h-4 w-4" />}
                onClick={() =>
                  onAction('Alterar e-mail', 'Modificar destinatário do e-mail.')
                }
              >
                Alterar e-mail
              </Button>

              <Button
                variant="flat"
                size="sm"
                className="w-full justify-start"
                startContent={<MessageCircle className="h-4 w-4" />}
                onClick={() => onChatOpen(cobranca.id)}
              >
                Conversar com cliente
              </Button>

              <Button
                variant="flat"
                size="sm"
                className="w-full justify-start"
                startContent={<CheckCircle className="h-4 w-4" />}
                onClick={() =>
                  onAction('Marcar como pago', 'Registrar pagamento da cobrança.')
                }
              >
                Marcar como pago
              </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
