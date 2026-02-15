export interface User {
  id: string
  name: string
  email?: string
  role: 'admin'
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
