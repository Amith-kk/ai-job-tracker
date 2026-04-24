import { Router } from "express"
import {
  coverLetter,
  resumeMatch,
  interviewPrep
} from "../controllers/ai.controller"
import { protect } from "../middleware/auth.middleware"
import validate from "../middleware/validate.middleware"
import {
  coverLetterSchema,
  resumeMatchSchema,
  interviewPrepSchema
} from "../validations/ai.validation"

const router = Router()

// All AI routes require authentication
router.use(protect)

// POST /api/ai/cover-letter
router.post("/cover-letter", validate(coverLetterSchema), coverLetter)

// POST /api/ai/match-resume
router.post("/match-resume", validate(resumeMatchSchema), resumeMatch)

// POST /api/ai/interview-prep
router.post("/interview-prep", validate(interviewPrepSchema), interviewPrep)

export default router