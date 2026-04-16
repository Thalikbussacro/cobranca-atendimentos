import { useState, useEffect, useMemo } from 'react'
import { TabelaClientes } from '@/components/TabelaClientes'
import { getAllClientes } from '@/services/api'
import { Input } from '@/components/ui/input'
import { Search, Users } from 'lucide-react'

export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    getAllClientes()
      .then((data) => setClientes(data.clientes))
      .catch((error) => console.error('Erro ao carregar clientes:', error))
      .finally(() => setLoading(false))
  }, [])

  const filteredClientes = useMemo(() => {
    if (!busca.trim()) return clientes
    const termo = busca.toLowerCase()
    return clientes.filter(
      (c) =>
        c.nome?.toLowerCase().includes(termo) ||
        c.cnpj?.includes(termo) ||
        c.email?.toLowerCase().includes(termo)
    )
  }, [clientes, busca])

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">Lista de clientes cadastrados</p>
        </div>
        {!loading && clientes.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
            <Users className="h-4 w-4" />
            {clientes.length} cliente(s)
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="relative w-full sm:max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CNPJ ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9 h-9 md:h-10 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <TabelaClientes clientes={filteredClientes} loading={loading} />
      </div>
    </div>
  )
}
