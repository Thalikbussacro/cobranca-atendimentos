const API_URL = import.meta.env.VITE_API_URL || '/api'

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || 'Erro na requisição')
  }
  return response.json()
}

async function get(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`)
  return handleResponse(response)
}

async function post(endpoint, data, { signal } = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
    signal,
  })
  return handleResponse(response)
}

async function del(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' })
  return handleResponse(response)
}

// === Auth ===

export async function login(credentials) {
  return post('/auth/login', credentials)
}

// === Clientes ===

export async function getAllClientes() {
  return get('/clientes')
}

// === Cobranças ===

export async function getAllCobrancas(filters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.append('search', filters.search)
  if (filters.status) params.append('status', filters.status)
  if (filters.inicio) params.append('inicio', filters.inicio)
  if (filters.fim) params.append('fim', filters.fim)

  const queryString = params.toString()
  return get(`/cobrancas${queryString ? `?${queryString}` : ''}`)
}

export async function getPreview({ clienteId, dataInicial, dataFinal }) {
  const params = new URLSearchParams({ clienteId, dataInicial, dataFinal })
  return get(`/cobrancas/preview?${params}`)
}

export async function gerarCobrancas({ clienteIds, inicio, fim, precoHora }) {
  return post('/cobrancas/gerar', { clienteIds, inicio, fim, precoHora })
}

export async function enviarEmail(id, { signal } = {}) {
  return post(`/cobrancas/enviar/${id}`, undefined, { signal })
}

export async function enviarTodas() {
  return post('/cobrancas/enviar-todas')
}

export async function cancelarCobranca(id) {
  return del(`/cobrancas/${id}`)
}

export async function cancelarTodasCobrancas() {
  return del('/cobrancas')
}
