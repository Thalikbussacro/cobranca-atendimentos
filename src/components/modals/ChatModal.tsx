'use client'

import { useState, useEffect, useRef } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Send } from 'lucide-react'

interface ChatMessage {
  id: string
  author: string
  text: string
  timestamp: Date
  isMe: boolean
}

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  cobrancaId: number | null
  clienteNome: string
}

export function ChatModal({ isOpen, onClose, cobrancaId, clienteNome }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && cobrancaId) {
      setMessages([
        {
          id: '1',
          author: 'Sistema',
          text: 'Chat iniciado. Histórico de conversas com o atendente será exibido aqui.',
          timestamp: new Date(),
          isMe: false,
        },
        {
          id: '2',
          author: 'Atendente',
          text: 'Quais informações o cliente solicitou sobre esta cobrança?',
          timestamp: new Date(),
          isMe: false,
        },
        {
          id: '3',
          author: 'Operador',
          text: 'Cliente solicitou detalhamento de 2 atendimentos específicos.',
          timestamp: new Date(),
          isMe: true,
        },
      ])
    }
  }, [isOpen, cobrancaId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || !cobrancaId) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      author: 'Operador',
      text: inputValue,
      timestamp: new Date(),
      isMe: true,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue('')

    // Mock de resposta automática
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            author: 'Atendente',
            text: 'Entendido. Vou analisar e preparar o resumo.',
            timestamp: new Date(),
            isMe: false,
          },
        ])
      }, 700)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          Chat interno • Cobrança #{cobrancaId} • {clienteNome}
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2.5 h-[380px]">
            <div className="flex-1 border border-default-200 rounded-lg bg-white p-3 overflow-auto">
              <div className="flex flex-col gap-2.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[82%] px-3 py-2.5 rounded-lg border text-sm ${
                      msg.isMe
                        ? 'ml-auto border-primary/25 bg-primary/8'
                        : 'border-default-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2.5 mb-1 text-[11px] text-default-500 font-bold">
                      <span>{msg.author}</span>
                      <span>{msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div>{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="flex gap-2.5">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={handleKeyDown}
                variant="bordered"
              />
              <Button color="primary" size="sm" onClick={handleSend} className="font-bold">
                <Send className="h-4 w-4" />
                Enviar
              </Button>
            </div>

            <div className="text-xs text-default-500">
              Comunicação interna entre operador e atendente. Mensagens são registradas no histórico.
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
