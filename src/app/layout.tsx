import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Atendimento do Cliente - SO Automação',
  description: 'Sistema de gestão de cobranças de atendimentos técnicos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
