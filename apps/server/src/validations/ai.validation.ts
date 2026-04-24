import { z } from "zod"

// ─── Cover Letter Schema ──────────────────────────────────
export const coverLetterSchema = z.object({
  body: z.object({
    jobDescription: z
      .string({ required_error: "Job description is required" })
      .min(50, "Job description must be at least 50 characters")
      .max(5000, "Job description is too long"),
  })
})

// ─── Resume Match Schema ──────────────────────────────────
export const resumeMatchSchema = z.object({
  body: z.object({
    jobDescription: z
      .string({ required_error: "Job description is required" })
      .min(50, "Job description must be at least 50 characters")
      .max(5000, "Job description is too long"),
    userSkills: z
      .string({ required_error: "Your skills are required" })
      .min(10, "Please provide your skills")
      .max(1000, "Skills list is too long")
  })
})

// ─── Interview Prep Schema ────────────────────────────────
export const interviewPrepSchema = z.object({
  body: z.object({
    jobDescription: z
      .string({ required_error: "Job description is required" })
      .min(50, "Job description must be at least 50 characters")
      .max(5000, "Job description is too long"),
    role: z
      .string({ required_error: "Role is required" })
      .min(2, "Role is required")
      .max(100, "Role name is too long")
  })
})

export type CoverLetterInput = z.infer<typeof coverLetterSchema>
export type ResumeMatchInput = z.infer<typeof resumeMatchSchema>
export type InterviewPrepInput = z.infer<typeof interviewPrepSchema>