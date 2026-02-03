import { Cobranca } from '@/domain/entities/Cobranca'
import nodemailer from 'nodemailer'
import { parseEmails } from './emailValidator'
import { gerarHTMLCobranca, gerarTextoPlanoCobranca } from './emailTemplate'

/**
 * Interface para serviço de envio de e-mails
 */
export interface IEmailService {
  enviarCobranca(cobranca: Cobranca): Promise<void>
}

/**
 * Implementação real de envio de emails via SMTP
 */
export class EmailServiceSMTP implements IEmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Validar variáveis de ambiente obrigatórias
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      throw new Error(
        'Variáveis SMTP não configuradas. Verifique SMTP_HOST e SMTP_USER no .env'
      )
    }

    // Criar transporter do nodemailer
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  async enviarCobranca(cobranca: Cobranca): Promise<void> {
    console.log('=== INICIANDO ENVIO DE EMAIL ===')
    console.log('Cobrança ID:', cobranca.id)
    console.log('Cliente:', cobranca.cliente)
    console.log('Emails raw:', cobranca.clienteEmails)

    // 1. Parse e validação de emails
    const emails = parseEmails(cobranca.clienteEmails)
    console.log('Emails parseados:', emails)

    if (emails.length === 0) {
      throw new Error(
        'Nenhum email válido encontrado para o cliente. Verifique o cadastro.'
      )
    }

    // 2. Verificar conexão SMTP
    console.log('Verificando conexão SMTP...')
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
    })

    try {
      await this.transporter.verify()
      console.log('✓ Conexão SMTP verificada com sucesso')
    } catch (error: any) {
      console.error('✗ Erro ao verificar conexão SMTP:', error.message)
      throw new Error(`Falha na conexão SMTP: ${error.message}`)
    }

    // 3. Gerar HTML e texto plano do email
    const html = gerarHTMLCobranca(cobranca)
    const text = gerarTextoPlanoCobranca(cobranca)
    console.log('✓ Templates gerados (HTML + texto plano)')

    // 4. Criar subject do email
    const subject = `Empresa Genérica - Atendimentos Prestados - ${cobranca.periodo}`
    console.log('Subject:', subject)

    // 5. Enviar email
    console.log('Enviando email...')
    const info = await this.transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: emails.join(', '),
      subject,
      html,
      text, // Versão texto plano (fallback)
    })

    // 6. Log de sucesso
    console.log('✓✓✓ EMAIL ENVIADO COM SUCESSO ✓✓✓')
    console.log('MessageID:', info.messageId)
    console.log('Accepted:', info.accepted)
    console.log('Rejected:', info.rejected)
    console.log('Response:', info.response)
    console.log('===================================')
  }

}

/**
 * Mock do serviço de e-mail para testes sem SMTP
 */
export class EmailServiceMock implements IEmailService {
  async enviarCobranca(cobranca: Cobranca): Promise<void> {
    console.log('EmailServiceMock.enviarCobranca() - Simulação de envio')
    console.log('Cobrança:', cobranca.id)
    console.log('Cliente:', cobranca.cliente)
    console.log('E-mails destino:', cobranca.clienteEmails)

    return Promise.resolve()
  }
}
