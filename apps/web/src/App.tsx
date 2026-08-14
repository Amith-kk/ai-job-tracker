import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "@/components/layout/ProtectedRoute"
import AppLayout from "@/components/layout/AppLayout"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import DashboardPage from "@/pages/DashboardPage"
import JobsPage from "@/pages/JobsPage"
import AIToolsPage from "@/pages/AIToolsPage"

const App = () => {
  return (
    <Routes>
      {/* Public routes — anyone can access */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes — must be logged in */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/ai-tools" element={<AIToolsPage />} />
      </Route>

      {/* Default redirect — / goes to /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch all — unknown URLs go to /dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App