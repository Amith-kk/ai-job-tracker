import jwt from "jsonwebtoken"

// ─── Generate Token ───────────────────────────────────────
// Read process.env INSIDE the function — not at module level
// This ensures dotenv has already loaded the variables
export const generateToken = (userId: string): string => {
  const JWT_SECRET = process.env.JWT_SECRET

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables")
  }

  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  )
}

// ─── Verify Token ─────────────────────────────────────────
export const verifyToken = (token: string): jwt.JwtPayload => {
  const JWT_SECRET = process.env.JWT_SECRET

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables")
  }

  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
}