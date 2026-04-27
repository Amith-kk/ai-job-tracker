import { z } from "zod"

export const jobSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["wishlist", "applied", "interview", "offer", "rejected"]),
  jobDescription: z.string().optional(),
  notes: z.string().optional(),
  appliedDate: z.string().optional()
})

export type JobInput = z.infer<typeof jobSchema>