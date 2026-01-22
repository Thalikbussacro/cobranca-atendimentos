export type UserRole = 'admin' | 'cliente'

export interface User {
  id: string
  name: string
  email?: string
  role: UserRole
  clienteId?: number
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  message?: string
}
