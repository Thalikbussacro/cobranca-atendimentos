'use client'

import { useState } from 'react'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'
import { Send, Mail } from 'lucide-react'

interface EnviarTodosButtonProps {
  totalCobrancas: number
  onConfirm: () => Promise<void>
}

export function EnviarTodosButton({ totalCobrancas, onConfirm }: EnviarTodosButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const handleConfirm = async () => {
    setEnviando(true)
    await onConfirm()
    setEnviando(false)
    setIsOpen(false)
  }

  return (
    <>
      <Button
        color="primary"
        size="sm"
        startContent={<Send className="h-4 w-4" />}
        onClick={() => setIsOpen(true)}
        className="font-bold"
      >
        Enviar Todas por E-mail
      </Button>

      <Modal isOpen={isOpen} onClose={() => !enviando && setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Enviar Cobranças por E-mail</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <Mail className="h-6 w-6 text-warning" />
                <div>
                  <div className="font-bold text-sm">
                    {totalCobrancas} cobrança(s) será(ão) enviada(s)
                  </div>
                  <div className="text-xs text-default-500">
                    Um e-mail será disparado automaticamente para cada cliente
                  </div>
                </div>
              </div>

              <div className="text-sm text-default-600">
                Cada e-mail conterá:
                <ul className="list-disc list-inside mt-2 space-y-1 text-default-500">
                  <li>Código e senha de acesso ao portal</li>
                  <li>Link para visualizar a cobrança</li>
                  <li>Relatório de atendimentos (PDF anexo)</li>
                  <li>Nota fiscal (quando disponível)</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setIsOpen(false)} isDisabled={enviando}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onClick={handleConfirm}
              isLoading={enviando}
              className="font-bold"
            >
              Confirmar Envio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
