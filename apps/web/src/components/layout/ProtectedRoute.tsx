import { Navigate } from "react-router-dom"
import useAuthStore from "@/store/authStore"

// ─── What This Does ───────────────────────────────────────
// Wraps any page that requires authentication
// If user is logged in → show the page (children)
// If user is not logged in → redirect to /login

interface ProtectedRouteProps {
  children: React.ReactNode  // the page component to protect
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Read auth state from Zustand global store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Not logged in → send to login page
  // replace: true means /login replaces current history entry
  // So pressing back button won't go back to protected page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Logged in → render the actual page
  return <>{children}</>
}

export default ProtectedRoute