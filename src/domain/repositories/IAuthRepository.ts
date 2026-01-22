import { User, LoginCredentials, AuthResponse } from '@/domain/entities/User'

export interface IAuthRepository {
  authenticate(credentials: LoginCredentials): Promise<AuthResponse>
  validateToken(token: string): Promise<User | null>
}
