import axios from "axios"

// ─── Axios Instance ───────────────────────────────────────
// Base URL uses Vite proxy — /api → localhost:5000/api
// This means you never hardcode the backend URL
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
})

// ─── Request Interceptor ──────────────────────────────────
// Runs before EVERY request automatically
// Reads token from localStorage and adds to Authorization header
// This means you NEVER manually add "Bearer token" to API calls
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ─────────────────────────────────
// Runs after EVERY response automatically
// If server returns 401 (unauthorized) — token expired
// Clear storage and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>{
    // Check if the user is currently on an auth page
    const isAuthPage = 
      window.location.pathname === "/login" || 
      window.location.pathname === "/register"

    if (error.response?.status === 401 && !isAuthPage) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default axiosInstance