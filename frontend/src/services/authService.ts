import { post } from './api'
import { AuthResponse, LoginCredentials } from '@/types/user'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login', credentials)
}
