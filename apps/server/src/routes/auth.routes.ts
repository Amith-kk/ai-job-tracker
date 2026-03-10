import { Router } from "express"
import { register, login, getMe } from "../controllers/auth.controller"
import { protect } from "../middleware/auth.middleware"
import validate from "../middleware/validate.middleware"
import { registerSchema, loginSchema } from "../validations/auth.validation"

const router = Router()

// ─── Public Routes ────────────────────────────────────────
// POST /api/auth/register
router.post("/register", validate(registerSchema), register)

// POST /api/auth/login
router.post("/login", validate(loginSchema), login)

// ─── Protected Routes ─────────────────────────────────────
// GET /api/auth/me
router.get("/me", protect, getMe)

export default router