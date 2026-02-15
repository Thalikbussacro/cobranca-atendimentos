import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCobrancas } from '@/hooks/useCobrancas'
import { Toolbar } from '@/components/cobrancas/Toolbar'
import { CobrancaTable } from '@/components/cobrancas/CobrancaTable'
import { AlertBar } from '@/components/layout/AlertBar'
import { sendEmail } from '@/services/cobrancaService'

export default function CobrancasPage() {
  const navigate = useNavigate()
  const { cobrancas, loading, filters, setFilters, refresh } = useCobrancas()
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [enviandoEmailId, setEnviandoEmailId] = useState<number | null>(null)
  const [cancelandoId, setCancelandoId] = useState<number | null>(null)

  const handleEnviarEmail = async (cobrancaId: number) => {
    try {
      setEnviandoEmailId(cobrancaId)
      const data = await sendEmail(cobrancaId)
      
      setSuccessMessage(data.message || 'E-mail enviado com sucesso!')
      setShowSuccessAlert(true)
      
      await refresh()
    } catch (error: any) {
      console.error('Erro ao enviar e-mail:', error)
      setSuccessMessage(`Erro: ${error.message}`)
      setShowSuccessAlert(true)
    } finally {
      setEnviandoEmailId(null)
    }
  }

  const handleCancelarCobranca = async (cobrancaId: number) => {
    console.log('Cancelar cobrança:', cobrancaId)
  }

  return (
    <div className="flex flex-col h-full">
      {showSuccessAlert && (
        <AlertBar message={successMessage} onClose={() => setShowSuccessAlert(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Cobranças</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie as cobranças de atendimento
          </p>
        </div>

        <Toolbar
          filters={filters}
          onFilterChange={setFilters}
          onNovaCobranca={() => navigate('/nova-cobranca')}
          loading={loading}
        />

        <div className="flex-1 overflow-hidden">
          <CobrancaTable
            cobrancas={cobrancas}
            onEnviarEmail={handleEnviarEmail}
            onCancelarCobranca={handleCancelarCobranca}
            enviandoEmailId={enviandoEmailId}
            cancelandoId={cancelandoId}
          />
        </div>
      </div>
    </div>
  )
}
