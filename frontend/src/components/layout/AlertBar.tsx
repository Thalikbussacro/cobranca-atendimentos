'use client'

import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle, X, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AlertBarProps {
  title: string
  description: string
  variant?: 'success' | 'warning' | 'info' | 'default'
  dismissible?: boolean
  onDismiss?: () => void
}

export function AlertBar({ 
  title, 
  description, 
  variant = 'warning',
  dismissible = true,
  onDismiss 
}: AlertBarProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
    default: Info,
  }

  const Icon = icons[variant]

  return (
    <Alert variant={variant} className="relative mb-4">
      <Icon className="h-5 w-5" />
      <AlertTitle className="font-semibold">{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-6 w-6"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  )
}
