import { Response } from "express"

// ─── Standard API Response Utility ───────────────────────
// Every single API response in this project goes through here
// This guarantees consistent response shape across all endpoints
// Frontend always knows exactly what to expect

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  })
}

export const sendError = (
  res: Response,
  message: string = "Something went wrong",
  statusCode: number = 500,
  errors?: unknown
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  })
}