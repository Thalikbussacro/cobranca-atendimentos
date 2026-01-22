'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: number
  sender: 'operador' | 'cliente'
  senderName: string
  text: string
  time: string
}

interface ChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cobrancaId: number
  clienteNome: string
  isClienteView?: boolean
  onInteraction?: () => void
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: 'operador',
    senderName: 'Operador',
    text: 'Olá! A cobrança foi gerada e enviada para seu e-mail.',
    time: '10:16',
  },
  {
    id: 2,
    sender: 'cliente',
    senderName: 'Cliente',
    text: 'Recebi sim, obrigado! Tenho uma dúvida sobre o atendimento do dia 15.',
    time: '10:20',
  },
  {
    id: 3,
    sender: 'operador',
    senderName: 'Operador',
    text: 'Claro! Pode me dizer qual é a dúvida?',
    time: '10:22',
  },
]

export function ChatModal({ 
  open, 
  onOpenChange, 
  cobrancaId, 
  clienteNome,
  isClienteView = false,
  onInteraction
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && onInteraction) {
      onInteraction()
    }
  }, [open, onInteraction])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: messages.length + 1,
      sender: isClienteView ? 'cliente' : 'operador',
      senderName: isClienteView ? 'Você' : 'Operador',
      text: newMessage,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages([...messages, message])
    setNewMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="flex items-center gap-2">
            <span>Conversa</span>
            <Badge variant="outline" className="text-so-blue">
              #{cobrancaId}
            </Badge>
            <span className="text-muted-foreground font-normal">
              - {clienteNome}
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = isClienteView ? msg.sender === 'cliente' : msg.sender === 'operador'
              
              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col',
                    isMe ? 'items-end' : 'items-start'
                  )}
                >
                  <span className="text-xs text-muted-foreground mb-1">
                    {msg.senderName} - {msg.time}
                  </span>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2 text-sm',
                      isMe
                        ? 'bg-so-blue text-white'
                        : 'bg-muted'
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
