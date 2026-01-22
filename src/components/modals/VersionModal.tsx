'use client'

import { useRouter } from 'next/navigation'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Eye } from 'lucide-react'

interface VersionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VersionModal({ isOpen, onClose }: VersionModalProps) {
  const router = useRouter()

  const handleViewAsCliente = () => {
    sessionStorage.setItem('preview_mode', 'true')
    onClose()
    router.push('/portal')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Visualizar Como Cliente</ModalHeader>
        <ModalBody>
          <div className="text-center py-6">
            <Eye className="h-16 w-16 mx-auto text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Portal do Cliente</h3>
            <p className="text-sm text-default-500 mb-6 max-w-md mx-auto">
              Acesse a interface que seus clientes visualizam ao fazer login no sistema.
              Inclui consulta de cobranças, documentos e comunicação com suporte.
            </p>

            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <Button 
                color="primary" 
                onClick={handleViewAsCliente} 
                className="w-full font-bold"
                startContent={<Eye className="h-4 w-4" />}
              >
                Abrir Portal do Cliente
              </Button>

              <div className="text-xs text-default-600 bg-default-100 border border-default-200 rounded-lg p-3">
                Você poderá retornar ao painel administrativo a qualquer momento.
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" size="sm" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
