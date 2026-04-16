import { listarClientes } from '../services/clienteService.js'

export async function listar(req, res) {
  try {
    const clientes = await listarClientes()
    return res.json({ clientes })
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return res.status(500).json({ success: false, message: 'Erro ao buscar clientes' })
  }
}
