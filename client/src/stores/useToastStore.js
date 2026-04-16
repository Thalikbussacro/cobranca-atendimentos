import { create } from 'zustand'

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (type, message, duration = 4000) => {
    const id = Date.now() + Math.random()
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }))
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))
