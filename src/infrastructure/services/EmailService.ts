import { Cobranca } from '@/domain/entities/Cobranca'
import nodemailer from 'nodemailer'
import { parseEmails } from './emailValidator'
import { gerarHTMLCobranca } from './emailTemplate'

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
    // 1. Parse e validação de emails
    const emails = parseEmails(cobranca.clienteEmails)
    if (emails.length === 0) {
      throw new Error(
        'Nenhum email válido encontrado para o cliente. Verifique o cadastro.'
      )
    }

    // 2. Gerar HTML do email
    const html = gerarHTMLCobranca(cobranca)

    // 3. Calcular valor total para o subject
    const valorTotal = this.calcularValorTotal(cobranca)

    // 4. Enviar email
    const info = await this.transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: emails.join(', '),
      subject: `Cobrança #${cobranca.id} - ${cobranca.periodo} - ${valorTotal}`,
      html,
    })

    // 5. Log de sucesso
    console.log('Email enviado com sucesso:', {
      cobrancaId: cobranca.id,
      cliente: cobranca.cliente,
      emails,
      messageId: info.messageId,
    })
  }

  /**
   * Calcula o valor total da cobrança para exibir no subject
   */
  private calcularValorTotal(cobranca: Cobranca): string {
    const horasMatch = cobranca.horas.match(/(\d+)h\s*(\d+)m/)
    if (!horasMatch) {
      return 'R$ 0,00'
    }

    const horas = parseInt(horasMatch[1])
    const minutos = parseInt(horasMatch[2])
    const horasDecimal = horas + minutos / 60
    const total = horasDecimal * cobranca.precoHora

    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
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
