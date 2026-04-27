import { create } from "zustand"
import { persist } from "zustand/middleware"

// ─── Auth State Interface ─────────────────────────────────
interface User {
  _id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

// ─── Auth Store ───────────────────────────────────────────
// persist middleware automatically saves to localStorage
// So user stays logged in after page refresh
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Called after successful login/register
      login: (user: User, token: string) => {
        localStorage.setItem("token", token)
        set({ user, token, isAuthenticated: true })
      },

      // Called when user logs out or token expires
      logout: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        set({ user: null, token: null, isAuthenticated: false })
      }
    }),
    {
      name: "auth-storage",   // localStorage key name
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore