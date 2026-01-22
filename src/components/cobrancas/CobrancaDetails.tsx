import { Cobranca } from '@/domain/entities/Cobranca'
import { Badge } from '@/components/ui/Badge'
import { Button, Card, CardBody } from '@heroui/react'
import { Edit, FileText, Paperclip, Send, CheckCircle } from 'lucide-react'

interface CobrancaDetailsProps {
  cobranca: Cobranca
  onAction: (action: string, description: string) => void
}

export function CobrancaDetails({ cobranca, onAction }: CobrancaDetailsProps) {
  return (
    <div className="bg-default-50 p-3">
      <div className="grid grid-cols-[1.2fr_0.8fr] gap-3 max-lg:grid-cols-1">
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
          <div className="text-xs font-bold text-default-500 uppercase tracking-wider mb-2">
            Ações do operador
          </div>
          <Card shadow="none" className="border border-default-200">
            <CardBody className="gap-2">
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
                startContent={<CheckCircle className="h-4 w-4" />}
                onClick={() =>
                  onAction('Marcar como pago', 'Registrar pagamento da cobrança.')
                }
              >
                Marcar como pago
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
