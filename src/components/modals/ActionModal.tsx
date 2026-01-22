'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface ActionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
}

export function ActionModal({ isOpen, onClose, title, description }: ActionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <div className="text-sm text-default-500 leading-relaxed">{description}</div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" size="sm" onClick={onClose}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
