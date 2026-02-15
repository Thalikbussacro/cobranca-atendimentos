import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { getPreview, createCobranca } from '@/services/cobrancaService'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function ConfirmarCobrancaPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const formData = location.state as any
  const [preview, setPreview] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!formData) {
      navigate('/nova-cobranca')
      return
    }
    loadPreview()
  }, [])

  const loadPreview = async () => {
    try {
      const data = await getPreview(formData)
      setPreview(data.preview)
    } catch (error) {
      console.error('Erro ao carregar preview:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    setCreating(true)
    try {
      for (const item of preview) {
        await createCobranca({
          cliente: item.clienteNome,
          clienteId: item.clienteId,
          dataInicial: formData.dataInicial,
          dataFinal: formData.dataFinal,
          precoHora: 100,
        })
      }
      navigate('/cobrancas')
    } catch (error) {
      console.error('Erro ao criar cobrança:', error)
      alert('Erro ao criar cobrança')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/nova-cobranca')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Confirmar Cobranças</CardTitle>
        </CardHeader>
        <CardContent>
          {preview.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum atendimento encontrado no período selecionado.
            </p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {preview.map((item) => (
                  <div key={item.clienteId} className="border p-4 rounded">
                    <h3 className="font-semibold">{item.clienteNome}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.atendimentos} atendimentos - {item.tempo}
                    </p>
                  </div>
                ))}
              </div>

              <Button onClick={handleConfirm} className="w-full" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Confirmar e Criar Cobranças'
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
