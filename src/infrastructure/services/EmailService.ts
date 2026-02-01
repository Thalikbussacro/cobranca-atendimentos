import { Cobranca } from '@/domain/entities/Cobranca'

/**
 * Interface para serviço de envio de e-mails
 * TODO: Implementar envio real via SMTP
 */
export interface IEmailService {
  enviarCobranca(cobranca: Cobranca): Promise<void>
}

/**
 * Stub do serviço de e-mail
 * Esta é uma implementação temporária que será substituída
 * por uma implementação real usando SMTP
 */
export class EmailService implements IEmailService {
  async enviarCobranca(cobranca: Cobranca): Promise<void> {
    // TODO: Implementar envio real
    // 1. Configurar transporte SMTP usando variáveis de ambiente
    // 2. Gerar HTML do e-mail com os dados da cobrança
    // 3. Enviar e-mail para os endereços do cliente
    // 4. Tratar erros de envio

    console.log('EmailService.enviarCobranca() - Implementação futura')
    console.log('Cobrança:', cobranca.id)
    console.log('Cliente:', cobranca.cliente)
    console.log('E-mails destino:', cobranca.clienteEmails)

    // Simulação de envio
    return Promise.resolve()
  }
}

/**
 * Exemplo de como implementar o envio real usando nodemailer:
 *
 * import nodemailer from 'nodemailer'
 *
 * export class EmailServiceSMTP implements IEmailService {
 *   private transporter: nodemailer.Transporter
 *
 *   constructor() {
 *     this.transporter = nodemailer.createTransport({
 *       host: process.env.SMTP_HOST,
 *       port: parseInt(process.env.SMTP_PORT || '587'),
 *       secure: process.env.SMTP_SECURE === 'true',
 *       auth: {
 *         user: process.env.SMTP_USER,
 *         pass: process.env.SMTP_PASSWORD,
 *       },
 *     })
 *   }
 *
 *   async enviarCobranca(cobranca: Cobranca): Promise<void> {
 *     const emails = cobranca.clienteEmails.split(';').filter(e => e.trim())
 *
 *     const html = this.gerarHTMLCobranca(cobranca)
 *
 *     await this.transporter.sendMail({
 *       from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
 *       to: emails.join(', '),
 *       subject: `Cobrança #${cobranca.id} - ${cobranca.periodo}`,
 *       html,
 *     })
 *   }
 *
 *   private gerarHTMLCobranca(cobranca: Cobranca): string {
 *     // Gerar HTML com template da cobrança
 *     return `...`
 *   }
 * }
 */
