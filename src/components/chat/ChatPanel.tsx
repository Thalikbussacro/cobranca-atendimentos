'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Send, X, Mail, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: number
  sender: 'operador' | 'cliente'
  text: string
  time: string
}

interface ChatPanelProps {
  cobrancaId: number
  clienteNome: string
  onClose: () => void
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: 'operador',
    text: 'Enviado às 10:16 por Operador01',
    time: '10:16',
  },
  {
    id: 2,
    sender: 'cliente',
    text: 'Rodrigo Murla : Acesse a e/a x 12#23',
    time: '10:20',
  },
  {
    id: 3,
    sender: 'cliente',
    text: 'Revisão da qto cobrança para operador?',
    time: '10:22',
  },
]

export function ChatPanel({ cobrancaId, clienteNome, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: messages.length + 1,
      sender: 'operador',
      text: newMessage,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages([...messages, message])
    setNewMessage('')
  }

  return (
    <Card className="w-[400px] h-[500px] flex flex-col">
      {/* Header */}
      <CardHeader className="py-3 px-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Badge variant="outline" className="text-so-blue">
                #{cobrancaId}
              </Badge>
              {clienteNome}
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Ações rápidas */}
      <div className="px-4 py-2 border-b flex gap-2">
        <Button variant="outline" size="sm">
          <Mail className="h-3 w-3 mr-1" />
          Trocar e-mail
        </Button>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-3 w-3 mr-1" />
          Reenviar e-mail
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex',
                msg.sender === 'operador' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                  msg.sender === 'operador'
                    ? 'bg-so-blue text-white'
                    : 'bg-muted'
                )}
              >
                <p>{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Input */}
      <div className="p-3 flex gap-2">
        <Input
          placeholder="Envie a entrega da guia..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
