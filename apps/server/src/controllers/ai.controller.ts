import { Request, Response } from "express"
import {
  generateCoverLetter,
  analyzeResumeMatch,
  generateInterviewQuestions
} from "../services/ai.service"
import { sendSuccess, sendError } from "../utils/apiResponse.utils"

// ─── Cover Letter Controller ──────────────────────────────
export const coverLetter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobDescription } = req.body

    // Get user's name from auth middleware
    const userName = req.user!.name

    const result = await generateCoverLetter(jobDescription, userName)

    sendSuccess(res, { coverLetter: result }, "Cover letter generated successfully")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate cover letter"
    sendError(res, message, 500)
  }
}

// ─── Resume Match Controller ──────────────────────────────
export const resumeMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobDescription, userSkills } = req.body

    const result = await analyzeResumeMatch(jobDescription, userSkills)

    sendSuccess(res, result, "Resume match analyzed successfully")
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Failed to analyze resume match"

    // JSON parse errors from Gemini response
    if (message.includes("JSON")) {
      sendError(res, "AI response parsing failed — please try again", 500)
      return
    }

    sendError(res, message, 500)
  }
}

// ─── Interview Prep Controller ────────────────────────────
export const interviewPrep = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobDescription, role } = req.body

    const result = await generateInterviewQuestions(jobDescription, role)

    sendSuccess(res, result, "Interview questions generated successfully")
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Failed to generate interview questions"

    if (message.includes("JSON")) {
      sendError(res, "AI response parsing failed — please try again", 500)
      return
    }

    sendError(res, message, 500)
  }
}