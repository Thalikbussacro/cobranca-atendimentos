'use client'

import './globals.css'
import { HeroUIProvider } from '@heroui/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Atendimento do Cliente - SO Automação</title>
        <meta name="description" content="Sistema de Cobrança de Atendimentos" />
      </head>
      <body>
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </body>
    </html>
  )
}
