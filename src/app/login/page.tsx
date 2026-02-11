'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { Brand } from '@/components/layout/Brand'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    codigo: '',
    senha: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.codigo, 
          password: formData.senha 
        }),
      })

      const data = await response.json()

      if (data.success) {
        login(data.user, data.token)
        router.push('/cobrancas')
      } else {
        setError(data.message || 'Credenciais inválidas')
      }
    } catch {
      setError('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-3 md:p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 md:pt-8 pb-4 md:pb-6 px-4 md:px-8">
          {/* Logo */}
          <div className="flex justify-center mb-6 md:mb-8">
            <Brand />
          </div>

          {/* Título */}
          <p className="text-center text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
            Acesse o portal de atendimentos com o código e senha fornecidos.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código de Acesso</Label>
              <Input
                id="codigo"
                placeholder="100 $4512.784"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Rodapé */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Dica: Use "admin" ou "cliente1" para testar.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
