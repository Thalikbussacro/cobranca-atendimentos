import { Card, CardBody, Chip } from '@heroui/react'
import { Mail, Clock, CheckCircle, XCircle } from 'lucide-react'

interface EmailInfo {
  destinatario: string
  dataEnvio: string
  status: 'enviado' | 'falhou' | 'lido'
}

interface CobrancaEmailInfoProps {
  emails: EmailInfo[]
  ultimaInteracao?: string
}

export function CobrancaEmailInfo({ emails, ultimaInteracao }: CobrancaEmailInfoProps) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs font-bold text-default-500 uppercase tracking-wider mb-2">
          E-mails Enviados
        </div>
        <div className="space-y-2">
          {emails.length === 0 ? (
            <div className="text-sm text-default-400 py-2">Nenhum e-mail enviado ainda</div>
          ) : (
            emails.map((email, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-default-50 rounded-lg border border-default-200"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-default-400" />
                  <div>
                    <div className="text-sm font-semibold">{email.destinatario}</div>
                    <div className="text-xs text-default-500">
                      Enviado em {email.dataEnvio}
                    </div>
                  </div>
                </div>
                <Chip
                  size="sm"
                  variant="flat"
                  color={
                    email.status === 'lido'
                      ? 'success'
                      : email.status === 'enviado'
                      ? 'primary'
                      : 'danger'
                  }
                  startContent={
                    email.status === 'lido' ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : email.status === 'falhou' ? (
                      <XCircle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )
                  }
                >
                  {email.status === 'lido' ? 'Lido' : email.status === 'enviado' ? 'Enviado' : 'Falhou'}
                </Chip>
              </div>
            ))
          )}
        </div>
      </div>

      {ultimaInteracao && (
        <div>
          <div className="text-xs font-bold text-default-500 uppercase tracking-wider mb-2">
            Última Interação do Cliente
          </div>
          <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-default-700">{ultimaInteracao}</p>
          </div>
        </div>
      )}
    </div>
  )
}
