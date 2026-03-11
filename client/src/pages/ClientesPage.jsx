import { useState, useEffect } from 'react'
import { TabelaClientes } from '@/components/TabelaClientes'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getAllClientes } from '@/services/api'

export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllClientes()
      .then((data) => setClientes(data.clientes))
      .catch((error) => console.error('Erro ao carregar clientes:', error))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Clientes</h1>
        <p className="text-sm text-gray-600 mt-1">Lista de clientes cadastrados</p>
      </div>

      <TabelaClientes clientes={clientes} />
    </div>
  )
}
