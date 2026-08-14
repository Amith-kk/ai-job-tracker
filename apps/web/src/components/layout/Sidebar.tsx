import { NavLink, useNavigate } from "react-router-dom"
import useAuthStore from "@/store/authStore"

// ─── Navigation Items ─────────────────────────────────────
const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "📊"
  },
  {
    path: "/jobs",
    label: "Jobs",
    icon: "💼"
  },
  {
    path: "/ai-tools",
    label: "AI Tools",
    icon: "🤖"
  }
]

const Sidebar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">
          🎯 Job Tracker
        </h1>
        <p className="text-xs text-gray-500 mt-1">AI-Powered</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium transition-colors duration-150
              ${isActive
                ? "bg-primary-50 text-primary-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar — first letter of name */}
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700
                          flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-red-600
                     hover:bg-red-50 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>

    </aside>
  )
}

export default Sidebar