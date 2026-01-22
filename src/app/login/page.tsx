'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brand } from '@/components/layout/Brand'
import { Button, Input, Card, CardBody, Tabs, Tab } from '@heroui/react'
import { useAuth } from '@/hooks/useAuth'
import { Shield, User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginType, setLoginType] = useState<'admin' | 'cliente'>('admin')

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
      <Card className="w-full max-w-[460px] shadow-none border border-default-200">
        <CardBody className="gap-4 p-6">
          <Brand className="mb-2" />

          <Tabs
            selectedKey={loginType}
            onSelectionChange={(key) => setLoginType(key as 'admin' | 'cliente')}
            variant="underlined"
            classNames={{
              tabList: 'w-full',
              tab: 'font-semibold',
            }}
          >
            <Tab
              key="admin"
              title={
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Administrativo
                </div>
              }
            />
            <Tab
              key="cliente"
              title={
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Portal do Cliente
                </div>
              }
            />
          </Tabs>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
            {loginType === 'admin' ? (
              <>
                <Input
                  label="Usuário"
                  placeholder="Digite seu usuário"
                  value={username}
                  onValueChange={setUsername}
                  isDisabled={loading}
                  variant="bordered"
                  description="Ex: admin, operador01"
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
              </>
            ) : (
              <>
                <Input
                  label="Código de Acesso"
                  placeholder="Ex: COB1001"
                  value={username}
                  onValueChange={setUsername}
                  isDisabled={loading}
                  variant="bordered"
                  description="Código recebido por e-mail"
                />

                <Input
                  label="Senha"
                  type="password"
                  placeholder="Senha recebida por e-mail"
                  value={password}
                  onValueChange={setPassword}
                  isDisabled={loading}
                  variant="bordered"
                />
              </>
            )}

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
              Versão: <b>1.0.0</b>
            </small>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
