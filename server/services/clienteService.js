import { findAllClientes, findClienteById } from '../repositories/clienteRepository.js'
import { criarCliente } from '../models/Cliente.js'

export async function listarClientes() {
  const rows = await findAllClientes()
  return rows.map(criarCliente)
}

export async function buscarClientePorId(id) {
  const row = await findClienteById(id)
  if (!row) return null
  return criarCliente(row)
}
