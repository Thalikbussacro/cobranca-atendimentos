'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brand } from '@/components/layout/Brand'
import { Button, Input, Card, CardBody } from '@heroui/react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState('operador01')
  const [password, setPassword] = useState('123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const success = await login(username, password)

    if (success) {
      // Redirecionar baseado no tipo de usuário
      const { user } = useAuth.getState()
      if (user?.role === 'admin') {
        router.push('/cobrancas')
      } else if (user?.role === 'cliente') {
        router.push('/portal')
      }
    } else {
      setError('Usuário ou senha inválidos')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-default-50">
      <Card className="w-full max-w-[420px] shadow-none border border-default-200">
        <CardBody className="gap-4 p-6">
          <Brand className="mb-2" />

          <h1 className="text-lg font-bold">Acesso ao sistema</h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="Usuário"
              placeholder="Digite seu usuário"
              value={username}
              onValueChange={setUsername}
              isDisabled={loading}
              variant="bordered"
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onValueChange={setPassword}
              isDisabled={loading}
              variant="bordered"
            />

            {error && (
              <div className="text-sm text-danger font-semibold bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              color="primary" 
              isLoading={loading} 
              isDisabled={loading}
              className="w-full font-bold"
            >
              Entrar
            </Button>
          </form>

          <div className="flex justify-between items-center gap-2.5 text-xs text-default-500 flex-wrap">
            <small>Ambiente: Interno</small>
            <small>
              Versão: <b>0.1 (mockup)</b>
            </small>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
