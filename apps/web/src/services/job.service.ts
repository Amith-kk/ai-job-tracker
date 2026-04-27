import axios from "@/lib/axios"
import { Job } from "@repo/types"

export const jobService = {
  // Get all jobs with optional filters
  getAll: async (filters?: {
    status?: string
    sort?: string
  }): Promise<Job[]> => {
    const params = new URLSearchParams()
    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status)
    }
    if (filters?.sort) {
      params.append("sort", filters.sort)
    }
    const response = await axios.get(`/jobs?${params.toString()}`)
    return response.data.data
  },

  // Get single job
  getById: async (id: string): Promise<Job> => {
    const response = await axios.get(`/jobs/${id}`)
    return response.data.data
  },

  // Create job
  create: async (data: {
    company: string
    role: string
    status: string
    jobDescription?: string
    notes?: string
    appliedDate?: string
  }): Promise<Job> => {
    const response = await axios.post("/jobs", data)
    return response.data.data
  },

  // Update job
  update: async (id: string, data: Partial<{
    company: string
    role: string
    status: string
    jobDescription?: string
    notes?: string
  }>): Promise<Job> => {
    const response = await axios.put(`/jobs/${id}`, data)
    return response.data.data
  },

  // Delete job
  delete: async (id: string): Promise<void> => {
    await axios.delete(`/jobs/${id}`)
  },

  // Get stats for dashboard
  getStats: async (): Promise<Record<string, number>> => {
    const response = await axios.get("/jobs/stats")
    return response.data.data
  }
}