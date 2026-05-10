/**
 * @fileoverview Global Zustand store for auth + app state
 * Combines auth state, theme, and UI state in one store with persistence
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** ─── AUTH STORE ──────────────────────────────────────────── */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      /** Set the logged-in user + access token */
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      /** Update user fields (after profile edit) */
      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),

      /** Clear auth state on logout */
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),

      setLoading: (val) => set({ isLoading: val }),
    }),
    {
      name: 'ecostreak-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

/** ─── THEME STORE ─────────────────────────────────────────── */
export const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.darkMode
          document.documentElement.classList.toggle('dark', next)
          return { darkMode: next }
        }),
      initTheme: () =>
        set((state) => {
          document.documentElement.classList.toggle('dark', state.darkMode)
          return {}
        }),
    }),
    { name: 'ecostreak-theme' }
  )
)

/** ─── UI STORE ────────────────────────────────────────────── */
export const useUIStore = create((set) => ({
  sidebarOpen: false,
  activeModal: null,
  setSidebarOpen: (val) => set({ sidebarOpen: val }),
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}))
