import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

// ─── App Layout ───────────────────────────────────────────
// Outlet renders whatever child route is currently active
// Like a slot — Dashboard, Jobs, AI Tools all render here
const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — always visible */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout