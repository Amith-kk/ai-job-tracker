import axios from "@/lib/axios"
import { AuthResponse } from "@repo/types"

export const authService = {
  // Register new user
  register: async (data: {
    name: string
    email: string
    password: string
  }): Promise<AuthResponse> => {
    const response = await axios.post("/auth/register", data)
    return response.data.data
  },

  // Login existing user
  login: async (data: {
    email: string
    password: string
  }): Promise<AuthResponse> => {
    const response = await axios.post("/auth/login", data)
    return response.data.data
  },

  // Get current user
  getMe: async () => {
    const response = await axios.get("/auth/me")
    return response.data.data
  }
}