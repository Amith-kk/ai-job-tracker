import { z } from "zod"

const jobStatusEnum = z.enum([
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected"
])

//  Create Job Schema 
export const createJobSchema = z.object({
  body: z.object({
    company: z
      .string({ required_error: "Company name is required" })
      .min(1, "Company name is required")
      .max(100, "Company name cannot exceed 100 characters")
      .trim(),
    role: z
      .string({ required_error: "Role is required" })
      .min(1, "Role is required")
      .max(100, "Role cannot exceed 100 characters")
      .trim(),
    status: jobStatusEnum.default("applied"),
    jobDescription: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    appliedDate: z.string().optional()
  })
})

//  Update Job Schema 
// All fields optional for updates — only send what changed
export const updateJobSchema = z.object({
  body: z.object({
    company: z.string().min(1).max(100).trim().optional(),
    role: z.string().min(1).max(100).trim().optional(),
    status: jobStatusEnum.optional(),
    jobDescription: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    appliedDate: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: "Job ID is required" })
  })
})

export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>