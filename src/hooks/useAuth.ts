'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/domain/entities/User'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          })

          const data = await response.json()

          if (data.success && data.user) {
            set({ user: data.user, isAuthenticated: true })
            return true
          }

          return false
        } catch (error) {
          console.error('Erro no login:', error)
          return false
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
