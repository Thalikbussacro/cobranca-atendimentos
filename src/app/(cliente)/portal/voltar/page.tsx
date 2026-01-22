'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VoltarAdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Limpar preview mode
    sessionStorage.removeItem('preview_mode')
    router.push('/cobrancas')
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted font-semibold">Voltando ao painel administrativo...</div>
    </div>
  )
}
