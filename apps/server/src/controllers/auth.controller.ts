import { Request, Response } from "express"
import { registerUser, loginUser } from "../services/auth.service"
import { sendSuccess, sendError } from "../utils/apiResponse.utils"

// ─── Register Controller ──────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerUser(req.body)
    sendSuccess(res, result, "User registered successfully", 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed"
    // 409 = Conflict — user already exists
    const statusCode = message.includes("already exists") ? 409 : 500
    sendError(res, message, statusCode)
  }
}

// ─── Login Controller ─────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    const result = await loginUser(email, password)
    sendSuccess(res, result, "Login successful")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed"
    // 401 = Unauthorized
    sendError(res, message, 401)
  }
}

// ─── Get Current User ─────────────────────────────────────
// Protected route — req.user is set by auth middleware
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    sendSuccess(res, req.user, "User fetched successfully")
  } catch (error) {
    sendError(res, "Failed to fetch user", 500)
  }
}
